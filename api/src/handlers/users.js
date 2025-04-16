import { db } from "../util/db.js";
import { v4 as uuidv4 } from "uuid";

// Fetch all users with an optional role filter
export async function getUsers(req, res) {
  const { role } = req.query;
  try {
    const query = db("users").select("*");
    if (role) {
      query.where({ role });
    }
    const result = await query;
    return res.json(result);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Fetch a single user based on the authenticated user ID
export async function getUser(req, res) {
  const { userId } = req.auth;
  try {
    const result = await db("users")
      .select("*")
      .where({ user_id: userId })
      .first();
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(result);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Update user information
export async function updateUser(req, res) {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const [updatedUser] = await db("users")
      .where({ user_id: id })
      .update(updateFields)
      .returning("*"); // Remove if unsupported
    if (!updatedUser) {
      return res.status(404).json({ error: `User ${id} not found` });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Fetch user by ID from URL parameters
export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await db("users")
      .select("*")
      .where({ user_id: userId })
      .first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// {
//   "role": "student",
//   "course_id": "13",
//   "user_id": 1,
//   "first_name": "Otto",
//   "last_name": "hghg",
//   "email": "hghghg@kjkjkj.de",
//   "phone_number": "hghg",
//   "dob": "2025-04-17T00:00:00.000Z"
// }

// Create a new user (e.g., student or teacher)
export async function createStudent(req, res) {
  const { first_name, last_name, email, dob, phone_number } = req.body;
  const user_id = uuidv4();
  try {
    const [createdUser] = await db("users")
      .insert({
        user_id,
        first_name,
        last_name,
        email,
        created_at: new Date(),
        role: "student",
        dob,
        phone_number,
      })
      .returning("*"); // Remove if unsupported
    return res.status(201).json(createdUser);
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
