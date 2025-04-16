import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  createStudent,
} from "../handlers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/my-profile", getUser);
router.patch("/:id", updateUser);
router.post("/", createStudent);

export default router;
