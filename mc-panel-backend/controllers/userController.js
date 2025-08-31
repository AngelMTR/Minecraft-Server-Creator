// import { pool } from "../db.js";

export const getProfile = (req, res) => {
    res.json({ message: "سلام " + req.user.email });
};


// export const logout = async (req, res) => {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];
//
//     if (!token) return res.status(401).json({ error: "No token provided" });
//
//     try {
//         // حذف توکن از user_sessions
//         await pool.query("DELETE FROM user_sessions WHERE jwt_token=$1", [token]);
//         res.json({ message: "Logout successful ✅" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
