import { db } from "../util/db.js";

export async function getCourses(req, res) {
  const { userId } = req.auth;
  try {
    const result = await db("courses").where({ owner_id: userId }).select("*");
    return res.json(result);
  } catch (err) {
    console.log("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCourseById(req, res) {
  const { id } = req.params;
  try {
    const result = await db("trips").where({ trip_id: id }).first();
    if (!result) {
      return res
        .status(404)
        .json({ error: `Trip not found for user ${userId}` });
    }
    return res.json(result);
  } catch (err) {
    console.log("Error fetching trip:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createCourse(req, res) {
  const { name, start_date, end_date } = req.body;
  const { userId } = req.auth;
  try {
    const [newTrip] = await db("trips")
      .insert({
        owner_id: userId,
        name,
        start_date,
        end_date,
      })
      .returning("*");
    return res.status(201).json(newTrip);
  } catch (err) {
    console.log("Error creating trip:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteCourse(req, res) {
  const { id } = req.params;
  const { userId } = req.auth;
  try {
    const deletedTrip = await db("trips")
      .where({ trip_id: id, owner_id: userId })
      .del();
    if (!deletedTrip) {
      return res
        .status(404)
        .json({ error: `Trip not found for user ${userId}` });
    }
    return res.status(204).json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.log("Error deleting trip:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCourse(req, res) {
  const { id } = req.params;
  const { userId } = req.auth;
  const updateFields = req.body;

  delete updateFields.owner_id;
  delete updateFields.trip_id;

  try {
    const [updatedTrip] = await db("trips")
      .where({ trip_id: id, owner_id: userId })
      .update(updateFields)
      .returning("*");
    if (!updatedTrip) {
      return res
        .status(404)
        .json({ error: `Trip not found for user ${userId}` });
    }
    return res.status(200).json(updatedTrip);
  } catch (err) {
    console.log("Error updating trip:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
