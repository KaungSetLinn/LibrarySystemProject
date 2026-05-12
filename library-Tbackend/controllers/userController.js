/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/controllers/userController.js
 * 概要       : 利用者コントローラ。MAIN backend と互換 + 監査ログ自動記録。
 * 作成者     : Y.Toyoda
 * 作成日     : 2026-05-12
 * -----------------------------------------------------------------------------
 */
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

async function _audit(level, eventType, userId, message) {
    try {
        await AuditLog.create({ level, eventType, userId: userId || null, message });
    } catch (e) { /* 監査失敗はメイン処理を止めない */ }
}

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
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST login
exports.login = async (req, res) => {
    try {
        const { userId, userName } = req.body;
        if (!userId || !userName) {
            return res.status(400).json({ message: "Both id and name are required" });
        }
        const user = await User.findOne({ where: { userId, userName } });
        if (!user) {
            await _audit('WARN', 'LOGIN_FAIL', null, `userId=${userId} userName=${userName}`);
            return res.status(401).json({ message: "Invalid id or name" });
        }
        req.session.user = { userId: user.userId, userName: user.userName };
        await _audit('INFO', 'LOGIN_SUCCESS', user.userId, `userName=${user.userName}`);
        return res.json({ userId: user.userId, userName: user.userName });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST logout
exports.logout = (req, res) => {
    try {
        const uid = req.session?.user?.userId;
        req.session.destroy(async (err) => {
            if (err) return res.status(500).json({ message: "Logout failed" });
            res.clearCookie("connect.sid");
            await _audit('INFO', 'LOGOUT', uid, '利用者操作');
            return res.json({ message: "Logout successful" });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
