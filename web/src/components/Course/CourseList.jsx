import React from "react";
import { Link } from "react-router-dom";
import { courses } from "../../Data/Course";

export function CourseList() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-6">
        Course List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{course.name}</h2>
              <p>{course.description || "No description available."}</p>
              <Link
                to={`/courses/${course.id}`}
                className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No courses available...</p>
        )}
      </div>
    </div>
  );
}
