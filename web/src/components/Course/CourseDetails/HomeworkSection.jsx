import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication
import { useCourseContext } from "../../../Context/CourseContext"; // Access CourseContext

export function HomeworkSection({ homework, setHomework }) {
  const { getToken } = useAuth(); // Authentication token
  const {
    courseDetails, // Access course data for dynamic `course_id`
    newHomeworkName,
    setNewHomeworkName,
    newHomeworkDescription,
    setNewHomeworkDescription,
    newHomeworkDueDate,
    setNewHomeworkDueDate,
  } = useCourseContext(); // Context values for homework inputs

  const [editingHomework, setEditingHomework] = useState(null); // Track editing state

  // Fetch homework from the server
  const fetchHomework = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/assignments?assignment_type=homework&course_id=${courseDetails.course_id}`,
        {
          method: "GET", // Move method outside headers
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "fetchHomework response:",
        response,
        "response.ok:",
        response.ok
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched homework from server:", data);
      setHomework(
        data.filter(
          (homework) => homework.course_id === courseDetails.course_id
        ) // Redundant safeguard
      ); // Update state with homework filtered by course
    } catch (err) {
      console.error("Error fetching homework:", err);
    }
  };

  // Add a new homework assignment
  const handleAddHomework = async () => {
    if (!newHomeworkName.trim()) {
      alert("Homework name cannot be empty.");
      return;
    }
    if (!newHomeworkDueDate.trim()) {
      alert("Homework due date cannot be empty.");
      return;
    }
    if (!courseDetails || !courseDetails.course_id) {
      alert("Course ID is missing. Please check your context.");
      return;
    }

    const newHomework = {
      name: newHomeworkName,
      description: newHomeworkDescription,
      due_date: newHomeworkDueDate,
      assignment_type: "homework",
      course_id: courseDetails.course_id,
    };

    try {
      const token = await getToken();
      const response = await fetch("http://localhost:3000/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHomework),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP Error! Status: ${response.status}. ${errorMessage}`
        );
      }

      const savedHomework = await response.json();
      console.log("Homework saved:", savedHomework);
      setHomework((prevHomework) => [...prevHomework, savedHomework]);

      // Clear input fields
      setNewHomeworkName("");
      setNewHomeworkDescription("");
      setNewHomeworkDueDate("");
      alert("Homework added successfully!");
    } catch (err) {
      console.error("Error saving homework:", err);
      alert("Failed to save homework. Please try again.");
    }
  };

  // Delete a homework assignment
  const handleDeleteHomework = async (homeworkId) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/assignments/${homeworkId}`,
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

      setHomework((prevHomework) =>
        prevHomework.filter((hw) => hw.assignment_id !== homeworkId)
      );
      alert("Homework deleted successfully!");
    } catch (err) {
      console.error("Error deleting homework:", err);
      alert("Failed to delete homework. Please try again.");
    }
  };

  // Update homework assignment
  const handleUpdateHomework = async () => {
    if (!editingHomework.name.trim() || !editingHomework.due_date.trim()) {
      alert("Homework name and due date cannot be empty.");
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/assignments/${editingHomework.assignment_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingHomework.name,
            description: editingHomework.description,
            due_date: editingHomework.due_date,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP Error! Status: ${response.status}. ${errorMessage}`
        );
      }

      const updatedHomework = await response.json();
      setHomework((prevHomework) =>
        prevHomework.map((hw) =>
          hw.assignment_id === updatedHomework.assignment_id
            ? updatedHomework
            : hw
        )
      );
      setEditingHomework(null);
      alert("Homework updated successfully!");
    } catch (err) {
      console.error("Error updating homework:", err);
      alert("Failed to update homework. Please try again.");
    }
  };

  // Fetch homework on component mount
  useEffect(() => {
    fetchHomework();
  }, []);

  return (
    <div className="p-6  rounded-lg shadow-lg">
      {/* Homework List Section */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Homework List</h2>
        {homework.length > 0 ? (
          <ul className="space-y-4">
            {homework.map((hw) => (
              <li
                key={hw.assignment_id}
                className="border border-violet-300 p-4 rounded-lg shadow flex justify-between items-center hover:bg-violet-100 transition-colors"
              >
                <div>
                  <span className="font-medium text-violet-800 text-lg">
                    {hw.name}
                  </span>
                  <p className="text-sm text-violet-700">{hw.description}</p>
                  <p className="text-sm text-violet-600">
                    Due: {new Date(hw.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setEditingHomework(hw)}
                    className="py-1 px-3 border border-violet-600 text-violet-600 rounded hover:bg-violet-200 shadow transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHomework(hw.assignment_id)}
                    className="py-1 px-3 border border-red-600 text-red-600 rounded hover:bg-red-100 shadow transition-all"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-violet-200 text-center">
            No homework added yet...
          </p>
        )}
      </div>

      {/* Add or Edit Homework Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {editingHomework ? "Edit Homework" : "Add Homework"}
        </h2>
        <input
          type="text"
          placeholder="Homework Name"
          value={editingHomework ? editingHomework.name : newHomeworkName}
          onChange={(e) =>
            editingHomework
              ? setEditingHomework({ ...editingHomework, name: e.target.value })
              : setNewHomeworkName(e.target.value)
          }
          className="w-full px-4 py-2 border border-violet-300 rounded-lg shadow focus:ring-2 focus:ring-violet-600 outline-none"
        />
        <textarea
          placeholder="Homework Description"
          value={
            editingHomework
              ? editingHomework.description
              : newHomeworkDescription
          }
          onChange={(e) =>
            editingHomework
              ? setEditingHomework({
                  ...editingHomework,
                  description: e.target.value,
                })
              : setNewHomeworkDescription(e.target.value)
          }
          className="w-full px-4 py-2 border border-violet-300 rounded-lg shadow focus:ring-2 focus:ring-violet-600 outline-none resize-none"
        ></textarea>
        <input
          type="date"
          value={
            editingHomework ? editingHomework.due_date : newHomeworkDueDate
          }
          onChange={(e) =>
            editingHomework
              ? setEditingHomework({
                  ...editingHomework,
                  due_date: e.target.value,
                })
              : setNewHomeworkDueDate(e.target.value)
          }
          className="w-full px-4 py-2 border border-violet-300 rounded-lg shadow focus:ring-2 focus:ring-violet-600 outline-none"
        />
        <button
          onClick={editingHomework ? handleUpdateHomework : handleAddHomework}
          className={`w-full ${
            editingHomework
              ? "bg-violet-600 hover:bg-violet-700"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300`}
        >
          {editingHomework ? "Update Homework" : "Add Homework"}
        </button>
      </div>
    </div>
  );
}
