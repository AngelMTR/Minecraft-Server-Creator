import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Session middleware
app.use(session({
    secret: "supersecret",  // فقط برای session، JWT هم داریم
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        // چک کردن وجود کاربر در جدول users_google
        let user = await pool.query("SELECT * FROM users_google WHERE google_id=$1", [profile.id]);
        if (user.rows.length === 0) {
            // ایجاد رکورد جدید
            user = await pool.query(
                `INSERT INTO users_google 
                (google_id, email, name, given_name, family_name, picture, locale) 
                VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
                [profile.id, email, profile.displayName, profile.name.givenName, profile.name.familyName, profile.photos[0].value, profile._json.locale]
            );
        } else {
            user = user.rows[0];
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        try {
            const user = Array.isArray(req.user) ? req.user[0] : req.user;

            // JWT بساز
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // زمان انقضا محاسبه کن
            const expiresAt = new Date(Date.now() + 60*60*1000); // 1 ساعت بعد

            // ذخیره JWT در user_sessions
            await pool.query(
                "INSERT INTO user_sessions (user_id, jwt_token, expires_at) VALUES ($1,$2,$3)",
                [user.id, token, expiresAt]
            );

            res.json({ message: "Login successful ✅", token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// Middleware محافظت API
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        // verify JWT
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // چک کردن توکن در user_sessions
        const result = await pool.query(
            "SELECT * FROM user_sessions WHERE jwt_token=$1 AND expires_at > NOW()",
            [token]
        );
        if (result.rows.length === 0) return res.sendStatus(403);

        req.user = payload;
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
};

app.post("/logout", async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        // حذف توکن از دیتابیس
        await pool.query("DELETE FROM user_sessions WHERE jwt_token=$1", [token]);
        res.json({ message: "Logout successful ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// نمونه route محافظت‌شده
app.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "سلام " + req.user.email });
});

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
