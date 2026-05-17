/*
 * Readable-code review note:
 * - Role: Authentication middleware for the test backend. Keep session checks small and auditable.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
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