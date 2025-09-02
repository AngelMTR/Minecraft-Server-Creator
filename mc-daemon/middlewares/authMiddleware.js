import { config } from '../daemon.config.js';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${config.auth.token}`) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}
