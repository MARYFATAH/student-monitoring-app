import express from "express";
const router = express.Router();
import {
  getScores,
  createScore,
  deleteScore,
  updateScore,
} from "../handlers/scores.js";
import { requireAuth } from "../middleware/decodeAuthHeader.js";

router.use(requireAuth);

router.get("/", getScores);
router.post("/", createScore);
router.patch("/:id", updateScore);
router.delete("/:id", deleteScore);

export default router;
