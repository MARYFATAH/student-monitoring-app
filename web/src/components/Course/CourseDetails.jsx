import React from "react";
import "./CourseDetails.css";
import { Link, useParams } from "react-router";
import { courses } from "../../Data/Course"; // Importing courses array

export function CourseDetails() {
  const { courseId } = useParams(); // Extract courseId from the URL
  const selectedCourse = courses.find(
    (course) => course.id === parseInt(courseId, 10)
  ); // Match the course by ID

  if (!selectedCourse) {
    return <div className="p-4">Course not found...</div>;
  }

  return (
    <div className="bg-gray-100 flex flex-col items-center">
      <div className="p-4 md:p-8 w-full max-w-screen-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-6">
          {selectedCourse.name} Course Details
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Teacher Information */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              Teacher
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {selectedCourse.teacher || "No teacher assigned"}
            </p>
          </div>

          {/* Schedule Information */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              Schedule
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {selectedCourse.duration || "Schedule not available"}
            </p>
          </div>

          {/* Course Description */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition col-span-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              Description
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {selectedCourse.description || "No description available"}
            </p>
          </div>
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add student
      </button>
    </div>
  );
}
