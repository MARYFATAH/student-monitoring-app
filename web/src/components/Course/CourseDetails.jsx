import "./CourseDetails.css";
import { useParams } from "react-router";
import { CourseContext } from "../../contexts/CourseContext";
import { useContext } from "react";

export function CourseDetails() {
  const { courseId } = useParams(); // Extract courseId from URL params
  const { courses } = useContext(CourseContext); // Access courses from context

  const selectedCourse = courses.find(
    (course) => course.id === parseInt(courseId)
  ); // Find the course by ID

  if (!selectedCourse) {
    return <div className="course-details-container">Course not found.</div>;
  }

  return (
    <div className="course-details-container">
      <h2>{selectedCourse.name || "No course name provided"}</h2>
      <p>Teacher: {selectedCourse.teacher || "No teacher assigned"}</p>
      <p>Duration: {selectedCourse.duration || "Duration not available"}</p>
      <p>
        Description: {selectedCourse.description || "No description provided"}
      </p>
    </div>
  );
}
