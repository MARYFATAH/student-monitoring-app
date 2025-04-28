import express from "express";
const router = express.Router();
import {
  getScores,
  createScore,
  deleteScore,
  updateScore,
} from "../handlers/scores.js";
import { requireAuth } from "../middleware/decodeAuthHeader.js";
import { allowForRoles } from "../middleware/allowForRoles.js";

router.use(requireAuth);

router.get("/", allowForRoles(["teacher", "student"]), getScores);
router.post("/", allowForRoles(["teacher"]), createScore);
router.patch("/:id", allowForRoles(["teacher"]), updateScore);
router.delete("/:id", allowForRoles(["teacher"]), deleteScore);

export default router;
