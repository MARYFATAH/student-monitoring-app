import { db } from "../util/db.js";

export async function verifyUser(req, _, next) {
  const { userId } = req.auth;
  console.log("Verifying user with ID:", userId);
  if (!userId) {
    console.error("No userId found in request");
    return next();
  }
  try {
    const user = await db("users")
      .where({
        user_id: userId,
      })
      .first();
    req.auth.role = user?.role || "user";
    console.log("User role set to:", req.auth.role);
    if (!user) {
      console.log("User not found, creating new user entry");
      await db("users").insert({
        user_id: userId,
        role: "user",
        created_at: new Date(),
      });
      req.auth.role = "user";
      console.log("New user entry created");
    }
    console.log("User verified:", user);
    return next();
  } catch (err) {
    console.error("Error verifying user:", err);
    return next(err);
  }
}
