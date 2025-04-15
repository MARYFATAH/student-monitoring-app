import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "./Modal";
import { useState } from "react";

export function AddCourse() {
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState({
    weekday: "",
    time: "",
  });

  async function save() {
    if (
      !newCourseName ||
      !selectedSchedule.weekday ||
      !selectedSchedule.time ||
      newCourseDescription
    ) {
      alert("Please fill out all required fields before adding a course.");
      return;
    }

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
          weeklyday: selectedSchedule.weekday, // Contains weekday and time
          weeklytime: selectedSchedule.time,
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
  }

  return (
    <Modal
      title="Add New Course"
      onCancel={resetModal}
      onSubmit={save}
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
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Schedule</h2>
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

            <label className="block text-gray-800 font-medium mb-1">Time</label>
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
            value={newCourseDescription}
            onChange={(e) => setNewCourseDescription(e.target.value)}
          />
        </div>
      </div>

      <input type="submit" value="Add Course" />
    </Modal>
  );
}
