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
    // Query database for course details along with teacher's name
    const result = await db("courses")
      .where({ course_id: id })
      .select("courses.*", "users.first_name", "users.last_name")
      .leftJoin("users", "users.user_id", "courses.teacher_id")
      .first();

    // Check if the course exists
    if (!result) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Respond with the fetched course data
    return res.json(result);
  } catch (err) {
    console.error("Error fetching course:", err); // Improved error message

    // Return internal server error with additional context
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
}

export async function createCourse(req, res) {
  const { name, description, weeklyday, weeklytime } = req.body;
  const { userId } = req.auth;
  console.log("userId", userId);
  try {
    const [newCourse] = await db("courses")
      .insert({
        teacher_id: userId,
        name,
        description,
        weeklyday,
        weeklytime,
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

  // Validate inputs
  if (!id || !req.body || !Object.keys(req.body).length) {
    return res.status(400).json({ error: "Invalid course ID or update data." });
  }

  // Sanitize update fields
  const sanitizedFields = { ...req.body };
  delete sanitizedFields.teacher_id;
  delete sanitizedFields.course_id;

  try {
    console.log("Update request received:", {
      courseId: id,
      userId,
      fields: sanitizedFields,
    });

    const [updatedCourse] = await db("courses")
      .where({ course_id: id, teacher_id: userId })
      .update(sanitizedFields)
      .returning("*");

    if (!updatedCourse) {
      return res.status(404).json({
        error: `Course with ID ${id} not found for user ${userId}.`,
      });
    }

    console.log("Updated course successfully:", updatedCourse);
    return res.status(200).json({
      message: "Course updated successfully.",
      data: updatedCourse,
    });
  } catch (err) {
    console.error("Error updating course:", err.message); // Log error message for debugging
    return res
      .status(500)
      .json({ error: "Failed to update course due to a server error." });
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
