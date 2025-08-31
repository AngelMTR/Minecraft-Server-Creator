import express from "express";
import passport from "passport";
import { googleCallback, logout } from "../controllers/authController.js";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleCallback);
router.post("/logout", logout);

export default router;
