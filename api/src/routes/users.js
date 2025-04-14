import express from "express";
import { getUsers, getUser, updateUser } from "../handlers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/my-profile", getUser);
router.patch("/:id", updateUser);

export default router;
