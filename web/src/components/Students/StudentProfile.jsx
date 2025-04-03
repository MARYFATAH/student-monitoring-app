import { students } from "../../Data/Course";
export function StudentProfile() {
  console.log(students);
  return (
    <div>
      {students.map((student) => (
        <div key={student.id}>
          <h2>{student.name}</h2>
        </div>
      ))}
    </div>
  );
}
