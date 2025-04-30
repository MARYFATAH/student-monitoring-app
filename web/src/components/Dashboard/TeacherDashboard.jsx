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
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null); // New state for selectedAssignmentId
  const [selectedCourseId, setSelectedCourseId] = useState(null); // New state for selectedCourseId
  const [newEventStartTime, setNewEventStartTime] = useState(null);
  const [newEventEndTime, setNewEventEndTime] = useState(null);

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
  const handleAddEvent = async () => {
    if (!newEventName.trim() || !newEventDate || !newEventLocation.trim()) {
      alert("Please fill out all required fields before adding an event.");
      return;
    }

    const newEvent = {
      name: newEventName,
      related_assignment_id: selectedAssignmentId || null, // Optional assignment ID
      event_date: newEventDate, // Assuming newEventDate is already in ISO format
      description: newEventDescription || "",
      course_id: selectedCourseId, // Required course ID
      start_time: newEventStartTime || null, // Optional start time
      end_time: newEventEndTime || null, // Optional end time
      location: newEventLocation || "",
    };

    try {
      const token = await getToken(); // Ensure the token is fetched securely
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error(`Failed to add event. Status: ${response.status}`);
      }

      const createdEvent = await response.json();
      alert("Event added successfully!");

      // Update local state with the newly created event
      setEvents([...events, createdEvent]);

      // Reset the form/modal
      resetModal();
    } catch (error) {
      console.error("Error adding event:", error);
      alert("An error occurred while adding the event. Please try again.");
    }
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
            <EventList events={events} onEventClick={handleAddEvent} />
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
          submitText="Add Event"
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

            {/* Start Time */}
            <div>
              <label className="block text-lg font-semibold text-violet-800 mb-1">
                Start Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
                value={newEventStartTime}
                onChange={(e) => setNewEventStartTime(e.target.value)}
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-lg font-semibold text-violet-800 mb-1">
                End Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
                value={newEventEndTime}
                onChange={(e) => setNewEventEndTime(e.target.value)}
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
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow resize-none"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
              />
            </div>

            {/* Select Course */}
            <div>
              <label className="block text-lg font-semibold text-violet-800 mb-1">
                Select Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
              >
                <option value="">Select a Course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
