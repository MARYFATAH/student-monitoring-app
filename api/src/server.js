import "dotenv/config";
import express from "express";
import cors from "cors";
import { decodeAuthHeader } from "./middleware/decodeAuthHeader.js";
import users from "./routes/users.js";
import courses from "./routes/courses.js";
import { clerkMiddleware } from "@clerk/express";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (_, res) => {
  return res.json({ msg: "Welcome to the Student Monitoring API API" });
});
app.use("/users", users);
app.use("/courses", courses);

app.listen(PORT, () => {
  console.log(`Student Monitoring API listening on port ${PORT}`);
});
