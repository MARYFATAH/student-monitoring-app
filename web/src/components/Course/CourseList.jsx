import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication

export function CourseList() {
  const [courses, setCourses] = useState([]); // State for storing courses
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { getToken } = useAuth(); // Clerk's getToken function to retrieve JWT

  // Function to fetch courses from the server
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true); // Set loading to true when fetching begins
      setError(null); // Reset error state
      try {
        const token = await getToken(); // Retrieve JWT token
        const response = await fetch("http://localhost:3000/courses", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach Bearer token
          },
        });

        // Handle non-OK responses
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON data
        setCourses(data); // Update state with fetched courses
        console.log(data); // Log data for debugging
        console.log(data); // Log data for debugging
      } catch (err) {
        console.error("Error fetching courses:", err); // Log error
        setError(err.message); // Update error state
      } finally {
        setLoading(false); // Set loading to false when fetch ends
      }
    };

    fetchCourses(); // Call the fetch function
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 h-[70vh] overflow-y-auto rounded-lg shadow-md">
      {/* Loading Indicator */}
      {loading && (
        <p className="text-gray-600 text-lg text-center">Loading courses...</p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-lg text-center">
          Failed to load courses: {error}
        </p>
      )}

      {/* Course List */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map(
              (course) => (
                console.log(course),
                (
                  <div
                    key={course.course_id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {course.name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {course.description || "No description available."}
                    </p>
                    <Link
                      to={`/courses/${course.course_id}`}
                      className="block text-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                )
              )
            )
          ) : (
            <p className="text-gray-600 text-lg text-center">
              No courses available...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
