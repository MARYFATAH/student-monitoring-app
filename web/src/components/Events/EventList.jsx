import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication
import { EventDetails } from "./EventDetails"; // Import EventDetails component

export function EventList({ events, onEventClick }) {
  const [eventList, setEventList] = useState(events);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { getToken } = useAuth(); // Clerk authentication hook

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:3000/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEventList(data);
      console.log("Event data:", data); // Debugging line
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []); // Fetch events on component mount

  return (
    <div className="p-6 rounded-lg  space-y-6">
      {/* <h2 className="text-2xl font-bold text-violet-800">Event List</h2> */}
      {loading ? (
        <p className="text-violet-500">Loading events...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : eventList.length > 0 ? (
        <div className="space-y-4">
          {eventList.map((event) => (
            <div key={event.id} className=" p-4  ">
              <EventDetails event={event} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-violet-500">No events found.</p>
      )}
    </div>
  );
}
