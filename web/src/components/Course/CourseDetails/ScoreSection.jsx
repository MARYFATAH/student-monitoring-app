import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication
import { useCourseContext } from "../../../Context/CourseContext"; // Import CourseContext

export function ScoreSection({ students, setStudents, tests, setTests }) {
  const { getToken } = useAuth(); // Authentication token
  const {
    courseStudents,
    selectedStudentId,
    setSelectedStudentId,
    setCourseStudents,
    selectAll,
    setSelectAll,
    setStudentScores,
    studentScores,
    newTestName,
    setNewTestName,
    addedStudents,
    setAddedStudents,
    courseDetails,
  } = useCourseContext(); // Access course-related data from context

  // Fetch all students when the component mounts
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          "http://localhost:3000/users?role=student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched students:", data); // Debugging line
        setCourseStudents(data); // Set course students
      } catch (err) {
        console.error("Error fetching all students:", err);
      }
    };

    fetchAllStudents();
  }, [getToken, setCourseStudents]);

  const handleAddStudent = () => {
    if (!selectedStudentId) {
      alert("Please select a student to add.");
      return;
    }

    if (!Array.isArray(addedStudents)) {
      console.error("addedStudents is not an array or is undefined.");
      return;
    }

    const newStudent = courseStudents.find(
      (student) => student.user_id === selectedStudentId
    );

    if (!newStudent) {
      alert("Student not found. Check API response.");
      return;
    }

    if (!addedStudents.some((s) => s.id === newStudent.user_id)) {
      setAddedStudents([...addedStudents, newStudent]);
      setStudents(
        students.filter((student) => student.user_id !== newStudent.user_id)
      );
      setSelectAll(false);

      // Initialize student scores
      setStudentScores((prevScores) => ({
        ...prevScores,
        [newStudent.user_id]: tests.reduce((acc, test) => {
          acc[test.id] = 0; // Set default score to 0 for each test
          return acc;
        }, {}),
      }));
    }

    setSelectedStudentId("");
  };

  const handleUpdateScore = (studentId, testId, score) => {
    if (score < 0) {
      alert("Score cannot be negative.");
      return;
    }

    setStudentScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [testId]: score,
      },
    }));
  };

  if (!courseDetails) {
    return (
      <p className="text-center text-gray-500">Loading course details...</p>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-8">
      {/* Add Students Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Students</h2>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => setSelectAll(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-800 font-medium">Select All Students</span>
        </div>
        {!selectAll && (
          <select
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedStudentId || ""}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="" disabled>
              Select a student
            </option>
            {courseStudents.map((student) => (
              <option key={student.user_id} value={student.user_id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleAddStudent}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
        >
          Add Student
        </button>
      </div>

      {/* Scores Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Student Scores
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Student
                </th>
                {tests.map((test) => (
                  <th
                    key={test.id}
                    className="border border-gray-300 px-4 py-2 text-left"
                  >
                    {test.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {addedStudents.map((student) => (
                <tr
                  key={student.user_id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {student.first_name} {student.last_name}
                  </td>
                  {tests.map((test) => (
                    <td
                      key={test.id}
                      className="border border-gray-300 px-4 py-2"
                    >
                      <input
                        type="number"
                        value={studentScores[student.user_id]?.[test.id] || 0}
                        onChange={(e) =>
                          handleUpdateScore(
                            student.user_id,
                            test.id,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-full px-2 py-1 text-center border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
