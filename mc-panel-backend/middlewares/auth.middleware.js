const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'توکن ارائه نشده است.' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        // req.user = { username: 'Dana', iat: 1751420704, exp: 1751427904 };
        next();
    } catch {
        res.status(403).json({ message: 'توکن نامعتبر است.' });
    }
};
