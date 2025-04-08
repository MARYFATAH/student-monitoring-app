import React from "react";
import { Link } from "react-router-dom";

export function CourseList({ courses }) {
  return (
    <div className="p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 h-[70vh] overflow-y-auto rounded-lg shadow-md">
      {/* <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
        Course List
      </h1> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {course.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {course.description || "No description available."}
              </p>
              <Link
                to={`/courses/${course.id}`}
                className="block text-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg text-center">
            No courses available...
          </p>
        )}
      </div>
    </div>
  );
}
