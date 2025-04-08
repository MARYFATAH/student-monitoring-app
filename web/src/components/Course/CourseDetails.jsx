import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { courses, students } from "../../Data/Course";
import { CourseSideBar } from "./CourseSideBar";

export function CourseDetails() {
  const [activeSection, setActiveSection] = useState("courses"); // Active section in the sidebar
  const { courseId } = useParams();
  const selectedCourse = courses.find(
    (course) => course.id === parseInt(courseId, 10)
  );

  const [courseStudents, setCourseStudents] = useState([]); // Students in the course
  const [selectedStudentId, setSelectedStudentId] = useState(""); // Individual selection
  const [selectAll, setSelectAll] = useState(false); // Manage "Select All"
  const [tests, setTests] = useState([]); // List of tests
  const [newTestName, setNewTestName] = useState(""); // Name of new test
  const [studentScores, setStudentScores] = useState({}); // Scores for each test and student
  const [isEditing, setIsEditing] = useState(false); // Edit mode for course details
  const [homework, setHomework] = useState([]); // Homework list
  const [newHomeworkName, setNewHomeworkName] = useState(""); // Name of new homework
  const [newTeacherName, setNewTeacherName] = useState(""); // New teacher name
  const [selectedSchedule, setSelectedSchedule] = useState(""); // New schedule
  const [selectedDescription, setSelectedDescription] = useState(""); // New description

  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-red-600">
        <h1 className="text-2xl font-semibold text-white">Course not found</h1>
      </div>
    );
  }

  const handleAddHomework = () => {
    if (!newHomeworkName.trim()) {
      alert("Homework name cannot be empty.");
      return;
    }

    const newHomework = {
      id: homework.length + 1,
      name: newHomeworkName,
      du_date: new Date().toLocaleDateString(), // Example due date
      description: "Homework description here", // Example description
    };

    setHomework([...homework, newHomework]);
    setNewHomeworkName(""); // Reset input field
  };

  const handleEditCourse = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveCourse = () => {
    // Save course details logic here
    // For now, just log the changes
    console.log("Course details saved:", selectedCourse);
    // You can add logic to save the changes to the backend or state management

    setIsEditing(false);
  };

  const handleAddStudent = () => {
    const newStudents = selectAll
      ? students.filter(
          (student) => !courseStudents.some((s) => s.id === student.id)
        )
      : students.filter(
          (student) => parseInt(selectedStudentId) === student.id
        );

    setCourseStudents([...courseStudents, ...newStudents]);
    setSelectedStudentId(""); // Reset dropdown
    setSelectAll(false); // Reset "Select All" checkbox

    const updatedStudentScores = { ...studentScores };
    newStudents.forEach((student) => {
      if (!updatedStudentScores[student.id]) {
        updatedStudentScores[student.id] = {};
        tests.forEach((test) => {
          updatedStudentScores[student.id][test.id] = 0; // Default score
        });
      }
    });

    setStudentScores(updatedStudentScores);
  };

  const handleAddTest = () => {
    if (!newTestName.trim()) {
      alert("Test name cannot be empty.");
      return;
    }

    const newTest = { id: tests.length + 1, name: newTestName };
    setTests([...tests, newTest]);
    setNewTestName("");

    const updatedStudentScores = { ...studentScores };
    courseStudents.forEach((student) => {
      if (!updatedStudentScores[student.id]) {
        updatedStudentScores[student.id] = {};
      }
      updatedStudentScores[student.id][newTest.id] = 0; // Default score
    });

    setStudentScores(updatedStudentScores);
  };

  const handleUpdateScore = (studentId, testId, score) => {
    if (score < 0) {
      alert("Score cannot be negative.");
      return;
    }

    setStudentScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [testId]: score,
      },
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <CourseSideBar
        className="bg-blue-600 text-white w-full lg:w-1/4 h-auto lg:h-full py-8 shadow-md"
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      <div className="flex-1 bg-white rounded-lg shadow-lg mx-4 my-6 lg:my-10 p-6 lg:p-10 overflow-y-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-purple-700 text-center mb-8">
          {selectedCourse.name} Course Details
        </h1>

        {activeSection === "courses" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Teacher
              </h2>
              <p className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
                {isEditing ? (
                  <input
                    type="text"
                    onChange={(e) => {
                      setNewTeacherName(e.target.value); // Update the state
                      console.log(e.target.value); // Log the value
                    }}
                    value={newTeacherName || selectedCourse.teacher} // Show existing info if state is empty
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  selectedCourse.teacher || "No teacher assigned"
                )}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Schedule
              </h2>
              <p className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
                {isEditing ? (
                  <input
                    type="text"
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    value={selectedSchedule || selectedCourse.duration} // Show existing info if state is empty
                    placeholder="Enter schedule"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  selectedCourse.duration || "Schedule not available"
                )}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
                {isEditing ? (
                  <input
                    type="text"
                    onChange={(e) => setSelectedDescription(e.target.value)}
                    value={selectedDescription || selectedCourse.description} // Show existing info if state is empty
                    placeholder="Enter description"
                  />
                ) : (
                  selectedCourse.description || "No description available"
                )}
              </p>
            </div>
            <button
              onClick={handleEditCourse}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
            >
              {isEditing ? "Cancel" : "Edit Course Details"}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveCourse}
                className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
              >
                Save Changes
              </button>
            )}
          </div>
        )}

        {activeSection === "scores" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add Students
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => setSelectAll(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-800 font-medium">
                Select All Students
              </span>
            </div>
            {!selectAll && (
              <select
                className="w-full bg-gray-100 p-2 rounded-lg shadow mb-4"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="" disabled>
                  Select a student
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstname} {student.lastname}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={handleAddStudent}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
            >
              Add Student
            </button>
          </div>
        )}

        {activeSection === "tests" && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Test List
            </h2>
            <ul className="list-disc list-inside mb-4">
              {tests.length > 0
                ? tests.map((test) => <li key={test.id}>{test.name}</li>)
                : "No tests added yet..."}
            </ul>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Enter test name"
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                className="flex-1 bg-gray-100 p-2 rounded-lg shadow"
              />
              <button
                onClick={handleAddTest}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
              >
                Add Test
              </button>
            </div>
          </div>
        )}

        {activeSection === "scores" && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Student Scores
            </h2>
            <table className="table-auto border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Student</th>
                  {tests.map((test) => (
                    <th
                      key={test.id}
                      className="border border-gray-400 px-4 py-2"
                    >
                      {test.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courseStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="border border-gray-400 px-4 py-2">
                      {student.firstname} {student.lastname}
                    </td>
                    {tests.map((test) => (
                      <td
                        key={test.id}
                        className="border border-gray-400 px-4 py-2"
                      >
                        <input
                          type="number"
                          value={studentScores[student.id]?.[test.id] || 0}
                          onChange={(e) =>
                            handleUpdateScore(
                              student.id,
                              test.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-full bg-gray-100 p-2 rounded-lg shadow"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeSection === "homework" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Homework List
            </h2>
            <ul className="list-disc list-inside mb-4">
              {homework.length > 0
                ? homework.map((hw) => <li key={hw.id}>{hw.name}</li>)
                : "No homework added yet..."}
            </ul>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Enter homework name"
                value={newHomeworkName}
                onChange={(e) => setNewHomeworkName(e.target.value)}
                className="flex-1 bg-gray-100 p-2 rounded-lg shadow"
              />
              <input
                type="date"
                className="bg-gray-100 p-2 rounded-lg shadow"
                placeholder="Due Date"
                onChange={(e) => setNewHomeworkName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter homework description"
                className="bg-gray-100 p-2 rounded-lg shadow"
              />
              <button
                onClick={handleAddHomework}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
              >
                Add Homework
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
