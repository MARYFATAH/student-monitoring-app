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
