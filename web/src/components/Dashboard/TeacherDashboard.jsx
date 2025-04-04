import React, { useState } from "react";
import { SideBar } from "../SideBar";
import { CourseList } from "../Course/CourseList";
import {
  courses as courseData,
  students as studentData,
} from "../../Data/Course";
import { StudentProfile } from "../Students/StudentProfile";
import { StudentList } from "../Students/StudentList";

export function TeacherDashboard() {
  // State for courses and students
  const [courses, setCourses] = useState(courseData);
  const [students, setStudents] = useState(studentData);

  // State for active section and assignments
  const [activeSection, setActiveSection] = useState("courses");
  const [courseAssignments, setCourseAssignments] = useState({});

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(true);

  // Input fields
  const [newCourseName, setNewCourseName] = useState("");
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Add new course
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
    }
  };

  // Add new student and assign to course
  const handleAddStudent = () => {
    if (newStudentName.trim() && selectedCourseId) {
      const newStudent = { id: students.length + 1, name: newStudentName };
      setStudents([...students, newStudent]);

      // Assign the student to the selected course
      setCourseAssignments((prev) => ({
        ...prev,
        [selectedCourseId]: [...(prev[selectedCourseId] || []), newStudent.id],
      }));
      resetModal();
    }
  };

  // Reset modal
  const resetModal = () => {
    setNewCourseName("");
    setNewTeacherName("");
    setNewSchedule("");
    setNewDescription("");
    setNewStudentName("");
    setSelectedCourseId("");
    setShowModal(false);
  };

  return (
    <div className="h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex">
      {/* Sidebar */}
      <SideBar
        setActiveSection={setActiveSection}
        className="bg-blue-600 text-white w-full md:w-1/5 py-8 shadow-md"
      />

      {/* Main Content */}
      <div className="flex-grow p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-6">
          Teacher Dashboard
        </h1>
        <div>
          {activeSection === "courses" && (
            <>
              <CourseList
                courses={courses}
                courseAssignments={courseAssignments}
                students={students}
              />
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
                onClick={() => {
                  setIsAddingCourse(true);
                  setShowModal(true);
                }}
              >
                Add Course
              </button>
            </>
          )}
          {activeSection === "students" && (
            <>
              <StudentList />

              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
                onClick={() => {
                  setIsAddingCourse(false);
                  setShowModal(true);
                }}
              >
                Add Student
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] md:w-[50%]">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
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
              </>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                onClick={resetModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
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
