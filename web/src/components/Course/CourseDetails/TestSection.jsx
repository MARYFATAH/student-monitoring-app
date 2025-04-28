import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication
import { useCourseContext } from "../../../Context/CourseContext"; // Import course context

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
    descriptionTest,
    setDescriptionTest,
  } = useCourseContext(); // Access course-related data
  const [editingTest, setEditingTest] = useState(null); // Track editing state

  useEffect(() => {
    console.log("Course students:", courseStudents);
    console.log("Student scores:", studentScores);
  }, [courseStudents, studentScores]);

  const handleAddTest = async () => {
    if (!newTestName.trim() || !testDate.trim()) {
      alert("Test name and due date cannot be empty.");
      return;
    }

    const newTest = {
      id: tests.length + 1, // Temporary ID
      name: newTestName,
      assignment_type: "test", // Indicate this is a test
      due_date: testDate,
      description: descriptionTest,
    };

    setTests((prevTests) => [...prevTests, newTest]);

    const updatedStudentScores = { ...studentScores };
    courseStudents.forEach((student) => {
      const studentKey = student.user_id || student.id;
      if (!updatedStudentScores[studentKey]) {
        updatedStudentScores[studentKey] = {};
      }
      updatedStudentScores[studentKey][newTest.id] = 0; // Default score
    });
    setStudentScores(updatedStudentScores);

    try {
      const token = await getToken();
      const response = await fetch("http://localhost:3000/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newTestName,
          assignment_type: "test",
          due_date: testDate,
          description: descriptionTest,
          course_id: 1, // Replace with dynamic course ID
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}. ${errorMessage}`
        );
      }

      const savedTest = await response.json();
      setTests((prevTests) =>
        prevTests.map((test) =>
          test.id === newTest.id
            ? { ...test, id: savedTest.assignment_id }
            : test
        )
      );

      alert("Test successfully added and saved!");
    } catch (error) {
      console.error("Error saving test:", error);
      alert("Failed to save test. Please try again.");
    }

    setNewTestName("");
    setTestDate("");
    setDescriptionTest("");
  };

  const handleDeleteTest = async (testId) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/assignments/${testId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setTests((prevTests) => prevTests.filter((test) => test.id !== testId));
      alert("Test deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Failed to delete test. Please try again.");
    }
  };

  const handleUpdateTest = async () => {
    if (!editingTest.name.trim() || !editingTest.due_date.trim()) {
      alert("Test name and due date cannot be empty.");
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/assignments/${editingTest.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingTest.name,
            due_date: editingTest.due_date,
            description: editingTest.description,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}. ${errorMessage}`
        );
      }

      const updatedTest = await response.json();
      setTests((prevTests) =>
        prevTests.map((test) =>
          test.id === updatedTest.id ? updatedTest : test
        )
      );
      setEditingTest(null);
      alert("Test updated successfully!");
    } catch (error) {
      console.error("Error updating test:", error);
      alert("Failed to update test. Please try again.");
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg space-y-6 bg-gray-50">
      {/* Header Section */}
      <h2 className="text-3xl font-bold flex justify-between items-center text-violet-800">
        Test List
        <span className="text-sm text-violet-600">
          {tests.length} {tests.length === 1 ? "test" : "tests"} added
        </span>
      </h2>

      {/* Test List Section */}
      <div>
        {tests.length > 0 ? (
          <ul className="space-y-4">
            {tests.map((test) => (
              <li
                key={test.id}
                className="p-4 border border-violet-300 rounded-lg shadow flex justify-between items-center hover:bg-violet-100 transition-colors"
              >
                <div>
                  <span className="font-medium text-violet-800 text-lg">
                    {test.name}
                  </span>
                  <p className="text-sm text-violet-700">{test.description}</p>
                  <p className="text-sm text-violet-600">
                    Due: {new Date(test.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setEditingTest(test)}
                    className="py-1 px-3 border border-violet-700 text-violet-700 rounded hover:bg-violet-200 transition-all shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="py-1 px-3 border border-red-600 text-red-600 rounded hover:bg-red-100 transition-all shadow"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-violet-500 text-center">No tests added yet...</p>
        )}
      </div>

      {/* Add or Edit Test Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-violet-800">
          {editingTest ? "Edit Test" : "Add Test"}
        </h2>
        <input
          type="text"
          placeholder="Test Name"
          value={editingTest ? editingTest.name : newTestName}
          onChange={(e) =>
            editingTest
              ? setEditingTest({ ...editingTest, name: e.target.value })
              : setNewTestName(e.target.value)
          }
          className="w-full px-4 py-2 border border-violet-300 rounded-lg shadow focus:ring-2 focus:ring-violet-600 outline-none"
        />
        <textarea
          placeholder="Test Description (optional)"
          value={editingTest ? editingTest.description : descriptionTest}
          onChange={(e) =>
            editingTest
              ? setEditingTest({ ...editingTest, description: e.target.value })
              : setDescriptionTest(e.target.value)
          }
          className="w-full px-4 py-2 border border-violet-300 rounded-lg shadow focus:ring-2 focus:ring-violet-600 outline-none resize-none"
        ></textarea>
        <input
          type="date"
          value={editingTest ? editingTest.due_date : testDate}
          onChange={(e) =>
            editingTest
              ? setEditingTest({ ...editingTest, due_date: e.target.value })
              : setTestDate(e.target.value)
          }
          className="w-full px-4 py-2 border border-violet-300 rounded-lg shadow focus:ring-2 focus:ring-violet-600 outline-none"
        />
        <button
          onClick={editingTest ? handleUpdateTest : handleAddTest}
          className={`w-full ${
            editingTest
              ? "bg-violet-600 hover:bg-violet-700"
              : "bg-violet-700 hover:bg-violet-800"
          } text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300`}
        >
          {editingTest ? "Update Test" : "Add Test"}
        </button>
      </div>
    </div>
  );
}
