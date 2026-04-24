const User = require('../models/User');

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST login by userId and userName
exports.login = async (req, res) => {
    try {
        const { userId, userName } = req.body;

        // Validation
        if (!userId || !userName) {
            return res.status(400).json({
                message: "Both id and name are required"
            });
        }

        // Find user with BOTH conditions
        const user = await User.findOne({
            where: { userId, userName }
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid id or name"
            });
        }

        // ✅ Store user in session
        req.session.user = {
            userId: user.userId,
            userName: user.userName
        };

        return res.json({
            userId: user.userId,
            userName: user.userName
        });
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

exports.logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    message: "Logout failed"
                });
            }

            res.clearCookie("connect.sid"); // optional but recommended

            return res.json({
                message: "Logout successful"
            });
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};