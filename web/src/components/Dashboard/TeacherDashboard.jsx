import React, { useState, useEffect, use } from "react";
import { SideBar } from "./SideBar";
import { CourseList } from "../Course/CourseList";
import { EventList } from "../Events/EventList";
import { StudentList } from "../Students/StudentList";
import { Modal } from "./Modal";
import { useAuth } from "@clerk/clerk-react";

// import {
//   courses as courseData,
//   students as studentData,
//   events as eventData,
// } from "../../Data/Course";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function TeacherDashboard() {
  const { getToken } = useAuth(); // Clerk for authentication
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeSection, setActiveSection] = useState("courses");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Course Inputs
  // ...
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

  // Fetch Students

  // Fetch Courses

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true); // Set loading to true when fetching begins
      setError(null); // Reset error state
      try {
        const token = await getToken(); // Retrieve JWT token
        const response = await fetch("http://localhost:3000/courses", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach Bearer token
          },
        });

        // Handle non-OK responses
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON data
        setCourses(data); // Update state with fetched courses
        console.log(data); // Log data for debugging
        console.log(data); // Log data for debugging
      } catch (err) {
        console.error("Error fetching courses:", err); // Log error
        setError(err.message); // Update error state
      } finally {
        setLoading(false); // Set loading to false when fetch ends
      }
    };

    fetchCourses(); // Call the fetch function
  }, [getToken]); // Empty dependency array to run only on mount

  // Reset Modal Inputs
  const resetModal = () => {
    setNewCourseName("");
    setNewCourseDescription("");
    setNewCourseTeacher("");
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

  // Add Course
  const handleAddCourse = async () => {
    //
  };
  // Add Student
  const handleAddStudent = async () => {
    try {
      const newStudent = {
        user_id: students.length + 1,
        first_name: newStudentFirstName,
        last_name: newStudentLastName,
        email: newEmail,
        phone_number: newPhone,
        course_id: selectedCourseId,
        dob: newDateOfBirth ? newDateOfBirth.toISOString() : null,
      };

      console.log("New Student:", newStudent); // Log the new student data
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        console.error("Failed to add student:", response.statusText);
        throw new Error("Failed to add student");
      }

      alert("Student added successfully!");
      resetModal(); // Reset modal state after successful submission
    } catch (error) {
      console.error("Error adding student:", error);
      alert("There was an error adding the student.");
    }
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
        className="w-1/4 bg-blue-600 text-white shadow-md"
      />

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className=" p-6">
          {/* Courses Section */}
          {activeSection === "courses" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
              <CourseList
                courses={courses}
                setCourses={setCourses}
                error={error}
                loading={loading}
              />
              <div className="flex justify-end">
                <button
                  className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-900"
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
              <h1 className="text-2xl font-semibold text-gray-800">Students</h1>
              <StudentList students={students} />
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
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
              <h1 className="text-2xl font-semibold text-gray-800">Events</h1>
              <EventList events={events} />
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
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
      {showCourseModal && <></>}
      {/* Student Modal */}
      {showStudentModal && (
        <Modal
          title="Add New Student"
          onCancel={resetModal}
          onSubmit={handleAddStudent}
          submitText="Add Student"
        >
          <input
            type="text"
            placeholder="Student First Name"
            className="w-full p-2 border rounded mb-4"
            value={newStudentFirstName}
            onChange={(e) => setNewStudentFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Student Last Name"
            className="w-full p-2 border rounded mb-4"
            value={newStudentLastName}
            onChange={(e) => setNewStudentLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            className="w-full p-2 border rounded mb-4"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full p-2 border rounded mb-4"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded mb-4"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="" disabled>
              Select Course
            </option>
            {courses?.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Date of Birth"
            className="w-full p-2 border rounded mb-4"
            value={newDateOfBirth?.toISOString().split("T")[0] || ""}
            onChange={(e) => setNewDateOfBirth(new Date(e.target.value))}
          />
        </Modal>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <Modal
          title="Add New Event"
          onCancel={resetModal}
          onSubmit={handleAddEvent}
          submitText="Add Event"
        >
          <input
            type="text"
            placeholder="Event Name"
            className="w-full p-2 border rounded mb-4"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
          />
          <DatePicker
            selected={newEventDate}
            onChange={(date) => setNewEventDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="Event Location"
            className="w-full p-2 border rounded mb-4"
            value={newEventLocation}
            onChange={(e) => setNewEventLocation(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
}
