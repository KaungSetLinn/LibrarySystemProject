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