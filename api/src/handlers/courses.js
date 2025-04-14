import { db } from "../util/db.js";

export async function getCourses(req, res) {
  const { userId } = req.auth;
  console.log("userId", userId);
  try {
    const result = await db("courses")
      .where({ teacher_id: userId })
      .select("courses.*", "users.first_name", "users.last_name")
      .leftJoin("users", "users.user_id", "courses.teacher_id");
    return res.json(result);
  } catch (err) {
    console.log("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCourseById(req, res) {
  const { id } = req.params;
  try {
    const result = await db("courses")
      .where({ course_id: id })
      .select("courses.*", "users.first_name", "users.last_name")
      .leftJoin("users", "users.user_id", "courses.teacher_id")
      .first();
    if (!result) {
      return res.status(404).json({ error: `Course not found` });
    }
    return res.json(result);
  } catch (err) {
    console.log("Error fetching trip:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createCourse(req, res) {
  const { name, description } = req.body;
  const { userId } = req.auth;
  try {
    const [newCourse] = await db("courses")
      .insert({
        teacher_id: userId,
        name,
        description,
        created_at: new Date(),
      })
      .returning("*");
    return res.status(201).json(newCourse);
  } catch (err) {
    console.log("Error creating course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteCourse(req, res) {
  const { id } = req.params;
  const { userId } = req.auth;
  try {
    const deletedCourse = await db("courses")
      .where({ course_id: id, teacher_id: userId })
      .del();
    if (!deletedCourse) {
      return res
        .status(404)
        .json({ error: `Course not found for user ${userId}` });
    }
    return res.status(204).send();
  } catch (err) {
    console.log("Error deleting course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCourse(req, res) {
  const { id } = req.params;
  const { userId } = req.auth;
  const updateFields = req.body;

  delete updateFields.teacher_id;
  delete updateFields.course_id;

  try {
    const [updatedCourse] = await db("courses")
      .where({ course_id: id, teacher_id: userId })
      .update(updateFields)
      .returning("*");
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ error: `Course not found for user ${userId}` });
    }
    return res.status(200).json(updatedCourse);
  } catch (err) {
    console.log("Error updating course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function postCourse(req, res) {
  const { name, description } = req.body;
  const { userId } = req.auth;
  try {
    const [newCourse] = await db("courses")
      .insert({
        teacher_id: userId,
        name,
        description,
        weeklyDays,
        weeklyHours,
        created_at: new Date(),
      })
      .returning("*");
    return res.status(201).json(newCourse);
  } catch (err) {
    console.log("Error creating course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getStudentsInCourse(req, res) {
  const { id } = req.params;
  try {
    const result = await db("students2courses")
      .select("*")
      .leftJoin("users", "students2courses.student_id", "users.user_id")
      .where({
        "users.role": "student",
        course_id: id,
      });
    return res.json(result);
  } catch (err) {
    console.log("Error fetching students in course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addStudentToCourse(req, res) {
  const { id } = req.params;
  const { studentId } = req.body;
  try {
    const result = await db("students2courses")
      .insert({
        course_id: id,
        student_id: studentId,
      })
      .returning("*");

    return res.status(201).json(result);
  } catch (err) {
    console.log("Error adding student to course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function removeStudentFromCourse(req, res) {
  const { id, studentId } = req.params;
  try {
    const result = await db("students2courses")
      .where({ course_id: id, student_id: studentId })
      .del()
      .returning("*");
    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found in course" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.log("Error removing student from course:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
