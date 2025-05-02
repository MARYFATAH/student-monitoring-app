import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; // Clerk for authentication
import { useCourseContext } from "../../../Context/CourseContext"; // Access course-related data from context

export function ScoreSection({ tests, setTests }) {
  const { getToken } = useAuth();
  const {
    courseStudents,
    setCourseStudents,
    studentScores,
    setStudentScores,
    courseDetails,
  } = useCourseContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // New state for cells in edit mode and their temporary values.
  const [editingCells, setEditingCells] = useState({});
  const [editingValues, setEditingValues] = useState({});

  // Fetch both students and their existing scores. (Defaults to 0 if no record exists.)
  useEffect(() => {
    const fetchData = async () => {
      if (!courseDetails) return; // wait for course details
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();

        // Fetch students
        const studentResponse = await fetch(
          "http://localhost:3000/users?role=student",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!studentResponse.ok) {
          throw new Error(`HTTP Error! Status: ${studentResponse.status}`);
        }
        const studentsData = await studentResponse.json();
        console.log("Fetched students:", studentsData);
        setCourseStudents(studentsData);
        console.log("url", "http://localhost:3000/users?role=student");

        // Fetch existing scores (adjust URL & query as needed)
        const scoresResponse = await fetch(
          `http://localhost:3000/scores?course_id=${courseDetails.course_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!scoresResponse.ok) {
          throw new Error(`HTTP Error! Status: ${scoresResponse.status}`);
        }
        const scoresData = await scoresResponse.json();
        console.log("Fetched scores:", scoresData);
        console.log(
          "url",
          `http://localhost:3000/scores?course_id=${courseDetails.course_id}`
        );

        // Build the studentScores state. Use composite keys "studentId-assignmentId".
        const updatedScores = studentsData.reduce((acc, student) => {
          acc[student.user_id] = tests.reduce((scoreAcc, test) => {
            const compositeKey = `${student.user_id}-${test.assignment_id}`;
            // Look for an existing score record for this student/assignment.
            const foundRecord = scoresData.find(
              (record) =>
                record.student_id === student.user_id &&
                record.assignment_id === test.assignment_id
            );
            scoreAcc[test.assignment_id] = {
              score: foundRecord ? foundRecord.score : 0,
              score_id: compositeKey, // composite key used for updates
            };
            return scoreAcc;
          }, {});
          return acc;
        }, {});
        setStudentScores(updatedScores);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch students or scores.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken, setCourseStudents, setStudentScores, tests, courseDetails]);

  // Handle updating a student's score.
  // Valid values are -1 to indicate absent, or any number >= 0.
  const handleUpdateScore = async (studentId, testId, newScore) => {
    if (newScore < -1) {
      alert("Score cannot be less than -1.");
      return;
    }

    const currentScoreEntry =
      studentScores[studentId] && studentScores[studentId][testId];
    if (!currentScoreEntry) {
      alert("Score record not found.");
      return;
    }

    // Optimistically update the local state.
    setStudentScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [testId]: {
          ...currentScoreEntry,
          score: newScore,
        },
      },
    }));

    try {
      const token = await getToken();
      const scoreId = currentScoreEntry.score_id;
      const response = await fetch(`http://localhost:3000/scores/${scoreId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignment_id: testId,
          score: newScore,
          course_id: courseDetails.course_id,
          student_id: studentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      console.log(
        `Updated score for student ${studentId} for test ${testId}: ${newScore}`
      );
    } catch (err) {
      console.error("Error updating score on the server:", err);
      alert("Failed to update score. Please try again.");
      // Optionally, revert the optimistic update if needed.
    }
  };

  // Render loading, error, or main content.
  if (!courseDetails) {
    return (
      <p className="text-center text-gray-500">Loading course details...</p>
    );
  }
  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Loading students and scores...
      </p>
    );
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-violet-800 mb-4">
        Student Scores
      </h2>
      <p className="text-sm text-gray-600 mb-2">
        Note: A score of <span className="font-bold text-red-500">-1</span>{" "}
        indicates that the student was absent.
      </p>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-violet-300 w-full text-sm">
          <thead className="bg-violet-50">
            <tr>
              <th className="border border-violet-300 px-4 py-2 text-left">
                Student
              </th>
              {tests.map((test) => (
                <th
                  key={test.assignment_id}
                  className="border border-violet-300 px-4 py-2 text-left"
                >
                  {test.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courseStudents.map((student) => (
              <tr
                key={student.user_id}
                className="odd:bg-white even:bg-violet-50 hover:bg-violet-100"
              >
                <td className="border border-violet-300 px-4 py-2">
                  {student.first_name} {student.last_name}
                </td>
                {tests.map((test) => {
                  const compositeKey = `${student.user_id}-${test.assignment_id}`;
                  const scoreEntry =
                    studentScores[student.user_id]?.[test.assignment_id];

                  // If the cell is in edit mode, render an input with a Save button.
                  if (editingCells[compositeKey]) {
                    return (
                      <td
                        key={compositeKey}
                        className="border border-violet-300 px-4 py-2"
                      >
                        <input
                          type="number"
                          min="-1"
                          value={
                            editingValues[compositeKey] !== undefined
                              ? editingValues[compositeKey]
                              : scoreEntry.score
                          }
                          onChange={(e) =>
                            setEditingValues((prev) => ({
                              ...prev,
                              [compositeKey]: parseInt(e.target.value, 10),
                            }))
                          }
                          className="w-full px-2 py-1 text-center border rounded focus:ring-2 focus:ring-violet-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          className="ml-2 px-2 py-1 text-xs bg-violet-600 text-white rounded"
                          onClick={() => {
                            const newVal =
                              editingValues[compositeKey] !== undefined
                                ? editingValues[compositeKey]
                                : scoreEntry.score;
                            // Call the update function using the temporary value.
                            handleUpdateScore(
                              student.user_id,
                              test.assignment_id,
                              newVal
                            );
                            // Exit edit mode.
                            setEditingCells((prev) => ({
                              ...prev,
                              [compositeKey]: false,
                            }));
                          }}
                        >
                          Save
                        </button>
                      </td>
                    );
                  }

                  // If the cell is not in edit mode and the score is -1, show "Absent" with an Edit button.
                  if (scoreEntry?.score === -1) {
                    return (
                      <td
                        key={compositeKey}
                        className="border border-violet-300 px-4 py-2"
                      >
                        <span className="text-red-500 font-bold">Absent</span>
                        <button
                          type="button"
                          className="ml-2 px-2 py-1 text-xs bg-gray-300 rounded"
                          onClick={() => {
                            setEditingCells((prev) => ({
                              ...prev,
                              [compositeKey]: true,
                            }));
                            setEditingValues((prev) => ({
                              ...prev,
                              [compositeKey]: scoreEntry.score,
                            }));
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    );
                  }

                  // Otherwise, simply show an input field for the score (immediate update).
                  return (
                    <td
                      key={compositeKey}
                      className="border border-violet-300 px-4 py-2"
                    >
                      <input
                        type="number"
                        min="-1"
                        value={scoreEntry?.score ?? 0}
                        onChange={(e) =>
                          handleUpdateScore(
                            student.user_id,
                            test.assignment_id,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-full px-2 py-1 text-center border rounded focus:ring-2 focus:ring-violet-500 focus:outline-none"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoreSection;
