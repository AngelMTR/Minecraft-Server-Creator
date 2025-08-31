import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const googleCallback = async (req, res) => {
    try {
        const user = Array.isArray(req.user) ? req.user[0] : req.user;

        // چک کردن id موجود
        if (!user.id) {
            return res.status(500).json({ error: "User ID is missing, cannot create session." });
        }

        // ساخت JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // زمان انقضا
        const expiresAt = new Date(Date.now() + 60*60*1000);

        // ذخیره JWT در user_sessions
        await pool.query(
            "INSERT INTO user_sessions (user_id, jwt_token, expires_at) VALUES ($1,$2,$3)",
            [user.id, token, expiresAt]
        );

        res.json({ message: "Login successful ✅", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const logout = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        await pool.query("DELETE FROM user_sessions WHERE jwt_token=$1", [token]);
        res.json({ message: "Logout successful ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
