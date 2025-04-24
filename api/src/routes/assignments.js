import express from "express";
const router = express.Router();
import {
  getAssignmentById,
  getAssignments,
  createAssignment,
  deleteAssignment,
  updateAssignment,
} from "../handlers/assignments.js";
import { requireAuth } from "../middleware/decodeAuthHeader.js";

router.use(requireAuth);

router.get("/", getAssignments);
router.get("/:id", getAssignmentById);
router.post("/", createAssignment);
router.patch("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

export default router;
