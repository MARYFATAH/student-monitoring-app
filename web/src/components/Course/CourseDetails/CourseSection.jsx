import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useCourseContext } from "../../../Context/CourseContext";
import { useParams } from "react-router";

export function CourseSection({ setActiveSection, setCourses }) {
  const {
    courseDetails,
    setCourseDetails,
    setNewCourseName,
    setSelectedDescription,
    setSelectedSchedule,
    setIsEditing,
    isEditing,
    newCourseName,
    selectedSchedule,
    selectedDescription,
  } = useCourseContext(); // Accessing course context

  const { getToken } = useAuth(); // Authentication token
  const { courseId } = useParams(); // Get courseId from the URL

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        console.error("Invalid course ID:", courseId);
        return;
      }
      try {
        const token = await getToken();
        const response = await fetch(
          `http://localhost:3000/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(
            `HTTP Error! Status: ${response.status}, Details: ${errorDetails}`
          );
        }
        const data = await response.json();
        setCourseDetails(data);
      } catch (error) {
        console.error("Error fetching course details:", error.message || error);
        setCourseDetails(null);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleEditMode = () => {
    if (!setSelectedSchedule || !setIsEditing) {
      console.error("Context functions not defined.");
      return;
    }
    setNewCourseName(courseDetails?.name || "");
    setSelectedSchedule({
      weeklyday: courseDetails?.weeklyday || "",
      weeklytime: courseDetails?.weeklytime || "",
    });
    setSelectedDescription(courseDetails?.description || "");
    setIsEditing(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseId) {
      alert("Course ID is missing.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/courses/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(
          `HTTP Error! Status: ${response.status}, Details: ${errorDetails}`
        );
      }
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.course_id !== courseId)
      );
      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error.message || error);
      alert("An error occurred while deleting the course.");
    }
  };

  const handleSaveCourseDetails = async (updatedData) => {
    if (!courseId || !updatedData || !Object.keys(updatedData).length) {
      console.error("Invalid course ID or update data.");
      alert("Cannot update course details due to missing information.");
      return;
    }

    try {
      const token = await getToken(); // Clerk auth
      const response = await fetch(
        `http://localhost:3000/courses/${courseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text(); // Fetch error details if available
        throw new Error(
          `HTTP Error! Status: ${response.status}, Details: ${errorDetails}`
        );
      }

      const updatedCourse = await response.json();
      console.log("Updated course data:", updatedCourse);

      // Adjust access to `data` property
      setCourses((prevCourses) => {
        const updatedState = prevCourses.map((course) =>
          course.id === courseId ? { ...course, ...updatedCourse.data } : course
        );

        console.log("Updated state after save:", updatedState);

        // Append as a fallback if the course is not found
        if (!updatedState.some((course) => course.id === courseId)) {
          console.warn("Course not found in state. Adding it as new.");
          return [...prevCourses, updatedCourse.data];
        }

        return updatedState;
      });

      alert("Course details updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating course:", error.message || error);
      alert(
        "Failed to update course. Please check your connection or try again."
      );
    }
  };
  return (
    <div className="space-y-6">
      {/* Teacher Section */}
      <div className="space-y-6">
        {/* Course Name */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Course Name
          </h2>
          <div className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
            {isEditing ? (
              <input
                type="text"
                onChange={(e) => setNewCourseName(e.target.value)}
                value={newCourseName}
                placeholder="Enter course name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              courseDetails?.name || "No course name available"
            )}
          </div>
        </div>

        {/* Schedule Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Schedule</h2>
          <div className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
            {isEditing ? (
              <div className="space-y-4">
                {/* Weekdays Dropdown */}
                <label className="block text-gray-800 font-medium mb-1">
                  Weekday
                </label>
                <select
                  value={selectedSchedule.weeklyday}
                  onChange={(e) =>
                    setSelectedSchedule({
                      ...selectedSchedule,
                      weeklyday: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                >
                  <option value="" disabled>
                    Select a day
                  </option>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                {/* Time Input */}
                <label className="block text-gray-800 font-medium mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={selectedSchedule.weeklytime}
                  onChange={(e) =>
                    setSelectedSchedule({
                      ...selectedSchedule,
                      weeklytime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
                />
              </div>
            ) : (
              ` on ${courseDetails?.weeklyday || "Day not set"} at ${
                courseDetails?.weeklytime || "Time not set"
              }`
            )}
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Description
          </h2>
          <div className="text-base text-gray-700 bg-gray-100 p-4 rounded-lg shadow">
            {isEditing ? (
              <textarea
                onChange={(e) => setSelectedDescription(e.target.value)}
                value={selectedDescription}
                placeholder="Enter description"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 shadow"
              />
            ) : (
              courseDetails?.description || "No description available"
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={isEditing ? () => setIsEditing(false) : handleEditMode}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-sm shadow transition-all duration-300"
          >
            {isEditing ? "Cancel" : "Edit Course Details"}
          </button>

          {isEditing ? (
            <button
              onClick={() =>
                handleSaveCourseDetails({
                  name: newCourseName,
                  weeklyday: selectedSchedule.weeklyday,
                  weeklytime: selectedSchedule.weeklytime,
                  description: selectedDescription,
                })
              }
              disabled={
                !newCourseName ||
                !selectedSchedule.weeklyday ||
                !selectedSchedule.weeklytime
              }
              className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-sm shadow transition-all duration-300"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => {
                handleDeleteCourse();
                setActiveSection("courses");
              }}
              className="ml-4 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-sm shadow transition-all duration-300"
            >
              Delete Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
