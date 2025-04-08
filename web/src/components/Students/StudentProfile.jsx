import React, { useState } from "react";
import { useParams } from "react-router";
import { students } from "../../Data/Course";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function StudentProfile() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { studentId } = useParams();
  const [editedStudent, setEditedStudent] = useState(null);

  const selectedStudent = students.find(
    (student) => student.id === parseInt(studentId, 10)
  );

  // Test data for the student
  const [tests] = useState([
    { id: 1, name: "Math Test", score: 85, date: "2025-04-01" },
    { id: 2, name: "Science Test", score: 90, date: "2025-03-25" },
    { id: 3, name: "English Test", score: 88, date: "2025-03-18" },
  ]);

  // Initialize editedStudent with the current student details
  React.useEffect(() => {
    if (selectedStudent) {
      setEditedStudent({
        ...selectedStudent,
        dob: selectedDate || null,
      });
    }
  }, [selectedStudent, selectedDate]);

  if (!selectedStudent) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Student not found.
      </div>
    );
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setEditedStudent({ ...editedStudent, dob: date });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent({ ...editedStudent, [name]: value });
  };

  const saveChanges = () => {
    console.log("Student updated:", editedStudent);
    setIsEditing(false);
  };

  const deleteStudent = () => {
    console.log("Student deleted:", selectedStudent);
    alert("Student deleted successfully!");
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 min-h-screen flex flex-col items-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-purple-700 text-center mb-6">
          {isEditing ? (
            <>
              <input
                type="text"
                name="firstname"
                value={editedStudent.firstname}
                onChange={handleInputChange}
                className="text-xl font-semibold text-gray-800 bg-gray-100 p-2 rounded focus:ring-2 focus:ring-purple-400 w-full mb-3"
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastname"
                value={editedStudent.lastname}
                onChange={handleInputChange}
                className="text-xl font-semibold text-gray-800 bg-gray-100 p-2 rounded focus:ring-2 focus:ring-purple-400 w-full"
                placeholder="Last Name"
              />
            </>
          ) : (
            `${selectedStudent.firstname} ${selectedStudent.lastname}`
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
                name="phone"
                value={editedStudent.phone}
                onChange={handleInputChange}
                className="w-full text-base text-gray-700 bg-gray-100 p-2 rounded shadow focus:ring-2 focus:ring-purple-400"
              />
            ) : (
              <p className="text-base text-gray-700 bg-gray-100 p-2 rounded shadow">
                {selectedStudent.phone}
              </p>
            )}
          </div>
          {/*Address */}
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
