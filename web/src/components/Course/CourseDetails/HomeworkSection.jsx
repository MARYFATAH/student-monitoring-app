import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication
import {
  CourseProvider,
  useCourseContext,
} from "../../../Context/CourseContext"; // Custom hook to access CourseContext
import { useEffect } from "react";
// React's useContext hook to access useCourseContext

export function HomeworkSection({ homework, setHomework }) {
  const { getToken } = useAuth(); // Authentication token
  const {
    setNewHomeworkName,
    newHomeworkDescription,
    setNewHomeworkDescription,
    setNewHomeworkDueDate,
    newHomeworkName,
    newHomeworkDueDate,
  } = useCourseContext(); // Accessing homework from CourseContext
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
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      {/* Homework List Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Homework List</h2>
        {homework.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {homework.map((hw) => (
              <li key={hw.id} className="text-gray-700">
                <span className="font-medium text-gray-900">{hw.name}</span> -
                Due:{" "}
                <span className="text-gray-600">
                  {hw.due_date || "No due date"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No homework added yet...</p>
        )}
      </div>

      {/* Add Homework Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Add Homework</h2>
        <input
          type="text"
          placeholder="Homework Name"
          value={newHomeworkName}
          onChange={(e) => setNewHomeworkName(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none shadow"
        />
        <textarea
          placeholder="Homework Description"
          value={newHomeworkDescription}
          onChange={(e) => setNewHomeworkDescription(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none shadow resize-none"
        ></textarea>
        <input
          type="date"
          value={newHomeworkDueDate}
          onChange={(e) => setNewHomeworkDueDate(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none shadow"
        />
        <button
          onClick={handleAddHomework}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
        >
          Add Homework
        </button>
      </div>
    </div>
  );
}
