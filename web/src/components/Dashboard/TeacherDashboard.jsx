import React, { useState } from "react";
import { SideBar } from "../SideBar";
import { StudentList } from "../Students/StudentList";
import { Link } from "react-router-dom";

export function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("courses");
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const [newCourseName, setNewCourseName] = useState(""); // State for the new course name
  const [newStudentName, setNewStudentName] = useState(""); // State for the new student name
  const [isAddingCourse, setIsAddingCourse] = useState(true); // Modal type

  const [courses, setCourses] = useState([
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Science" },
    { id: 3, name: "English" },
    { id: 4, name: "History" },
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "Diana" },
  ]);

  const handleAddCourse = () => {
    if (newCourseName.trim()) {
      const newCourse = { id: courses.length + 1, name: newCourseName };
      setCourses([...courses, newCourse]);
      setNewCourseName("");
      setShowModal(false);
    }
  };

  const handleAddStudent = () => {
    if (newStudentName.trim()) {
      const newStudent = { id: students.length + 1, name: newStudentName };
      setStudents([...students, newStudent]);
      setNewStudentName("");
      setShowModal(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <SideBar
        setActiveSection={setActiveSection}
        className="bg-blue-600 text-white w-full md:w-1/5 flex-shrink-0 flex flex-col items-center py-8 gap-4"
      />

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-full">
        <div className="p-4 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4 md:mb-6">
            Teacher Dashboard
          </h1>
          <div className="flex flex-col items-center">
            {activeSection === "courses" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition"
                    >
                      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        {course.name}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 mt-2">
                        Course details and information.
                      </p>
                      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        <Link to={`/course/${course.id}`}>
                          View Course Details
                        </Link>
                      </button>
                    </div>
                  ))}
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition"
                    >
                      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        {student.name}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 mt-2">
                        Student details and information.
                      </p>
                    </div>
                  ))}
                </div>
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%]">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              {isAddingCourse ? "Add New Course" : "Add New Student"}
            </h2>
            <input
              type="text"
              placeholder={isAddingCourse ? "Course Name" : "Student Name"}
              className="w-full p-2 border rounded mb-4"
              value={isAddingCourse ? newCourseName : newStudentName}
              onChange={(e) =>
                isAddingCourse
                  ? setNewCourseName(e.target.value)
                  : setNewStudentName(e.target.value)
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
