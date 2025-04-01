export function CourseDetails() {
  return (
    <div className="course-details">
      <h1>Course Details</h1>
      <div className="course-content">
        <p>Welcome to the Course Details page!</p>
        <p>Here you can find information about the course.</p>
        <ul>
          <li>Course Name: Introduction to Programming</li>
          <li>Instructor: John Doe</li>
          <li>Duration: 10 weeks</li>
          <li>Description: This course covers the basics of programming.</li>
        </ul>
      </div>
      <div className="course-materials">
        <h2>Course Materials</h2>
        <ul>
          <li>Lecture Notes</li>
          <li>Assignments</li>
          <li>Reading Materials</li>
        </ul>
      </div>
      <div className="course-assignments">
        <h2>Assignments</h2>
        <ul>
          <li>Assignment 1: Introduction to Programming</li>
          <li>Assignment 2: Data Structures</li>
          <li>Assignment 3: Algorithms</li>
        </ul>
      </div>

      <div className="course-exams">
        <h2>Exams</h2>
        <ul>
          <li>Midterm Exam</li>
          <li>Final Exam</li>
        </ul>
      </div>
      <div className="course-grading">
        <h2>Grading</h2>
        <ul>
          <li>Assignments: 40%</li>
          <li>Exams: 60%</li>
        </ul>
      </div>
      <div className="course-resources">
        <h2>Resources</h2>
        <ul>
          <li>Textbook: Introduction to Programming</li>
          <li>Online Resources: Codecademy, Coursera</li>
        </ul>
      </div>
    </div>
  );
}
