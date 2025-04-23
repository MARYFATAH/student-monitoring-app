import { db } from "../util/db.js";

export async function getAssignments(req, res) {
  const { userId } = req.auth;
  const { course_id } = req.query;
  console.log("userId", userId);
  try {
    const query = db("assignments");
    if (course_id) {
      query.where({ course_id });
    }
    query
      .select("assignments.*", "courses.name AS course_name")
      .leftJoin("courses", "courses.course_id", "assignments.course_id");
    const result = await query;
    return res.json(result);
  } catch (err) {
    console.log("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAssignmentById(req, res) {
  const { id } = req.params;

  try {
    const result = await db("assignments")
      .where({ assignment_id: id })
      .select("assignments.*", "users.first_name", "users.last_name")
      .leftJoin("users", "users.user_id", "assignments.teacher_id")
      .first();

    if (!result) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    return res.json(result);
  } catch (err) {
    console.error("Error fetching assignment:", err);

    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
}

export async function createAssignment(req, res) {
  const { name, description, course_id } = req.body;
  const { userId } = req.auth;
  console.log("userId", userId);
  try {
    const [newAssignment] = await db("assignments")
      .insert({
        teacher_id: userId,
        name,
        description,
        course_id,
        created_at: new Date(),
      })
      .returning("*");
    return res.status(201).json(newAssignment);
  } catch (err) {
    console.error("Error creating assignment:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function updateAssignment(req, res) {
  const { id } = req.params;
  const { name, description, course_id } = req.body;

  try {
    const [updatedAssignment] = await db("assignments")
      .where({ assignment_id: id })
      .update(
        {
          name,
          description,
          course_id,
          updated_at: new Date(),
        },
        ["*"]
      );

    if (!updatedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    return res.json(updatedAssignment);
  } catch (err) {
    console.error("Error updating assignment:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function deleteAssignment(req, res) {
  const { id } = req.params;
  const { userId } = req.auth;

  try {
    const deletedAssignment = await db("assignments")
      .where({ assignment_id: id, teacher_id: userId })
      .del();

    if (!deletedAssignment) {
      return res
        .status(404)
        .json({ error: `Assignment not found for user ${userId}` });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting assignment:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
