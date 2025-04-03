import { db } from "../util/db.js";

export async function getUsers(req, res) {
  try {
    const result = await db("users").select("*");
    return res.json(result);
  } catch (err) {
    console.log("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

getStudentsInCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await db("students")
      .where({ course_id: courseId })
      .select("*");
    return res.json(result);
  } catch (err) {
    console.log("Error fetching students in course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
addStudentToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;
  try {
    const result = await db("students")
      .insert({ course_id: courseId, student_id: studentId })
      .returning("*");
    return res.status(201).json(result);
  } catch (err) {
    console.log("Error adding student to course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
