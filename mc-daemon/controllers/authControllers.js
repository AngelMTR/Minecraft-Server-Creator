export const authController = {
    checkToken: (req, res) => {
        res.json({ message: "Token is valid" });
    }
};