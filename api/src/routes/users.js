import express from "express";
import { getUsers } from "../handlers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/:id/students", addStudentToCourse);
router.delete("/:id/students/:studentId", removeStudentFromCourse);

export default router;
