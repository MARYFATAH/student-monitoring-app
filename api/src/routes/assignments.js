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
import { allowForRoles } from "../middleware/allowForRoles.js";

router.use(requireAuth);

router.get("/", getAssignments);
router.get("/:id", getAssignmentById);
router.post("/", allowForRoles(["teacher"]), createAssignment);
router.patch("/:id", allowForRoles(["teacher"]), updateAssignment);
router.delete("/:id", allowForRoles(["teacher"]), deleteAssignment);

export default router;
