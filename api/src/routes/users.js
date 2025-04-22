import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  createStudent,
  getUserById,
} from "../handlers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createStudent);
router.get("/my-profile", getUser);
router.patch("/:id", updateUser);
router.get("/:userId", getUserById);

export default router;
