import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CourseSideBar } from "./CourseSideBar";
import { useAuth } from "@clerk/clerk-react";

export function CourseDetails() {
  const { courseId } = useParams(); // Get courseId from the URL
  const [activeSection, setActiveSection] = useState("courses");
  const [courseDetails, setCourseDetails] = useState(null); // Course details
  const [courseStudents, setCourseStudents] = useState([]); // List of students
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [addedStudents, setAddedStudents] = useState([]); // List of added students
  const [courses, setCourses] = useState([]); // List of courses
  const [students, setStudents] = useState([]); // List of all students
  const [selectedStudentId, setSelectedStudentId] = useState(""); // Individual student selection
  const [selectAll, setSelectAll] = useState(false); // Select all students
  const [tests, setTests] = useState([]); // List of tests
  const [newTestName, setNewTestName] = useState(""); // New test name
  const [studentScores, setStudentScores] = useState({}); // Scores of students for tests
  const [homework, setHomework] = useState([]); // List of homework
  const [newHomeworkName, setNewHomeworkName] = useState(""); // New homework name
  const [newHomeworkDescription, setNewHomeworkDescription] = useState(""); // Homework description
  const [newHomeworkDueDate, setNewHomeworkDueDate] = useState(""); // Homework due date
  const [newTeacherFirstName, setNewTeacherFirstName] = useState(""); // New teacher name
  const [newTeacherLastName, setNewTeacherLastName] = useState(""); // New teacher last name
  const [selectedSchedule, setSelectedSchedule] = useState(""); // Course schedule
  const [selectedDescription, setSelectedDescription] = useState(""); // Course description
  const [newCourseName, setNewCourseName] = useState(""); // New course name
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [loading, setLoading] = useState(false); // Loading state

  const { getToken } = useAuth(); // Authentication token

  // Fetch course details when the component mounts
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `http://localhost:3000/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Course details:", data);
        setCourseDetails(data);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setCourseDetails(null);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  //Patch course details logic

  // Fetch students in course logic
  const fetchStudentsInCourse = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:3000/users?role=student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCourseStudents(data);
      console.log("Students in course:", courseStudents);
      console.log("All students:", data);
      setStudents(data); // Set all students
      console.log("All students:", data);
    } catch (err) {
      console.error("Error fetching students in course:", err);
    }
  };

  useEffect(() => {
    fetchStudentsInCourse();
  }, []); // Fetch students in course when the component mounts

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          "http://localhost:3000/users?role=student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCourseStudents(data);
        console.log("All students:", data);
      } catch (err) {
        console.error("Error fetching all students:", err);
      }
    };
    fetchAllStudents(); // Fetch all students when the component mounts
  }, []);
  // Add new student logic
  const handleAddStudent = () => {
    if (!selectedStudentId) {
      alert("Please select a student to add.");
      return;
    }

    const newStudent = courseStudents.find(
      (student) =>
        Number(student.id) === Number(selectedStudentId) ||
        Number(student.user_id) === Number(selectedStudentId)
    );

    console.log("Selected student ID:", selectedStudentId);
    console.log("Available students:", courseStudents);
    console.log("New student:", newStudent);

    if (!newStudent) {
      alert("Student not found. Check API response.");
      return;
    }

    if (!addedStudents.some((s) => s.id === newStudent.id)) {
      setAddedStudents([...addedStudents, newStudent]);
      setStudents(students.filter((student) => student.id !== newStudent.id));
      setSelectAll(false);

      // Initialize student scores
      setStudentScores((prevScores) => ({
        ...prevScores,
        [newStudent.id]: tests.reduce((acc, test) => {
          acc[test.id] = 0;
          return acc;
        }, {}),
      }));
    }

    setSelectedStudentId("");
  };
  // edit course logic

  const handleEditMode = () => {
    setNewCourseName(courseDetails?.name || "");
    setSelectedSchedule({
      weeklyday: courseDetails?.weeklyday || "",
      weeklytime: courseDetails?.weeklytime || "",
    });
    setSelectedDescription(courseDetails?.description || "");
    setIsEditing(true);
  };

  // Add new test logic
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
      updatedStudentScores[student.id][newTest.id] = 0;
    });

    setStudentScores(updatedStudentScores);
  };

  // Add new homework logic
  const handleAddHomework = () => {
    if (!newHomeworkName.trim()) {
      alert("Homework name cannot be empty.");
      return;
    }
    const newHomework = {
      id: homework.length + 1,
      name: newHomeworkName,
      description: newHomeworkDescription,
      due_date: newHomeworkDueDate,
    };
    setHomework([...homework, newHomework]);
    setNewHomeworkName("");
    setNewHomeworkDescription("");
    setNewHomeworkDueDate("");
  };

  //save course details logic

  const handleSaveCourseDetails = async (updatedData) => {
    if (!courseId || !updatedData || !Object.keys(updatedData).length) {
      console.error("Invalid course ID or update data.");
      alert("Cannot update course details due to missing information.");
      return;
    }

    try {
      const token = await getToken(); // Clerk auth
      const response = await fetch(
        `http://localhost:3000/courses/${courseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text(); // Fetch error details if available
        throw new Error(
          `HTTP Error! Status: ${response.status}, Details: ${errorDetails}`
        );
      }

      const updatedCourse = await response.json();
      if (!updatedCourse || !updatedCourse.data.course_id) {
        throw new Error("Invalid response structure. Missing course data.");
      }

      console.log("Updated course data:", updatedCourse);

      setCourses((prevCourses) => {
        const updatedState = prevCourses.map((course) =>
          course.id === courseId ? { ...course, ...updatedCourse } : course
        );

        console.log("Updated state after save:", updatedState);
        if (!updatedState.some((course) => course.id === courseId)) {
          console.warn("Course not found in state. Adding it as new.");
          return [...prevCourses, updatedCourse]; // Fallback to append new course
        }

        return updatedState;
      });

      alert("Course details updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating course:", error.message || error);
      alert(
        "Failed to update course. Please check your connection or try again."
      );
    }
  };
  // Delete course logic
  const handleDeleteCourse = async () => {
    if (!courseId) {
      console.error("Invalid course ID:", courseId);
      alert("Unable to delete. Course ID is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/courses/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Unauthorized access. You do not have permission to delete this course."
          );
        } else if (response.status === 404) {
          throw new Error(
            "Course not found. It may have been deleted already."
          );
        } else {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Course deleted:", data);

      // Update state to remove the course
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.course_id !== courseId)
      );

      alert("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      alert(
        err.message || "An unexpected error occurred while deleting the course."
      );
    }
  };

  // Update scores logic
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

  if (!courseDetails) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg overflow-hidden">
      <CourseSideBar
        className="bg-blue-600 text-white w-full lg:w-1/4 h-auto lg:h-full py-8 shadow-md"
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      <div className="flex-1 bg-white rounded-lg shadow-lg mx-4 my-6 lg:my-10 p-6 lg:p-10 overflow-y-auto sm:mx-2 lg:mx-4 sm:p-4 lg:p-10 ">
        <h1 className="text-3xl lg:text-4xl font-bold text-purple-700 text-center mb-8">
          Course " {courseDetails.name} " Details
        </h1>
        {activeSection === "courses" && (
          <div className="space-y-6">
            {/* Teacher Section */}
            <div className="space-y-6">
              {/* Course Name */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Course Name
                </h2>
                <div className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
                  {isEditing ? (
                    <input
                      type="text"
                      onChange={(e) => setNewCourseName(e.target.value)}
                      value={newCourseName}
                      placeholder="Enter course name"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    courseDetails?.name || "No course name available"
                  )}
                </div>
              </div>

              {/* Schedule Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Schedule
                </h2>
                <div className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Weekdays Dropdown */}
                      <label className="block text-gray-800 font-medium mb-1">
                        Weekday
                      </label>
                      <select
                        value={selectedSchedule.weeklyday}
                        onChange={(e) =>
                          setSelectedSchedule({
                            ...selectedSchedule,
                            weeklyday: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                      >
                        <option value="" disabled>
                          Select a day
                        </option>
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>

                      {/* Time Input */}
                      <label className="block text-gray-800 font-medium mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={selectedSchedule.weeklytime}
                        onChange={(e) =>
                          setSelectedSchedule({
                            ...selectedSchedule,
                            weeklytime: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                      />
                    </div>
                  ) : (
                    ` on ${courseDetails?.weeklyday || "Day not set"} at ${
                      courseDetails?.weeklytime || "Time not set"
                    }`
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h2>
                <div className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
                  {isEditing ? (
                    <textarea
                      onChange={(e) => setSelectedDescription(e.target.value)}
                      value={selectedDescription}
                      placeholder="Enter description"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                    />
                  ) : (
                    courseDetails?.description || "No description available"
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={
                    isEditing ? () => setIsEditing(false) : handleEditMode
                  }
                  className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-sm shadow transition-all duration-300"
                >
                  {isEditing ? "Cancel" : "Edit Course Details"}
                </button>

                {isEditing ? (
                  <button
                    onClick={() =>
                      handleSaveCourseDetails({
                        name: newCourseName,
                        weeklyday: selectedSchedule.weeklyday,
                        weeklytime: selectedSchedule.weeklytime,
                        description: selectedDescription,
                      })
                    }
                    disabled={
                      !newCourseName ||
                      !selectedSchedule.weeklyday ||
                      !selectedSchedule.weeklytime
                    }
                    className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-sm shadow transition-all duration-300"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleDeleteCourse();
                      setActiveSection("courses");
                    }}
                    className="ml-4 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-sm shadow transition-all duration-300"
                  >
                    Delete Course
                  </button>
                )}
              </div>
            </div>
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
                {courseStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
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
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Test List
            </h2>
            <ul className="list-disc list-inside mb-4">
              {tests.length > 0
                ? tests.map((test) => <li key={test.id}>{test.name}</li>)
                : "No tests added yet..."}
            </ul>
            <input
              type="text"
              placeholder="Enter test name"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
              className="flex-1 bg-gray-100 p-2 rounded-lg shadow"
            />
            <button
              onClick={handleAddTest}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow"
            >
              Add Test
            </button>
          </div>
        )}

        {activeSection === "homework" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Homework List
            </h2>
            <ul className="list-disc list-inside mb-4">
              {homework.length > 0
                ? homework.map((hw) => (
                    <li key={hw.id}>
                      {hw.name} - Due: {hw.due_date || "No due date"}
                    </li>
                  ))
                : "No homework added yet..."}
            </ul>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Homework Name"
                value={newHomeworkName}
                onChange={(e) => setNewHomeworkName(e.target.value)}
                className="w-full bg-gray-100 p-2 rounded-lg shadow"
              />
              <input
                type="text"
                placeholder="Homework Description"
                value={newHomeworkDescription}
                onChange={(e) => setNewHomeworkDescription(e.target.value)}
                className="w-full bg-gray-100 p-2 rounded-lg shadow"
              />
              <input
                type="date"
                value={newHomeworkDueDate}
                onChange={(e) => setNewHomeworkDueDate(e.target.value)}
                className="w-full bg-gray-100 p-2 rounded-lg shadow"
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
                {addedStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="border border-gray-400 px-4 py-2">
                      {student.first_name} {student.last_name}
                    </td>
                    {tests.map((test) => (
                      <td
                        key={test.id}
                        className="border border-gray-400 px-4 py-2"
                      >
                        <input
                          type="number"
                          min="1"
                          max="6"
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
      </div>
    </div>
  );
}
