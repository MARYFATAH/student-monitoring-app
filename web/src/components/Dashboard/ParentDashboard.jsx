import React, { useState, useEffect } from "react";
import { ParentDashboardSideBar } from "./ParentDashboardSideBar"; // Sidebar component
import { useAuth } from "@clerk/clerk-react"; // For authentication
import { ProfileContext } from "../../Context/ProfileContext";
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
  const { getToken } = useAuth(); // Authentication token for secure API access
  const [activeSection, setActiveSection] = useState("students"); // Sidebar navigation state
  const [scores, setScores] = useState([]); // Student scores
  const [homework, setHomework] = useState([]); // Homework data
  const [events, setEvents] = useState([]); // Events data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch events related to the students
  useEffect(() => {
    const fetchEvents = async () => {
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
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [getToken]);

  // Fetch homework related to the students
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
  }, [getToken]);

  // Fetch scores related to the students
  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await fetch("http://localhost:3000/scores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(
            `HTTP Error! Status: ${response.status}. ${errorMessage}`
          );
        }

        const data = await response.json();
        console.log("Fetched scores:", data);
        setScores(data);
      } catch (err) {
        console.error("Error fetching scores:", err.message || err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [getToken]);

  return (
    <div className="h-screen flex bg-gradient-to-r from-violet-100 to-purple-200">
      {/* Sidebar */}
      <ParentDashboardSideBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className="w-[300px]"
      />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 sm:px-4 md:px-6 lg:px-8 overflow-y-auto bg-gradient-to-r from-blue-500 to-purple-500                                                                                                       ">
        {/* Student Profile Section */}
        {activeSection === "students" && profile && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* Events Section */}
        {activeSection === "events" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-violet-800">
              Upcoming Events
            </h1>
            {loading ? (
              <div className="flex justify-center items-center">
                <p className="text-gray-500 animate-pulse">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-500 font-bold">Error: {error}</p>
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-6">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto hover:scale-105 transition-transform duration-300"
                  >
                    <div className="bg-violet-500 text-white rounded-t-lg px-4 py-3 text-center shadow">
                      <h2 className="text-lg font-bold">
                        {event.name || "Event Name"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-6 p-6">
                      <div className="flex flex-col items-center bg-violet-50 rounded-lg shadow-md p-4">
                        <span className="text-3xl font-extrabold text-violet-800">
                          {new Date(event.event_date).toLocaleDateString(
                            "en-US",
                            { day: "2-digit" }
                          )}
                        </span>
                        <span className="text-lg text-violet-600">
                          {new Date(event.event_date).toLocaleDateString(
                            "en-US",
                            { month: "short" }
                          )}
                        </span>
                        <span className="text-sm text-violet-500">
                          {new Date(event.event_date).toLocaleDateString(
                            "en-US",
                            { weekday: "long" }
                          )}
                        </span>
                      </div>
                      <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
                        <p className="text-base text-gray-600 mb-4 break-words">
                          {event.description || "No description available."}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold text-gray-700">
                            Location:{" "}
                          </span>
                          {event.location || "Not provided"}
                        </p>
                        {event.start_time && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-700">
                              Start Time:{" "}
                            </span>
                            {event.start_time}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">No upcoming events found.</p>
              </div>
            )}
          </div>
        )}

        {/* Homework Section */}
        {activeSection === "homework" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-violet-800">
              Homework
            </h1>
            {loading ? (
              <div className="flex justify-center items-center">
                <p className="text-gray-500 animate-pulse">
                  Loading homework...
                </p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-500 font-bold">Error: {error}</p>
              </div>
            ) : homework.length > 0 ? (
              <div className="space-y-6">
                {homework.map((hw) => (
                  <div
                    key={hw.id}
                    className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto hover:scale-105 transition-transform duration-300"
                  >
                    <div className="bg-violet-500 text-white rounded-t-lg px-4 py-3 text-center shadow">
                      <h2 className="text-lg font-bold">
                        {hw.name || "Homework Name"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-6 p-6">
                      <div className="flex flex-col items-center bg-violet-50 rounded-lg shadow-md p-4">
                        <span className="text-3xl font-extrabold text-violet-800">
                          {new Date(hw.due_date).toLocaleDateString("en-US", {
                            day: "2-digit",
                          })}
                        </span>
                        <span className="text-lg text-violet-600">
                          {new Date(hw.due_date).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-sm text-violet-500">
                          {new Date(hw.due_date).toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </span>
                      </div>
                      <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
                        <p className="text-base text-gray-600 mb-4 break-words">
                          {hw.description || "No description available."}
                        </p>
                        <div className="text-sm text-gray-500">
                          <p>
                            <span className="font-semibold text-gray-700">
                              Subject:{" "}
                            </span>
                            {hw.subject || "Not specified"}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-700">
                              Due Date:{" "}
                            </span>
                            {new Date(hw.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">No homework found.</p>
              </div>
            )}
          </div>
        )}
        {/* Scores Section */}
        {activeSection === "scores" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-violet-800">Scores</h1>
            {loading ? (
              <div className="flex justify-center items-center">
                <p className="text-gray-500 animate-pulse">Loading scores...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-500 font-bold">Error: {error}</p>
              </div>
            ) : scores.length > 0 ? (
              <div className="space-y-6">
                {/* Scores Section */}
                {activeSection === "scores" && (
                  <div className="space-y-6">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <p className="text-gray-500 animate-pulse">
                          Loading scores...
                        </p>
                      </div>
                    ) : error ? (
                      <div className="text-center">
                        <p className="text-red-500 font-bold">Error: {error}</p>
                      </div>
                    ) : scores.filter(
                        (score) => score.student_id === profile.user_id
                      ).length > 0 ? (
                      <div className="space-y-6">
                        {scores
                          .filter(
                            (score) => score.student_id === profile.user_id
                          ) // Filter scores for the authenticated student
                          .map((score) => (
                            <div
                              key={score.assignment_id}
                              className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto hover:scale-105 transition-transform duration-300"
                            >
                              <div className="bg-violet-500 text-white rounded-t-lg px-4 py-3 text-center shadow">
                                <h2 className="text-lg font-bold">
                                  {score.assignment_name || "Assignment Name"}
                                </h2>
                              </div>
                              <div className="grid grid-cols-3 gap-6 p-6">
                                {/* Left Column - Score */}
                                <div className="flex flex-col items-center bg-violet-50 rounded-lg shadow-md p-4">
                                  <p>Your Score:</p>
                                  <span className="text-3xl font-extrabold text-violet-800">
                                    {score.score}
                                  </span>
                                </div>
                                {/* Right Column - Additional Info */}
                                <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
                                  <p className="text-base text-gray-600 mb-4 break-words">
                                    Student ID: {score.student_id || "Unknown"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Course ID:{" "}
                                    {score.assignment_name || "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-500">
                          No scores available for this student.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">No scores found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
