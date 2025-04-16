import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useAuth } from "@clerk/clerk-react";

import "react-datepicker/dist/react-datepicker.css";

export function AddStudent({
  courses,
  students,
  setStudents,
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
          user_id: students.length + 1, // Assuming user_id is auto-incremented
          first_name: newStudentFirstName,
          last_name: newStudentLastName,
          email: newStudentEmail,
          phone_number: newStudentPhone,
          dob: newDateOfBirth ? newDateOfBirth.toISOString() : null,
        }),
      });
      if (response.ok) {
        const newStudent = await response.json();
        setStudents([...students, newStudent]);
        alert("Student added successfully!");
        console.log("New Student:", newStudent); // Log the new student data
        resetModal(); // Reset modal fields after submission
      } else {
        alert("Failed to add student. Please try again.");
      }
    } catch (error) {
      console.error("Error adding student:", error.message || error);
      alert("Failed to add student. Please try again.");
    } finally {
      setIsSaving(false); // End saving process
    }
  }

  //   const save = async () => {
  //     try {
  //       const newStudent = {
  //         first_name: newStudentFirstName,
  //         last_name: newStudentLastName,
  //         email: newStudentEmail,
  //         phone_number: newStudentPhone,
  //         course_id: selectedCourseId,
  //         dob: newDateOfBirth ? newDateOfBirth.toISOString() : null,
  //       };

  //       console.log("New Student:", newStudent); // Log the new student data

  //       const response = await fetch("http://localhost:3000/users", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newStudent),
  //       });

  //       if (!response.ok) {
  //         const errorMessage = await response.json();
  //         console.error(
  //           "Failed to add student:",
  //           errorMessage.error || response.statusText
  //         );
  //         console.log("Response:", response); // Log the response for debugging
  //         throw new Error(errorMessage.error || "Failed to add student");
  //       }
  //       const createdStudent = await response.json();
  //       setStudents((prevStudents) => [...prevStudents, createdStudent]); // Update state with the new student
  //       console.log("New Student:", createdStudent); // Log the new student data

  //       alert("Student added successfully!");
  //       resetModal(); // Reset modal state after successful submission
  //     } catch (error) {
  //       console.error("Error adding student:", error);
  //       alert(`There was an error adding the student: ${error.message}`);
  //     }
  //   };
  // Add Event

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
    >
      <input
        type="text"
        placeholder="Student First Name"
        className="w-full p-2 border rounded mb-4"
        value={newStudentFirstName}
        onChange={(e) => setNewStudentFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Student Last Name"
        className="w-full p-2 border rounded mb-4"
        value={newStudentLastName}
        onChange={(e) => setNewStudentLastName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        className="w-full p-2 border rounded mb-4"
        value={newStudentEmail}
        onChange={(e) => setNewStudentEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        className="w-full p-2 border rounded mb-4"
        value={newStudentPhone}
        onChange={(e) => setNewStudentPhone(e.target.value)}
      />
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
      >
        <option value="" disabled>
          Select Course
        </option>
        {courses?.map((course) => (
          <option key={course.course_id} value={course.course_id}>
            {course.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        placeholder="Date of Birth"
        className="w-full p-2 border rounded mb-4"
        value={newDateOfBirth?.toISOString().split("T")[0] || ""}
        onChange={(e) => setNewDateOfBirth(new Date(e.target.value))}
      />
    </Modal>
  );
}
