import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication

export function CourseList({ courses, setCourses, loading, error }) {
  // const [courses, setCourses] = useState([]); // State for storing courses
  // const [loading, setLoading] = useState(true); // Loading state
  // const [error, setError] = useState(null); // Error state

  // Function to fetch courses from the server

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 h-[65vh] overflow-y-auto rounded-lg shadow-lg">
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
            courses.map((course) => (
              <div
                key={course.course_id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {course.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {course.description || "No description available."}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Weekly Days: {course.weeklyday || "Not specified"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Weekly Hours: {course.weeklytime || "Not specified"}
                </p>
                <Link
                  to={`/courses/${course.course_id}`}
                  className="block text-center bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-lg text-center">
              No courses available...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
