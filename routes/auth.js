import express from "express";
import { deleteUser, getAllUsers, getUser, loginUser, registerUser, updateUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/auth/register", registerUser)
router.post("/auth/login", loginUser)
router.get("/auth/users", getAllUsers)
router.get("/auth/:id", getUser)
router.delete("/auth/:id", deleteUser)
router.patch("/auth/:id", updateUser);

export default router;
