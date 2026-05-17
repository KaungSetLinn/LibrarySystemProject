/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: library-Tbackend/middleware/auth.js
 * 責務: 認証ミドルウェア。未ログイン API リクエストを JSON エラーへ変換する。
 * 保守メモ: 画面遷移用 redirect と API 用 JSON を混同しないこと。
 */
exports.requireLogin = (req, res, next) => {
    if (!req.session.user) {

        // If API request → return JSON
        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({ message: "Not logged in" });
        }

        // If page request → redirect
        return res.redirect('/login.html');
    }

    next();
};