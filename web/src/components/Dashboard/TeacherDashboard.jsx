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

export function TeacherDashboard({ courses, setCourses }) {
  const { getToken } = useAuth(); // Clerk for authentication
  // const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
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
  const [selectedSchedule, setSelectedSchedule] = useState({
    weekday: "",
    time: "",
  });
  const [selectedDescription, setSelectedDescription] = useState("");
  const [newTeacherName, setNewTeacherName] = useState("");

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

  useEffect(() => {
    console.log("Courses fetched:", courses);
  }, [courses]);

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
  const handleAddCourse = async () => {
    if (
      newCourseName &&
      selectedSchedule.weekday &&
      selectedSchedule.time &&
      selectedDescription
    ) {
      try {
        const token = await getToken(); // Authentication token
        const response = await fetch("http://localhost:3000/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            teacher_id: token.user_id,
            name: newCourseName,
            description: newCourseDescription,
            weeklyDay: selectedSchedule.weekday, // Contains weekday and time
            weeklyTime: selectedSchedule.time,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to add course: ${response.statusText}`);
        }

        const createdCourse = await response.json();
        setCourses((prevCourses) => [...prevCourses, createdCourse]); // Update state with the new course
        alert("Course added successfully!");
        console.log("New Course:", createdCourse);

        resetModal(); // Clear modal fields after submission
      } catch (error) {
        console.error("Error adding course:", error);
        alert("Failed to add course. Please try again.");
      }
    } else {
      alert("Please fill out all required fields before adding a course.");
    }
  };
  // Add Student
  const handleAddStudent = async () => {
    try {
      const newStudent = {
        name: newStudentName,
        email: newEmail,
        phone_number: newPhone,
        courseId: selectedCourseId,
        dob: newDateOfBirth ? newDateOfBirth.toISOString() : null,
      };

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
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
              <CourseList courses={courses} />
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
      {showCourseModal && (
        <Modal
          title="Add New Course"
          onCancel={resetModal}
          onSubmit={handleAddCourse}
          submitText="Add Course"
        >
          <div className="space-y-6">
            {/* Teacher Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Course {selectedCourseId ? "Update" : "Create"}
              </h2>
              <input
                type="text"
                placeholder="Enter Course Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
              />
            </div>

            {/* Schedule Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Schedule
              </h2>
              <div className="space-y-4">
                <label className="block text-gray-800 font-medium mb-1">
                  Weekday
                </label>
                <select
                  value={selectedSchedule?.weekday || ""}
                  onChange={(e) =>
                    setSelectedSchedule({
                      ...selectedSchedule,
                      weekday: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                >
                  <option value="" disabled>
                    Select a day
                  </option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>

                <label className="block text-gray-800 font-medium mb-1">
                  Time
                </label>
                <input
                  type="time"
                  placeholder="Enter Time"
                  value={selectedSchedule?.time || ""}
                  onChange={(e) =>
                    setSelectedSchedule({
                      ...selectedSchedule,
                      time: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                />
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <textarea
                placeholder="Enter Description"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                value={selectedDescription}
                onChange={(e) => setSelectedDescription(e.target.value)}
              />
            </div>
          </div>
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
            {courses?.map((course) => (
              <option key={course.course_id} value={course.course_id}>
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
