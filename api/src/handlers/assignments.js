import { db } from "../util/db.js";

export async function getAssignments(req, res) {
  const { assignment_type } = req.query;

  try {
    const query = db("assignments")
      .select("assignments.*", "courses.name AS course_name")
      .leftJoin("courses", "courses.course_id", "assignments.course_id");

    // Apply filter for assignment_type
    if (assignment_type) {
      query.where("assignment_type", assignment_type);
    }

    const result = await query;
    res.json(result);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function getAssignmentById(req, res) {
  const { id } = req.params;

  try {
    const result = await db("assignments")
      .where({ assignment_id: id })
      .select("assignments.*", "courses.name AS course_name")
      .leftJoin("courses", "courses.course_id", "assignments.course_id")
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
  const { userId } = req.auth;
  const { name, assignment_type, description, course_id, due_date } = req.body;
  try {
    // Check if the user is a teacher
    const user = await db("users").where({ user_id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "teacher") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const [newAssignment] = await db("assignments")
      .insert({
        name,
        assignment_type,
        description,
        course_id,
        due_date,
      })
      .returning("*");
    // create a corresponding event in the events table
    try {
      await db("events").insert({
        event_type: "assignment",
        related_assignment_id: newAssignment.assignment_id,
        event_date: newAssignment.due_date,
        name,
        description,
        course_id,
      });
    } catch (err) {
      console.error("Error creating event:", err);
    }

    return res.status(201).json(newAssignment);
  } catch (err) {
    console.error("Error creating assignment:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function updateAssignment(req, res) {
  const { id } = req.params;
  const { name, description, course_id, due_date, assignment_type } = req.body;

  try {
    const [updatedAssignment] = await db("assignments")
      .where({ assignment_id: id })
      .update(
        {
          name,
          description,
          course_id,
          due_date,
          assignment_type,
        },
        ["*"]
      );

    if (!updatedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Update the corresponding event in the events table
    try {
      await db("events").where({ related_assignment_id: id }).update({
        event_date: due_date,
        name,
        description,
        course_id,
      });
    } catch (err) {
      console.error("Error updating event:", err);
    }

    return res.json(updatedAssignment);
  } catch (err) {
    console.error("Error updating assignment:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function deleteAssignment(req, res) {
  const { id } = req.params;

  try {
    const deletedAssignment = await db("assignments")
      .where({ assignment_id: id })
      .del();

    if (!deletedAssignment) {
      return res.status(404).json({ error: `Assignment not found` });
    }
    // Delete the corresponding event in the events table
    try {
      await db("events").where({ related_assignment_id: id }).del();
    } catch (err) {
      console.error("Error deleting event:", err);
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting assignment:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
