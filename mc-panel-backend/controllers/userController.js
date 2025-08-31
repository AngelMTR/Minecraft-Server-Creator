export const getProfile = (req, res) => {
    res.json({ message: "سلام " + req.user.email });
};
