import { students } from "../../Data/Course";
import { Link } from "react-router-dom";
export function StudentList() {
  return (
    <div className="student-list">
      <h1>Student List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length > 0 ? (
          students.map((student) => (
            <div
              key={student.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{student.name}</h2>

              <Link
                to={`/students/${student.id}`}
                className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No students available...</p>
        )}
      </div>
    </div>
  );
}
