import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CourseSideBar } from "./CourseSideBar";
import { useAuth } from "@clerk/clerk-react";
import { students } from "../../Data/Course"; // Sample student data

export function CourseDetails() {
  const { courseId } = useParams(); // Get courseId from the URL
  const [activeSection, setActiveSection] = useState("courses");
  const [courseDetails, setCourseDetails] = useState(null); // Course details
  const [courseStudents, setCourseStudents] = useState([]); // List of students
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
  const [isEditing, setIsEditing] = useState(false); // Edit mode
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
        setCourseDetails(data);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setCourseDetails(null);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  //Patch course details logic
  const updateCourse = async (courseId, updatedData) => {
    if (!courseId || !updatedData) {
      console.error("Invalid course ID or updated data.");
      return;
    }
    if (!updatedData.weeklyday || !updatedData.weeklytime) {
      console.error("Invalid schedule data.");
      return;
    }
    console.log("Updating course with ID:", courseId, "and data:", updatedData);
    // Validate updatedData structure
    try {
      const token = await getToken();
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

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCourseDetails(data);
    } catch (err) {
      console.error("Error updating course details:", err);
    }
  };

  // Add new student logic
  const handleAddStudent = () => {
    console.log("Adding student:", selectedStudentId, selectAll);
    const newStudents = selectAll
      ? students.filter(
          (student) => !courseStudents.some((s) => s.id === student.id)
        )
      : students.filter(
          (student) => parseInt(selectedStudentId) === student.id
        );

    setCourseStudents([...courseStudents, ...newStudents]);
    setSelectedStudentId("");
    setSelectAll(false);

    const updatedStudentScores = { ...studentScores };
    newStudents.forEach((student) => {
      if (!updatedStudentScores[student.id]) {
        updatedStudentScores[student.id] = {};
        tests.forEach((test) => {
          updatedStudentScores[student.id][test.id] = 0;
        });
      }
    });

    setStudentScores(updatedStudentScores);
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

  const handleSaveCourseDetails = async () => {
    // Validate input fields upfront
    if (!newTeacherFirstName || !newTeacherLastName) {
      alert("Teacher's first and last names are required.");
      return;
    }

    if (!selectedSchedule?.weekday || !selectedSchedule?.time) {
      alert("Please select both weekday and time for the schedule.");
      return;
    }

    if (!selectedDescription) {
      alert("Course description is required.");
      return;
    }

    // Construct updated course data
    const updatedCourseData = {
      first_name: newTeacherFirstName,
      last_name: newTeacherLastName,
      name: courseDetails.name,
      weeklyday: selectedSchedule.weekday,
      weeklytime: selectedSchedule.time,
      teacher_id: courseDetails.teacher_id,
      description: selectedDescription,
    };

    try {
      setLoading(true); // Start loading indicator
      console.log("Updated course data being sent:", updatedCourseData);

      // Make API call to update course details
      const response = await updateCourse(courseDetails.id, updatedCourseData);

      console.log("API response:", response);

      if (response.status === 404) {
        throw new Error("Course not found. It might have been deleted.");
      } else if (!response.ok) {
        throw new Error(`Failed to update course: ${response.statusText}`);
      }

      // Parse updated course data
      const updatedCourse = await response.json();
      console.log("Updated course from API:", updatedCourse);

      // Update courses state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );

      // Notify user and exit editing mode
      displayNotification("Course details updated successfully!", "success", {
        autoClose: true,
        closeDelay: 3000,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving course details:", error);
      displayNotification(
        error.message || "An unexpected error occurred. Please try again.",
        "error"
      );
    } finally {
      setLoading(false); // End loading indicator
    }
  };
  // Notification helper
  const displayNotification = (message, type) => {
    if (type === "success") {
      // Replace with a notification library for better UI
      alert(message); // Example fallback
    } else if (type === "error") {
      alert(message); // Example fallback
    }
  };

  // Edit course logic
  const handleEditCourse = () => {
    setIsEditing(true); // Enter editing mode
  };

  // Delete course logic
  const handleDeleteCourse = async () => {
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
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Course deleted:", data);
    } catch (err) {
      console.error("Error deleting course:", err);
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
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Teacher
              </h2>
              <div className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
                {isEditing ? (
                  <input
                    type="text"
                    onChange={(e) => setNewTeacherFirstName(e.target.value)}
                    value={courseDetails.first_name || ""}
                    placeholder="Enter teacher's first name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  courseDetails.first_name || "No teacher assigned"
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
                      value={selectedSchedule.weekday}
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

                    {/* Time Input */}
                    <input
                      type="time"
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
                ) : (
                  `${courseDetails?.weeklyday || "Weekday not set"} at ${
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
                    value={
                      selectedDescription || courseDetails?.description || ""
                    }
                    placeholder="Enter description"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                  />
                ) : (
                  courseDetails?.description || "No description available"
                )}
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-indigo-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
            >
              {isEditing ? "Cancel" : "Edit Course Details"}
            </button>

            <button
              onClick={(handleDeleteCourse, () => setActiveSection("courses"))}
              className="ml-4 bg-pink-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
            >
              Delete Course
            </button>

            {isEditing && (
              <button
                onClick={handleSaveCourseDetails}
                disabled={
                  !newTeacherFirstName ||
                  !selectedSchedule?.weekday ||
                  !selectedSchedule?.time
                }
                className="ml-4 bg-indigo-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
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
                {courseStudents.map((student) => (
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
      </div>
    </div>
  );
}
