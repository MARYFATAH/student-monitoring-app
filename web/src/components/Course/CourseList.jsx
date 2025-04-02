import { CourseDetails } from "./CourseDEtails";

export function CourseList({ courses = [] }) {
  return (
    <div>
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseDetails key={course.id} course={course} />
        ))
      ) : (
        <p>No courses available</p>
      )}
      <button className="dashboard-button">Add Course</button>
    </div>
  );
}
