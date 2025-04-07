import React, { useState } from "react";
import { SideBar } from "./SideBar";
import { CourseList } from "../Course/CourseList";
import {
  courses as courseData,
  students as studentData,
  events as eventData,
} from "../../Data/Course";
import { StudentList } from "../Students/StudentList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EventList } from "../Events/EventList";

export function TeacherDashboard() {
  const [courses, setCourses] = useState(courseData);
  const [students, setStudents] = useState(studentData);
  const [events, setEvents] = useState(eventData);
  const [messages, setMessages] = useState([]);
  const [activeSection, setActiveSection] = useState("courses");
  const [showModal, setShowModal] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(true);
  const [newCourseName, setNewCourseName] = useState("");
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newDateOfBirth, setNewDateOfBirth] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleAddCourse = () => {
    if (
      newCourseName.trim() &&
      newTeacherName.trim() &&
      newSchedule.trim() &&
      newDescription.trim()
    ) {
      const newCourse = {
        id: courses.length + 1,
        name: newCourseName,
        teacher: newTeacherName,
        schedule: newSchedule,
        description: newDescription,
      };
      setCourses([...courses, newCourse]);
      resetModal();
    } else {
      alert("Please fill in all course details.");
    }
  };

  const handleAddStudent = () => {
    if (newStudentName.trim() && selectedCourseId && newDateOfBirth) {
      const newStudent = {
        id: students.length + 1,
        firstname: newStudentName,
        email: newEmail,
        phone: newPhone,
        dateOfBirth: newDateOfBirth.toISOString().split("T")[0],
      };
      setStudents([...students, newStudent]);
      resetModal();
    } else {
      alert("Please complete all student details.");
    }
  };

  const resetModal = () => {
    setNewCourseName("");
    setNewTeacherName("");
    setNewSchedule("");
    setNewDescription("");
    setNewStudentName("");
    setSelectedCourseId("");
    setNewDateOfBirth(null);
    setShowModal(false);
  };

  return (
    <div className="h-screen flex bg-purple-100">
      {/* Sidebar */}
      <SideBar
        setActiveSection={setActiveSection}
        className="w-1/4 bg-blue-600 text-white shadow-md"
      />

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="flex flex-col bg-white rounded-lg shadow-md p-6">
          {activeSection === "courses" && (
            // Course List

            <div className="space-y-4">
              <h1 className="text-xl  font-semibold text-gray-800 mb-4">
                Courses
              </h1>
              <CourseList courses={courses} />
              <div className="flex justify-end">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                  onClick={() => {
                    setIsAddingCourse(true);
                    setShowModal(true);
                  }}
                >
                  Add Course
                </button>
              </div>
            </div>
          )}
          {activeSection === "students" && (
            <div className="space-y-4">
              <StudentList students={students} />
              <div className="flex justify-end">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                  onClick={() => {
                    setIsAddingCourse(false);
                    setShowModal(true);
                  }}
                >
                  Add Student
                </button>
              </div>
            </div>
          )}
          {activeSection === "events" && (
            <div className="space-y-4">
              <EventList events={events} />
              <div className="flex justify-end">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                  onClick={() => {
                    setShowModal(true);
                    setIsAddingEvent(false); // Adjust for events handling logic
                  }}
                >
                  Add Event
                </button>
              </div>
            </div>
          )}
          {activeSection === "messages" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Messages Section
              </h2>
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <p key={index} className="text-gray-600">
                    {message}
                  </p>
                ))
              ) : (
                <p className="text-gray-600">No messages available...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">
              {isAddingCourse ? "Add New Course" : "Add New Student"}
            </h2>
            {isAddingCourse ? (
              <>
                <input
                  type="text"
                  placeholder="Course Name"
                  className="w-full p-2 border rounded mb-4"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Teacher Name"
                  className="w-full p-2 border rounded mb-4"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Schedule"
                  className="w-full p-2 border rounded mb-4"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 border rounded mb-4"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Student Name"
                  className="w-full p-2 border rounded mb-4"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                />
                <input
                  type="email"
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
                    Select a Course
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
              </>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={resetModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={isAddingCourse ? handleAddCourse : handleAddStudent}
              >
                {isAddingCourse ? "Add Course" : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
