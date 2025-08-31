import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import setupPassport from "./config/passport.js"; // ← تابع

setupPassport(); // passport بعد از dotenv.init

const app = express();

app.use(session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

export default app;
