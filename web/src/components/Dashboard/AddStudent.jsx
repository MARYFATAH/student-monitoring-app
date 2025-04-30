import { useAuth } from "@clerk/clerk-react";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useAppState } from "../../state/useAppState";
import { Modal } from "./Modal";

export function AddStudent({
  courses,

  setShowStudentModal,
}) {
  const [newStudentFirstName, setNewStudentFirstName] = useState("");
  const [newStudentLastName, setNewStudentLastName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newDateOfBirth, setNewDateOfBirth] = useState(null); // Date of birth state
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isSaving, setIsSaving] = useState(false); // State for loading feedback
  const { getToken } = useAuth(); // Clerk authentication hook
  const addStudent = useAppState((state) => state.addStudent);

  async function save() {
    if (
      !newStudentFirstName.trim() ||
      !newStudentLastName.trim() ||
      !newStudentEmail.trim() ||
      !newStudentPhone.trim()
    ) {
      alert("Please fill out all required fields before adding a student.");
      return;
    }

    try {
      setIsSaving(true); // Start saving process
      const token = await getToken(); // Authentication token
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: "student",
          course_id: selectedCourseId,
          // user_id: students.length + 1, // Assuming user_id is auto-incremented
          first_name: newStudentFirstName,
          last_name: newStudentLastName,
          email: newStudentEmail,
          phone_number: newStudentPhone,
          dob: newDateOfBirth ? newDateOfBirth.toISOString() : null,
        }),
      });
      if (response.ok) {
        const newStudent = await response.json();
        // setStudents([...students, newStudent]);
        addStudent(newStudent);
        alert("Student added successfully!");

        resetModal(); // Reset modal fields after submission
      } else {
        alert("Failed to add student. Please try again.");
      }
    } catch (error) {
      console.error("Error adding student:", error.message || error);
      alert("Failed to add student. Please try again.");
    } finally {
      setIsSaving(false); // End saving process
      // setStudents([]);
    }
  }

  // Reset Modal Inputs
  const resetModal = () => {
    setShowStudentModal(false); // Close modal
  };

  return (
    <Modal
      title="Add New Student"
      onCancel={resetModal}
      onSubmit={save}
      isSaving={isSaving}
      submitText="Add Student"
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg"
    >
      <div className="space-y-6">
        {/* Student First Name */}
        <div>
          <label className="block text-lg font-semibold text-violet-800 mb-1">
            Student First Name
          </label>
          <input
            type="text"
            placeholder="Enter First Name"
            className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
            value={newStudentFirstName}
            onChange={(e) => setNewStudentFirstName(e.target.value)}
          />
        </div>

        {/* Student Last Name */}
        <div>
          <label className="block text-lg font-semibold text-violet-800 mb-1">
            Student Last Name
          </label>
          <input
            type="text"
            placeholder="Enter Last Name"
            className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
            value={newStudentLastName}
            onChange={(e) => setNewStudentLastName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-lg font-semibold text-violet-800 mb-1">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter Email Address"
            className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-lg font-semibold text-violet-800 mb-1">
            Phone
          </label>
          <input
            type="text"
            placeholder="Enter Phone Number"
            className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
            value={newStudentPhone}
            onChange={(e) => setNewStudentPhone(e.target.value)}
          />
        </div>

        {/* Course Selection */}
        <div>
          <label className="block text-lg font-semibold text-violet-800 mb-1">
            Select Course
          </label>
          <select
            className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="" disabled>
              Choose a Course
            </option>
            {courses?.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-lg font-semibold text-violet-800 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 bg-violet-50 shadow"
            value={newDateOfBirth?.toISOString().split("T")[0] || ""}
            onChange={(e) => setNewDateOfBirth(new Date(e.target.value))}
          />
        </div>
      </div>
    </Modal>
  );
}
