import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export function StudentList() {
  const [students, setStudents] = useState([]);
  const { getToken } = useAuth();
  const fetchStudents = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:3000/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  if (students.length > 0) {
    console.log(students);
  }
  return (
    <div className="p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 h-[70vh] overflow-y-auto rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-purple-700 text-center mb-8">
        Student List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length > 0 ? (
          students.map((student) => (
            <div
              key={student.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {student.firstname} {student.lastname}
              </h2>
              <p className="text-gray-600">Email: {student.email || "N/A"}</p>
              <p className="text-gray-600">Phone: {student.phone || "N/A"}</p>
              <Link
                to={`/students/${student.id}`}
                className="block text-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mt-4"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-100 text-lg text-center">
            No students available...
          </p>
        )}
      </div>
    </div>
  );
}
