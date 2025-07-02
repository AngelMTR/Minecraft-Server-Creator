const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
    const { username, password } = req.body;
    const correctUsername = process.env.USERNAME;
    const hashedPassword = process.env.PASSWORD_HASH;

    if (username !== correctUsername) {
        return res.status(401).json({ message: 'نام کاربری اشتباه است.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'رمز عبور اشتباه است.' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
};
