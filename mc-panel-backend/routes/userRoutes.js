import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";
// import { logout } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
// router.post("/logout", authMiddleware, logout);

export default router;
