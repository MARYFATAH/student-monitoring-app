import { db } from "../util/db.js";

export async function getScores(req, res) {
  const { course_id, student_id } = req.query;
  const { userId, role } = req.auth;
  //check if the loggedInUserId is a teacher OR the student whose scores are requested

  if (role !== "teacher" && userId !== student_id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const query = db("scores");

    query
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
    return res.json(result);
  } catch (err) {
    console.log("Error fetching scores:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createScore(req, res) {
  const { assignment_id, student_id, score } = req.body;

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
  const { id } = req.params;
  const { assignment_id, student_id, score } = req.body;
  const { userId: loggedInUserId } = req.auth;
  try {
    const updatedScore = await db("scores").where({ score_id: id }).update({
      assignment_id,
      student_id,
      score,
    });
    return res.status(200).json(updatedScore);
  } catch (err) {
    console.log("Error updating score:", err);
    return res.status(500).json({ error: "Internal server error" });
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
