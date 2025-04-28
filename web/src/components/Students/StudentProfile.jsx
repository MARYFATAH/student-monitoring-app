import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function StudentProfile() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { studentId } = useParams();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editedStudent, setEditedStudent] = useState(null);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { getToken } = useAuth();

  // Fetch student profile and test data
  useEffect(() => {
    const fetchStudentProfile = async () => {
      const token = await getToken();

      try {
        const response = await fetch(
          `http://localhost:3000/users/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const studentData = await response.json();
        setSelectedStudent(studentData);
        setEditedStudent({ ...studentData });
        setSelectedDate(studentData.dob ? new Date(studentData.dob) : null);
      } catch (err) {
        console.error("Error fetching student profile:", err);
      }
    };

    // const fetchStudentTests = async () => {
    //   try {
    //     const response = await fetch(
    //       `http://localhost:3000/tests?studentId=${studentId}`
    //     );
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch test data");
    //     }
    //     const testData = await response.json();
    //     setTests(testData);
    //   } catch (err) {
    //     console.error("Error fetching tests:", err);
    //   }
    // };

    if (studentId) {
      fetchStudentProfile();
      //fetchStudentTests();
    }
  }, [studentId]);

  // Handle changes to the profile
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent({ ...editedStudent, [name]: value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setEditedStudent({ ...editedStudent, dob: date.toISOString() });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edits and reset to original data
      setEditedStudent({ ...selectedStudent });
      setSelectedDate(
        selectedStudent.dob ? new Date(selectedStudent.dob) : null
      );
    }
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    try {
      const token = await getToken();

      const response = await fetch(`http://localhost:3000/users/${studentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: editedStudent.first_name,
          last_name: editedStudent.last_name,
          email: editedStudent.email,
          phone_number: editedStudent.phone_number,
          dob: editedStudent.dob,
          address: editedStudent.address,
        }),
      });

      if (!response.ok) {
        // Log the specific error response from the backend
        const errorData = await response.json();
        console.error("Error from server:", errorData);
        throw new Error(errorData.error || "Failed to save changes");
      }

      const updatedStudent = await response.json();
      console.log("Updated student data:", updatedStudent);

      // Update state and exit edit mode
      setSelectedStudent(updatedStudent);
      setEditedStudent(updatedStudent);

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving changes:", error.message);
      // Show a user-friendly error message
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please check your inputs or try again.");
    }

    // Redirect to the student profile page
    navigate(`/users/${studentId}`);
  };

  const deleteStudent = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${studentId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete student");
        }

        alert("Student deleted successfully!");
        // Redirect or update the UI after deletion
        window.location.href = "/users"; // Redirect to user list
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="p-8 text-center text-gray-700 font-semibold">
        Loading student profile...
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-6 sm:px-4 md:px-6 lg:px-8">
        {/* Student Profile Section */}
        <div className="space-y-6">
          {/* Student Name */}
          <div>
            <h2 className="text-lg font-semibold text-violet-800 mb-2">
              Student Name
            </h2>
            <div className="text-base text-violet-700 bg-violet-50 p-4 rounded-lg shadow">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="first_name"
                    value={editedStudent.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 mb-3"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={editedStudent.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  />
                </>
              ) : (
                `${selectedStudent.first_name} ${selectedStudent.last_name}` ||
                "Name not available"
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <h2 className="text-lg font-semibold text-violet-800 mb-2">
              Date of Birth
            </h2>
            <div className="text-base text-violet-700 bg-violet-50 p-4 rounded-lg shadow">
              {isEditing ? (
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full bg-violet-50 p-2 rounded shadow focus:ring-2 focus:ring-violet-500"
                  placeholderText="Select Date"
                />
              ) : selectedStudent.dob ? (
                new Date(selectedStudent.dob).toLocaleDateString()
              ) : (
                "N/A"
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold text-violet-800 mb-2">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <h3 className="text-sm font-medium text-violet-800 mb-1">
                  Email
                </h3>
                <div className="text-base text-violet-700 bg-violet-50 p-4 rounded-lg shadow">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedStudent.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                    />
                  ) : (
                    selectedStudent.email || "Email not available"
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <h3 className="text-sm font-medium text-violet-800 mb-1">
                  Phone
                </h3>
                <div className="text-base text-violet-700 bg-violet-50 p-4 rounded-lg shadow">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone_number"
                      value={editedStudent.phone_number}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                    />
                  ) : (
                    selectedStudent.phone_number || "Phone not available"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold text-violet-800 mb-2">
              Address
            </h2>
            <div className="text-base text-violet-700 bg-violet-50 p-4 rounded-lg shadow">
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editedStudent.address}
                  onChange={handleInputChange}
                  placeholder="Student Address"
                  className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                />
              ) : (
                selectedStudent.address || "Address not available"
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={isEditing ? () => setIsEditing(false) : handleEditToggle}
              className="py-1 px-3 border border-violet-600 text-violet-600 rounded hover:bg-violet-200 shadow transition-all"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            {isEditing ? (
              <button
                onClick={saveChanges}
                className="py-1 px-3 border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-100 shadow transition-all"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={deleteStudent}
                className="py-1 px-3 border border-red-600 text-red-600 rounded hover:bg-red-100 shadow transition-all"
              >
                Delete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
