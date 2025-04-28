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
    <div className="h-[90vh] flex bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <SideBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className="w-full lg:w-1/4 bg-violet-600 text-white shadow-md hidden lg:block"
      />

      {/* Main Content */}
      <div className="flex-grow p-6 lg:p-8 overflow-y-auto">
        {/* Courses Section */}
        {activeSection === "courses" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-white">Courses</h1>
            <CourseList
              courses={courses}
              setCourses={setCourses}
              error={error}
              loading={loading}
            />
            <div className="flex justify-end">
              <button
                className="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-6 rounded shadow-lg transition duration-300"
                onClick={() => setShowCourseModal(true)}
              >
                Add Course
              </button>
            </div>
          </div>
        )}

        {/* Students Section */}
        {activeSection === "students" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-white">Students</h1>
            <StudentList />
            <div className="flex justify-end">
              <button
                className="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-6 rounded shadow-lg transition duration-300"
                onClick={() => setShowStudentModal(true)}
              >
                Add Student
              </button>
            </div>
          </div>
        )}

        {/* Events Section */}
        {activeSection === "events" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-white">Events</h1>
            <EventList events={events} />
            <div className="flex justify-end">
              <button
                className="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-6 rounded shadow-lg transition duration-300"
                onClick={() => setShowEventModal(true)}
              >
                Add Event
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
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
          submitText={"Add Event"}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg"
        >
          <div className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-lg font-semibold text-violet-800 mb-1">
                Event Name
              </label>
              <input
                type="text"
                placeholder="Enter Event Name"
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-lg font-semibold text-violet-800 mb-1">
                Event Date
              </label>
              <DatePicker
                selected={newEventDate}
                onChange={(date) => setNewEventDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
              />
            </div>

            {/* Event Location */}
            <div>
              <label className="block text-lg font-semibold text-violet-800 mb-1">
                Event Location
              </label>
              <input
                type="text"
                placeholder="Enter Location"
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-lg font-semibold text-violet-800 mb-1">
                Event Description
              </label>
              <textarea
                placeholder="Enter Description"
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
