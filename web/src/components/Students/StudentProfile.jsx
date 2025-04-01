export function StudentProfile({ student }) {
  return (
    <div className="student-profile">
      <h2>{student.name}</h2>
      <p>Age: {student.age}</p>
      <p>Grade: {student.grade}</p>
      <p>Attendance: {student.attendance}</p>
      <p>Behavior: {student.behavior}</p>
    </div>
  );
}
