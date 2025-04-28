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
          "http://localhost:3000/users?role=student", // Update URL if needed
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
        console.log("Fetched students:", data);
        setCourseStudents(data);
      } catch (err) {
        console.error("Error fetching all students:", err);
      }
    };

    fetchAllStudents();
  }, [getToken, setCourseStudents]);

  const handleAddStudent = async () => {
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

    if (!addedStudents.some((s) => s.user_id === newStudent.user_id)) {
      setAddedStudents([...addedStudents, newStudent]);
      setStudents(
        students.filter((student) => student.user_id !== newStudent.user_id)
      );
      setSelectAll(false);

      // Initialize student scores
      const updatedScores = tests.reduce((acc, test) => {
        acc[test.id] = 0; // Default score of 0 for each test
        return acc;
      }, {});
      setStudentScores((prevScores) => ({
        ...prevScores,
        [newStudent.user_id]: updatedScores,
      }));

      try {
        // Save added student to the server
        const token = await getToken();
        const response = await fetch(
          "http://localhost:3000/scores", // Endpoint for saving scores
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              student_id: newStudent.user_id,
              scores: updatedScores,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        console.log("Scores initialized on server for student:", newStudent);
      } catch (err) {
        console.error("Error saving scores to the server:", err);
      }
    }

    setSelectedStudentId("");
  };

  const handleUpdateScore = async (studentId, testId, score) => {
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

    try {
      // Update score on the server
      const token = await getToken();
      const response = await fetch(
        `http://localhost:3000/scores/${studentId}`, // Endpoint for updating scores
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            test_id: testId,
            score: score,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      console.log(
        `Updated score on server for student ${studentId}, test ${testId}: ${score}`
      );
    } catch (err) {
      console.error("Error updating score on the server:", err);
    }
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
        <h2 className="text-2xl font-bold text-violet-800 mb-4">
          Add Students
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => setSelectAll(e.target.checked)}
            className="form-checkbox h-5 w-5 text-violet-600"
          />
          <span className="text-violet-800 font-medium">
            Select All Students
          </span>
        </div>
        {!selectAll && (
          <select
            className="w-full px-4 py-2 bg-gray-50 border border-violet-300 rounded-lg shadow focus:ring-2 focus:ring-violet-500 focus:outline-none"
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
          className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300"
        >
          Add Student
        </button>
      </div>

      {/* Scores Section */}
      <div>
        <h2 className="text-2xl font-bold text-violet-800 mb-4">
          Student Scores
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-violet-300 w-full text-sm">
            <thead className="bg-violet-50">
              <tr>
                <th className="border border-violet-300 px-4 py-2 text-left">
                  Student
                </th>
                {tests.map((test) => (
                  <th
                    key={test.id}
                    className="border border-violet-300 px-4 py-2 text-left"
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
                  className="odd:bg-white even:bg-violet-50 hover:bg-violet-100"
                >
                  <td className="border border-violet-300 px-4 py-2">
                    {student.first_name} {student.last_name}
                  </td>
                  {tests.map((test) => (
                    <td
                      key={test.id}
                      className="border border-violet-300 px-4 py-2"
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
                        className="w-full px-2 py-1 text-center border rounded focus:ring-2 focus:ring-violet-500 focus:outline-none"
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
