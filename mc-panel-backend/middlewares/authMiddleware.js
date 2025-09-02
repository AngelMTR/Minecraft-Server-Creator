import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // چک کردن در user_sessions
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
