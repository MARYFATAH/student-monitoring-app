import { db } from "../util/db.js";

export async function getScores(req, res) {
  const { course_id, student_id } = req.query;
  const { userId, role } = req.auth;

  console.log("getScores called with:", req.query);

  // Validate roles and permissions
  // if (role !== "teacher" && userId !== student_id) {
  //   return res
  //     .status(403)
  //     .json({
  //       error: "Forbidden: You are not authorized to view these scores.",
  //     });
  // }

  try {
    const query = db("scores")
      .select(
        "scores.*",
        "assignments.name AS assignment_name",
        "courses.course_id AS course_id",
        "courses.name AS course_name"
      )
      .leftJoin(
        "assignments",
        "scores.assignment_id",
        "assignments.assignment_id"
      )
      .leftJoin("courses", "assignments.course_id", "courses.course_id");

    if (course_id) {
      query.where({ "assignments.course_id": course_id });
    }
    if (student_id) {
      query.where({ student_id });
    }

    const result = await query;

    console.log("Scores fetched successfully:", result);

    return res.json(result);
  } catch (err) {
    console.error("Error fetching scores:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export async function createScore(req, res) {
  const { assignment_id, student_id, score } = req.body;
  if (!assignment_id || !student_id || score === undefined) {
    return res.status(400).json({ error: "Missing or invalid fields." });
  }
  try {
    const [newScore] = await db("scores")
      .insert({
        assignment_id,
        student_id,
        score,
      })
      .returning("*");
    return res.status(201).json(newScore);
  } catch (err) {
    console.log("Error creating score:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateScore(req, res) {
  // Get the composite id from the URL parameter (format: "studentId-assignmentId")
  const { id } = req.params;
  const { score } = req.body; // we only update the score

  // Split the composite id into student_id and assignment_id.
  const [student_id, assignment_id_str] = id.split("-");
  if (!student_id || !assignment_id_str) {
    return res.status(400).json({
      error: "Invalid composite id format. Expected 'studentId-assignmentId'.",
    });
  }
  const assignment_id = parseInt(assignment_id_str, 10);
  if (isNaN(assignment_id)) {
    return res
      .status(400)
      .json({ error: "Invalid assignment id in composite id." });
  }

  try {
    // Use an upsert: if a row exists with the keys, it will update; otherwise, it will insert.
    const result = await db("scores")
      .insert({ student_id, assignment_id, score })
      .onConflict(["student_id", "assignment_id"])
      .merge()
      .returning("*"); // optional: if you want to return the updated row(s)

    console.log("Successfully updated/inserted score:", result);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error updating score:", err.message || err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
export async function deleteScore(req, res) {
  const { id } = req.params;
  const { userId: loggedInUserId } = req.auth;
  try {
    await db("scores").where({ score_id: id }).del();
    return res.status(204).send();
  } catch (err) {
    console.log("Error deleting score:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
