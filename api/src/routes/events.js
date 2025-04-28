import express from "express";
const router = express.Router();
import {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../handlers/events.js";
import { requireAuth } from "../middleware/decodeAuthHeader.js";
import { allowForRoles } from "../middleware/allowForRoles.js";

router.use(requireAuth);

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", allowForRoles(["teacher"]), createEvent);
router.patch("/:id", allowForRoles(["teacher"]), deleteEvent);
router.delete("/:id", allowForRoles(["teacher"]), updateEvent);

export default router;
