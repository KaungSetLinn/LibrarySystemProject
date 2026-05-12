const User = require('../models/User');

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json({
            result: 'success',
            messageCode: 'I00',
            message: 'OK',
            data: { users },
        });
    } catch (err) {
        return res.status(500).json({
            result: 'error',
            messageCode: 'E10',
            message: 'システムエラーが発生しました。',
            data: null,
        });
    }
};

// GET user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                result: 'error',
                messageCode: 'W17',
                message: '対象が見つかりません。',
                data: null,
            });
        }

        return res.json({
            result: 'success',
            messageCode: 'I00',
            message: 'OK',
            data: { user },
        });
    } catch (err) {
        return res.status(500).json({
            result: 'error',
            messageCode: 'E10',
            message: 'システムエラーが発生しました。',
            data: null,
        });
    }
};

// =============================================================
// login
// POST /api/v1/auth/login  (API-01)
//
// リクエスト: { userId, userName }
// 成功（200）: 4層構造、data に { userId, userName, loginAt }
// 失敗（400）: E01 — バリデーションエラー
// 失敗（401）: W01 — 利用者IDまたは利用者名が一致しない
// 副作用: セッション保存、audit_log 記録（将来）
// =============================================================
exports.login = async (req, res) => {
    try {
        const { userId, userName } = req.body;

        // ----------------------------
        // 1. バリデーション（§6.2 E01）
        //    userId は正の整数、userName は非空文字列
        // ----------------------------
        const parsedUserId = Number(userId);
        const trimmedName  = typeof userName === 'string' ? userName.trim() : '';

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0 || trimmedName === '') {
            return res.status(400).json({
                result: 'error',
                messageCode: 'E01',
                message: '入力に誤りがあります。',
                data: null,
            });
        }

        // ----------------------------
        // 2. 認証（userId + userName の完全一致）
        // ----------------------------
        const user = await User.findOne({
            where: { userId: parsedUserId, userName: trimmedName },
        });

        if (!user) {
            return res.status(401).json({
                result: 'error',
                messageCode: 'W01',
                message: '利用者IDまたは利用者名が一致しません。',
                data: null,
            });
        }

        // ----------------------------
        // 3. セッション保存
        // ----------------------------
        req.session.user = {
            userId: user.userId,
            userName: user.userName,
        };

        // ----------------------------
        // 4. 成功レスポンス（§8.4.1）
        // ----------------------------
        return res.json({
            result: 'success',
            messageCode: 'I01',
            message: 'ログインしました。',
            data: {
                userId:   user.userId,
                userName: user.userName,
                loginAt:  new Date().toISOString(), // UTC ISO 8601
            },
        });

    } catch (err) {
        return res.status(500).json({
            result: 'error',
            messageCode: 'E10',
            message: 'システムエラーが発生しました。',
            data: null,
        });
    }
};

// =============================================================
// logout
// POST /api/v1/auth/logout  (API-02)
//
// リクエスト: Body なし、X-CSRF-Token ヘッダ要
// 成功（200）: { result, messageCode: "I00", message: "ログアウトしました。", data: null }
// 失敗（401）: W02 — 未認証・セッション切れ
// 失敗（500）: E10 — セッション破棄失敗
// 副作用: req.session.destroy()、Cookie 無効化、audit_log に LOGOUT 記録（将来）
// =============================================================
exports.logout = (req, res) => {
    // ----------------------------
    // 1. 未認証チェック（§8.4.1b W02）
    // ----------------------------
    if (!req.session?.user) {
        return res.status(401).json({
            result: 'error',
            messageCode: 'W02',
            message: 'セッションが切れました。再度ログインしてください。',
            data: null,
        });
    }

    // ----------------------------
    // 2. セッション破棄
    // ----------------------------
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                result: 'error',
                messageCode: 'E10',
                message: 'システムエラーが発生しました。',
                data: null,
            });
        }

        res.clearCookie('connect.sid');

        // ----------------------------
        // 3. 成功レスポンス（§8.4.1b）
        // ----------------------------
        return res.json({
            result: 'success',
            messageCode: 'I00',
            message: 'ログアウトしました。',
            data: null,
        });
    });
};