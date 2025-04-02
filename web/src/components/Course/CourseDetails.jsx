import "./CourseDetails.css";
export function CourseDetails({ course }) {
  return (
    <div className="course-details-container">
      <h2>{course.name}</h2>
      <p>Teacher: {course.teacher}</p>
      <p>Duration: {course.duration}</p>
      <p>Description: {course.description}</p>
    </div>
  );
}
