import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "./Modal";
import { useAuth } from "@clerk/clerk-react";

export function AddCourse({ courses, setCourses, setShowCourseModal }) {
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  const [selectedSchedule, setSelectedSchedule] = useState({
    weekday: "",
    time: "",
  });
  const [isSaving, setIsSaving] = useState(false); // State for loading feedback
  const { getToken } = useAuth(); // Clerk authentication hook

  async function save() {
    if (
      !newCourseName.trim() ||
      !selectedSchedule.weekday.trim() ||
      !selectedSchedule.time.trim() ||
      !newCourseDescription.trim()
    ) {
      alert("Please fill out all required fields before adding a course.");
      return;
    }

    try {
      setIsSaving(true); // Start saving process
      const token = await getToken(); // Authentication token
      const response = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: courses.length + 1, // Assuming course_id is auto-incremented
          name: newCourseName,
          description: newCourseDescription,
          weeklyday: selectedSchedule.weekday,
          weeklytime: selectedSchedule.time,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add course: ${response.statusText}`);
      }

      const createdCourse = await response.json();
      setCourses((prevCourses) => [...prevCourses, createdCourse]); // Update state with the new course
      alert("Course added successfully!");

      resetModal(); // Clear modal fields after submission
    } catch (error) {
      console.error("Error adding course:", error.message || error);
      alert("Failed to add course. Please try again.");
    } finally {
      setIsSaving(false); // End saving process
    }
  }

  const resetModal = () => {
    setShowCourseModal(false); // Close modal
  };

  return (
    <Modal
      title="Add New Course"
      onCancel={resetModal}
      onSubmit={save}
      submitText={isSaving ? "Saving..." : "Add Course"}
    >
      <div className="space-y-6">
        {/* Teacher Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Course Creation
          </h2>
          <input
            type="text"
            placeholder="Enter Course Name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            aria-label="Course Name"
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
              value={selectedSchedule?.time || ""}
              onChange={(e) =>
                setSelectedSchedule({
                  ...selectedSchedule,
                  time: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
              aria-label="Course Time"
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
            aria-label="Course Description"
          />
        </div>
      </div>
    </Modal>
  );
}
