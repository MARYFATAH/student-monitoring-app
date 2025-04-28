import React, { useState, useEffect } from "react";
import { ParentDashboardSideBar } from "./ParentDashboardSideBar"; // Sidebar component
import { EventList } from "../Events/EventList"; // Displays events related to their children
import { StudentProfile } from "../Students/StudentProfile"; // Displays student profile
import { useAuth } from "@clerk/clerk-react"; // For authentication
import { ProfileContext } from "../../Context/ProfileContext";
import { ProfileProvider } from "../../Context/ProfileProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome for icons
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons"; // Icons for profile details

export function ParentDashboard() {
  const { profile } = React.useContext(ProfileContext); // Access profile context
  console.log("Parent Profile Data:.................", profile); // Debugging line
  const { getToken } = useAuth(); // Authentication token for secure API access
  const [activeSection, setActiveSection] = useState("students");
  const [studentProfile, setStudentProfile] = useState({}); // Student profile data
  const [homework, setHomework] = useState([]); // Homework data
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the events related to the students of the parent
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch(
          "http://localhost:3000/assignments?assignment_type=test",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // fetch homework
  useEffect(() => {
    const fetchHomework = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch(
          "http://localhost:3000/assignments?assignment_type=homework",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        setHomework(data);
      } catch (err) {
        console.error("Error fetching homework:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomework();
  }, []);

  return (
    <div className="h-screen flex bg-gradient-to-r from-violet-100 to-purple-200">
      {/* Sidebar */}
      <ParentDashboardSideBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className="w-[300px]"
      />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 sm:px-4 md:px-6 lg:px-8 overflow-y-auto">
        {activeSection === "students" && profile && (
          <div className="space-y-6">
            {/* Student Profile Section */}
            <div className="transition hover:shadow-lg transform hover:-translate-y-1">
              <h2 className="text-xl font-semibold text-violet-800 mb-4 flex items-center space-x-2">
                <FontAwesomeIcon icon={faUser} className="text-violet-600" />
                <span>Student Profile</span>
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-700">
                  {profile.first_name} {profile.last_name}
                </h3>
                <div className="text-gray-500 mt-2 space-y-2">
                  <p className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-violet-500"
                    />
                    <span>{profile.email}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-violet-500"
                    />
                    <span>{profile.phone_number}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-violet-500"
                    />
                    <span>{profile.address}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="text-violet-500"
                    />
                    <span>{profile.dob}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-4 rounded-lg shadow-md text-white text-center">
              <h2 className="text-lg font-semibold mb-2">
                Welcome, {profile.first_name}!
              </h2>
              <p className="text-sm">
                Stay updated with your child’s progress, events, and more.
                Explore your dashboard for more details!
              </p>
            </div>

            {/* Interactive Buttons Section */}
            <div className="flex justify-evenly">
              <button
                onClick={() => alert("Messages functionality coming soon!")}
                className="py-2 px-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition shadow"
              >
                View Messages
              </button>
              <button
                onClick={() => alert("Parent-Teacher Meeting scheduled!")}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        )}

        {/* Events Section */}
        {activeSection === "events" && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Events
            </h1>
            {loading ? (
              <p className="text-gray-500">Loading events...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white p-4 rounded-lg shadow transition hover:shadow-lg hover:bg-violet-50"
                  >
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      {event.name}
                    </h2>
                    <p className="text-gray-600">
                      <strong>Date:</strong> {event.date}
                    </p>
                    <p className="text-gray-600">
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p className="text-gray-600">{event.description}</p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() =>
                          alert(`You have RSVP’d to ${event.name}`)
                        }
                        className="py-1 px-3 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
                      >
                        RSVP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events found.</p>
            )}
          </div>
        )}
        {/* //homework section */}
        {activeSection === "homework" && (
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Homework
            </h1>
            {loading ? (
              <p className="text-gray-500">Loading homework...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : homework.length > 0 ? (
              <div className="space-y-4">
                {homework.map((homework) => (
                  <div
                    key={homework.id}
                    className="bg-white p-4 rounded-lg shadow transition hover:shadow-lg hover:bg-violet-50"
                  >
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      {homework.name}
                    </h2>
                    <p className="text-gray-600">{homework.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No homework found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
