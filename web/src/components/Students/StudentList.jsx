import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAppState } from "../../state/useAppState";

export function StudentList() {
  // State for students, loading, and errors
  // const [students, setStudents] = useState([]);
  const students = useAppState((state) => state.students);
  console.debug("students:", students);
  const setStudents = useAppState((state) => state.setStudents);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clerk authentication for fetching token
  const { getToken } = useAuth();

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      setIsLoading(true); // Set loading state
      const token = await getToken(); // Get the authentication token
      const response = await fetch("http://localhost:3000/users?role=student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }

      const data = await response.json(); // Parse JSON response
      console.debug("setStudents(data):", data);
      setStudents(data); // Update students state
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Could not load students. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // UseEffect for fetching data on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 h-[65vh] overflow-y-auto rounded-lg shadow-lg">
      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Loading Indicator */}
      {isLoading ? (
        <p className="text-gray-800 text-center">Loading students...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display students or fallback message */}
          {students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.user_id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {student.first_name} {student.last_name}
                </h2>
                <p className="text-sm text-gray-600">
                  Email: {student.email || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {student.phone_number || "N/A"}
                </p>
                <Link
                  to={`/users/${student.user_id}`}
                  aria-label={`View details for ${student.first_name} ${student.last_name}`}
                  className="block text-center bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-lg text-center">
              No students available...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
