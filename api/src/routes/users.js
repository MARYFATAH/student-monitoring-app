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
router.get("/x/my-profile", getUser);
router.patch("/:id", updateUser);
router.post("/", createStudent);
router.get("/:id", getUserById);

export default router;
