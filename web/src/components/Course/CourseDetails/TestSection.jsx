import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication
import { useContext } from "react";
import { useCourseContext } from "../../../Context/CourseContext"; // Import the actual context

export function TestSection({ tests, setTests }) {
  const { getToken } = useAuth(); // Authentication token
  const {
    courseStudents,
    setStudentScores,
    studentScores,
    newTestName,
    setNewTestName,
    testDate,
    setTestDate,
  } = useCourseContext(); // Accessing course students and student scores from CourseContext

  useEffect(() => {
    console.log("Course students:", courseStudents);
    console.log("Student scores:", studentScores);
  }, [courseStudents, studentScores]); // Debugging context values

  const handleAddTest = () => {
    if (!newTestName.trim()) {
      alert("Test name cannot be empty.");
      return;
    }

    if (!testDate.trim()) {
      alert("Test date cannot be empty.");
      return;
    }

    // Create a new test object with name and date
    const newTest = {
      id: tests.length + 1,
      name: newTestName,
      date: testDate, // Include date in the test object
    };

    // Update the tests array with the new test
    setTests((prevTests) => [...prevTests, newTest]);

    // Reset input fields
    setNewTestName("");
    setTestDate("");

    // Update student scores to include the new test with a default score of 0
    const updatedStudentScores = { ...studentScores };
    courseStudents.forEach((student) => {
      const studentKey = student.user_id || student.id; // Ensure correct ID reference

      // Initialize scores object for this student if it doesn't exist
      if (!updatedStudentScores[studentKey]) {
        updatedStudentScores[studentKey] = {};
      }

      // Add a score of 0 for the new test
      updatedStudentScores[studentKey][newTest.id] = 0;
    });

    setStudentScores(updatedStudentScores);
  };

  // save test logic
  function saveTest() {
    const token = getToken();
    fetch("http://localhost:3000/tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newTestName,
        date: testDate,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Test created:", data);
      })
      .catch((error) => {
        console.error("Error creating test:", error);
      });
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Header Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
        Test List
        <span className="text-sm text-gray-600">
          {tests.length} {tests.length === 1 ? "test" : "tests"} added
        </span>
      </h2>

      {/* Test List Section */}
      <div className="mb-6">
        {tests.length > 0 ? (
          <ul className="space-y-2">
            {tests.map((test) => (
              <li
                key={test.id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center"
              >
                <span className="font-medium text-gray-900">{test.name}</span>
                <span className="text-sm text-gray-500 ml-auto">
                  {test.date
                    ? new Date(test.date).toLocaleDateString()
                    : "No date set"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            No tests added yet. Start by creating one below!
          </p>
        )}
      </div>

      {/* Add Test Section */}
      <div className="space-y-4">
        {/* Test Name Input */}
        <input
          type="text"
          placeholder="Enter test name"
          value={newTestName}
          onChange={(e) => setNewTestName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Test Date Picker */}
        <input
          type="date"
          placeholder="Select test date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Add Test Button */}
        <button
          onClick={handleAddTest}
          disabled={!newTestName.trim() || !testDate.trim()}
          className={`w-full py-2 px-4 font-semibold rounded-lg transition-colors ${
            newTestName.trim() && testDate.trim()
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Add Test
        </button>
      </div>
    </div>
  );
}
