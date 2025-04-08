import React, { useState } from "react";
import { SideBar } from "./SideBar";
import { CourseList } from "../Course/CourseList";
import { EventList } from "../Events/EventList";
import { StudentList } from "../Students/StudentList";
import { Modal } from "./Modal";
import {
  courses as courseData,
  students as studentData,
  events as eventData,
} from "../../Data/Course";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function TeacherDashboard() {
  const [courses, setCourses] = useState(courseData);
  const [students, setStudents] = useState(studentData);
  const [events, setEvents] = useState(eventData);
  const [messages, setMessages] = useState([]);
  const [activeSection, setActiveSection] = useState("courses");

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Course Inputs
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseTeacher, setNewCourseTeacher] = useState("");

  // Student Inputs
  const [newStudentName, setNewStudentName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newDateOfBirth, setNewDateOfBirth] = useState(null);

  // Event Inputs
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState(null);
  const [newEventLocation, setNewEventLocation] = useState("");

  // Reset Modal Inputs
  const resetModal = () => {
    setNewCourseName("");
    setNewCourseDescription("");
    setNewCourseTeacher("");
    setNewStudentName("");
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
  const handleAddCourse = () => {
    if (newCourseName && newCourseDescription && newCourseTeacher) {
      const newCourse = {
        id: courses.length + 1,
        name: newCourseName,
        description: newCourseDescription,
        teacher: newCourseTeacher,
      };
      setCourses([...courses, newCourse]);
      resetModal();
    } else {
      alert("Please fill out all course fields.");
    }
  };

  // Add Student
  const handleAddStudent = () => {
    if (
      newStudentName &&
      newEmail &&
      newPhone &&
      selectedCourseId &&
      newDateOfBirth
    ) {
      const newStudent = {
        id: students.length + 1,
        firstname: newStudentName,
        email: newEmail,
        phone: newPhone,
        courseId: selectedCourseId,
        dateOfBirth: newDateOfBirth.toISOString().split("T")[0],
      };
      setStudents([...students, newStudent]);
      resetModal();
    } else {
      alert("Please fill out all student fields.");
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
    <div className="h-screen flex bg-purple-100">
      {/* Sidebar */}
      <SideBar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className="w-1/4 bg-blue-600 text-white shadow-md"
      />

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Courses Section */}
          {activeSection === "courses" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>
              <CourseList courses={courses} />
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
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
      {showCourseModal && (
        <Modal
          title="Add New Course"
          onCancel={resetModal}
          onSubmit={handleAddCourse}
          submitText="Add Course"
        >
          <input
            type="text"
            placeholder="Course Name"
            className="w-full p-2 border rounded mb-4"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 border rounded mb-4"
            value={newCourseDescription}
            onChange={(e) => setNewCourseDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Teacher"
            className="w-full p-2 border rounded mb-4"
            value={newCourseTeacher}
            onChange={(e) => setNewCourseTeacher(e.target.value)}
          />
        </Modal>
      )}

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
            placeholder="Student Name"
            className="w-full p-2 border rounded mb-4"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
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
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <DatePicker
            selected={newDateOfBirth}
            onChange={(date) => setNewDateOfBirth(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded mb-4"
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
