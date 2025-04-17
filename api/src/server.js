import "dotenv/config";
import express from "express";
import cors from "cors";
import { decodeAuthHeader } from "./middleware/decodeAuthHeader.js";
import users from "./routes/users.js";
import courses from "./routes/courses.js";
import { clerkMiddleware, createClerkClient, getAuth } from "@clerk/express";
// Adding these additional routes for enhanced functionality
import { getUsers, getUserById } from "./handlers/users.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, _, next) => {
  console.debug("Incoming request:", req.method, req.path);
  next();
});

app.get("/", (_, res) => {
  return res.json({ msg: "Welcome to the Student Monitoring API API" });
});

app.use(clerkMiddleware());

app.use((req, _, next) => {
  req.auth = getAuth(req);
  if (!req.auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// app.use((req, _, next) => {
//   console.debug("req.auth.userId:", req.auth.userId);
//   next();
// });

// app.get("/users", getUsers); // Handles ?role=student query
// app.get("/users/:userId", getUserById); // Handles /clerkId4 path parameter

// Existing routes
app.use("/users", users);
app.use("/courses", courses);

app.listen(PORT, () => {
  console.log(`Student Monitoring API listening on port ${PORT}`);
});

app.patch("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const updatedData = req.body;

  console.log("PATCH request received for userId:", userId);
  console.log("Payload received:", updatedData);

  try {
    const updatedStudent = await db("users")
      .where({ user_id: userId })
      .update(updatedData)
      .returning("*");

    if (!updatedStudent.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedStudent[0]);
  } catch (error) {
    console.error("Error updating user:", error); // Log error details
    res.status(500).send("Internal server error");
  }
});
