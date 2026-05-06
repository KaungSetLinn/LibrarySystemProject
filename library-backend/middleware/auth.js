exports.requireLogin = (req, res, next) => {
    if (!req.session.user) {

        // If API request → return JSON
        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({ "messageCode": "E09", "message": "セッションが切れました。再度ログインしてください。" });
        }

        // If page request → redirect
        return res.redirect('/login.html');
    }

    next();
};