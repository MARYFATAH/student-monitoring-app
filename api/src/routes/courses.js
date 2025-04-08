import express from "express";
import {
  getCourseById,
  getCourses,
  createCourse,
  deleteCourse,
  updateCourse,
  getStudentsInCourse,
  addStudentToCourse,
  removeStudentFromCourse,
} from "../handlers/courses.js";

import { requireAuth } from "../middleware/decodeAuthHeader.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);

router.get("/:id/students", getStudentsInCourse);
router.post("/:id/students", addStudentToCourse);
router.delete("/:id/students/:studentId", removeStudentFromCourse);

export default router;
