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
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen flex flex-col items-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-purple-700 text-center mb-6">
          {isEditing ? (
            <>
              <input
                type="text"
                name="first_name"
                value={editedStudent.first_name}
                onChange={handleInputChange}
                className="text-xl font-semibold text-gray-800 bg-gray-100 p-2 rounded focus:ring-2 focus:ring-purple-400 w-full mb-3"
                placeholder="First Name"
              />
              <input
                type="text"
                name="last_name"
                value={editedStudent.last_name}
                onChange={handleInputChange}
                className="text-xl font-semibold text-gray-800 bg-gray-100 p-2 rounded focus:ring-2 focus:ring-purple-400 w-full"
                placeholder="Last Name"
              />
            </>
          ) : (
            `${selectedStudent.first_name} ${selectedStudent.last_name} `
          )}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Date of Birth */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Date of Birth
            </h2>
            {isEditing ? (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full bg-gray-100 p-2 rounded shadow focus:ring-2 focus:ring-purple-400"
                placeholderText="Select Date"
              />
            ) : (
              <p className="text-base text-gray-700 bg-gray-100 p-2 rounded shadow">
                {selectedStudent.dob
                  ? new Date(selectedStudent.dob).toLocaleDateString()
                  : "N/A"}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Email</h2>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedStudent.email}
                onChange={handleInputChange}
                className="w-full text-base text-gray-700 bg-gray-100 p-2 rounded shadow focus:ring-2 focus:ring-purple-400"
              />
            ) : (
              <p className="text-base text-gray-700 bg-gray-100 p-2 rounded shadow">
                {selectedStudent.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Phone</h2>
            {isEditing ? (
              <input
                type="tel"
                name="phone_number"
                value={editedStudent.phone_number}
                onChange={handleInputChange}
                className="w-full text-base text-gray-700 bg-gray-100 p-2 rounded shadow focus:ring-2 focus:ring-purple-400"
              />
            ) : (
              <p className="text-base text-gray-700 bg-gray-100 p-2 rounded shadow">
                {selectedStudent.phone_number}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Address
            </h2>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editedStudent.address}
                onChange={handleInputChange}
                className="w-full text-base text-gray-700 bg-gray-100 p-2 rounded shadow focus:ring-2 focus:ring-purple-400"
              />
            ) : (
              <p className="text-base text-gray-700 bg-gray-100 p-2 rounded shadow">
                {selectedStudent.address}
              </p>
            )}
          </div>
        </div>

        {/* Tests and Scores */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Tests and Scores
          </h2>
          {tests.length > 0 ? (
            <div className="space-y-4">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-gray-100 p-4 rounded-lg shadow"
                >
                  <p className="text-base font-semibold text-gray-700">
                    Test: {test.name}
                  </p>
                  <p className="text-base text-gray-700">Score: {test.score}</p>
                  <p className="text-base text-gray-700">
                    Date: {new Date(test.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No tests available...</p>
          )}
        </div>

        <div className="flex justify-center mt-8 gap-4">
          {/* Save/Cancel or Edit Button */}
          {isEditing ? (
            <button
              onClick={saveChanges}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition duration-300"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition duration-300"
            >
              Edit Profile
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={deleteStudent}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow transition duration-300"
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
