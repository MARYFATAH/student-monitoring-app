import { db } from "../util/db.js";

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
    console.log("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUser(req, res) {
  const { userId } = req.auth;
  try {
    const result = await "users".select("*").where({ user_id: userId });
    return res.json(result);
  } catch (err) {
    console.log("Error fetching user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCourse(req, res) {
  const { id } = req.params;
  const updateFields = req.body;

  delete updateFields.user_id;

  try {
    const [updatedUser] = await db("users")
      .where({ user_id: id })
      .update(updateFields)
      .returning("*");
    if (!updatedUser) {
      return res.status(404).json({ error: `User ${id} not found` });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log("Error updating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const [updatedUser] = await db("users")
      .where({ user_id: id })
      .update(updateFields)
      .returning("*");
    if (!updatedUser) {
      return res.status(404).json({ error: `User ${id} not found` });
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log("Error updating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const getUserById = async (req, res) => {
  const { userId } = req.params; // Extract userId from the URL parameters

  try {
    // Query the database to find the user by their ID
    const user = await db("users")
      .select("*")
      .where({ user_id: userId })
      .first();

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user data
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Create a new user
export async function postStudent(req, res) {
  const { userId } = req.auth;
  const { first_name, last_name, email } = req.body;
  try {
    const [createdUser] = await db("users")
      .insert({ user_id: userId, first_name, last_name, email })
      .returning("*");
    return res.status(201).json(createdUser);
  } catch (err) {
    console.log("Error creating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
