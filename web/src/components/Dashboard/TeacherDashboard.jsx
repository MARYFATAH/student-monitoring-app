import React, { useState, useEffect } from "react";
import { SideBar } from "./SideBar";
import { CourseList } from "../Course/CourseList";
import { EventList } from "../Events/EventList";
import { StudentList } from "../Students/StudentList";
import { Modal } from "./Modal";
import { useAuth } from "@clerk/clerk-react";
import { AddCourse } from "./AddCourse";
import { AddStudent } from "./AddStudent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SignOutButton } from "@clerk/clerk-react";

export function TeacherDashboard() {
  const { getToken } = useAuth(); // Clerk for authentication
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeSection, setActiveSection] = useState("courses");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Modal states
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Event Inputs
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState(null);
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:3000/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCourses(data);
        console.log(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [getToken]);

  // Reset Modal Inputs
  const resetModal = () => {
    setNewEventName("");
    setNewEventDate(null);
    setNewEventLocation("");
    setShowCourseModal(false);
    setShowStudentModal(false);
    setShowEventModal(false);
  };

  // Add Event
  const handleAddEvent = () => {
    if (!newEventName.trim() || !newEventDate || !newEventLocation.trim()) {
      alert("Please fill out all required fields before adding an event.");
      return;
    }

    const newEvent = {
      name: newEventName,
      date: newEventDate.toISOString(),
      location: newEventLocation,
      description: newEventDescription,
    };

    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => {
        if (response.ok) {
          alert("Event added successfully!");
          resetModal();
        } else {
          alert("Failed to add event. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error adding event:", error);
        alert("An error occurred while adding the event. Please try again.");
      });

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    resetModal();
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
      {/* Sidebar */}
      <SideBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className="w-full lg:w-1/4 bg-blue-600 text-white shadow-md hidden lg:block"
      />

      {/* Main Content */}
      <div className="flex-grow p-4 lg:p-6">
        <div className="p-4 lg:p-6">
          {/* Courses Section */}
          {activeSection === "courses" && (
            <div className="space-y-4">
              <h1 className="text-xl lg:text-2xl font-semibold text-white">
                Courses
              </h1>
              <CourseList
                courses={courses}
                setCourses={setCourses}
                error={error}
                loading={loading}
              />
              <div className="flex justify-end">
                <button
                  className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-900 lg:px-6"
                  onClick={() => setShowCourseModal(true)}
                >
                  Add Course
                </button>
              </div>
            </div>
          )}

          {/* Students Section */}
          {activeSection === "students" && (
            <div className="space-y-4">
              <h1 className="text-xl lg:text-2xl font-semibold text-white">
                Students
              </h1>
              <StudentList />
              <div className="flex justify-end">
                <button
                  className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-900 lg:px-6"
                  onClick={() => setShowStudentModal(true)}
                >
                  Add Student
                </button>
              </div>
            </div>
          )}

          {/* Events Section */}
          {activeSection === "events" && (
            <div className="space-y-4">
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                Events
              </h1>
              <EventList events={events} />
              <div className="flex justify-end">
                <button
                  className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-900 lg:px-6"
                  onClick={() => setShowEventModal(true)}
                >
                  Add Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <AddCourse
          courses={courses}
          setCourses={setCourses}
          setShowCourseModal={setShowCourseModal}
        />
      )}
      {/* Student Modal */}
      {showStudentModal && (
        <AddStudent
          courses={courses}
          students={students}
          setStudents={setStudents}
          setShowStudentModal={setShowStudentModal}
        />
      )}

      {/* Event Modal */}
      {showEventModal && (
        <Modal
          title="Add New Event"
          onCancel={resetModal}
          onSubmit={handleAddEvent}
          submitText="Add Event"
          className="max-w-full lg:max-w-lg p-4 lg:p-6 mx-auto"
        >
          <input
            type="text"
            placeholder="Event Name"
            className="w-full p-2 lg:p-3 border rounded mb-4"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
          />
          <DatePicker
            selected={newEventDate}
            onChange={(date) => setNewEventDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 lg:p-3 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="Event Location"
            className="w-full p-2 lg:p-3 border rounded mb-4"
            value={newEventLocation}
            onChange={(e) => setNewEventLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Event Description"
            className="w-full p-2 lg:p-3 border rounded mb-4"
            value={newEventDescription}
            onChange={(e) => setNewEventDescription(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
}
