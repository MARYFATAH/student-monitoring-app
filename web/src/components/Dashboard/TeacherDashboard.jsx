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

  // Course Inputs
  const [selectedDescription, setSelectedDescription] = useState("");
  const [newTeacherName, setNewTeacherName] = useState("");

  // Student Inputs
  const [newStudentFirstName, setNewStudentFirstName] = useState("");
  const [newStudentLastName, setNewStudentLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newDateOfBirth, setNewDateOfBirth] = useState(null);

  // Event Inputs
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState(null);
  const [newEventLocation, setNewEventLocation] = useState("");

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
    setNewStudentFirstName("");
    setNewStudentLastName("");
    setNewEmail("");
    setNewPhone("");
    setSelectedCourseId("");
    setNewDateOfBirth(null);
    setNewEventName("");
    setNewEventDate(null);
    setNewEventLocation("");
    setShowCourseModal(false);
    setShowStudentModal(false);
    setShowEventModal(false);
  };

  // Add Event
  const handleAddEvent = () => {
    if (newEventName && newEventDate && newEventLocation) {
      const newEvent = {
        id: events.length + 1,
        name: newEventName,
        date: newEventDate.toISOString().split("T")[0],
        location: newEventLocation,
      };
      setEvents([...events, newEvent]);
      resetModal();
    } else {
      alert("Please fill out all event fields.");
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-blue-500 to-purple-500">
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
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
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
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                Students
              </h1>
              <StudentList students={students} />
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
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 lg:px-6"
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
        </Modal>
      )}
    </div>
  );
}
