const express = require('express');
const cors = require('cors');
const path = require('path');

const { requireLogin } = require('./middleware/auth');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = require('./db/connection');

// IMPORT ASSOCIATION
require('./models/associations');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const reservationRoutes = require('./routes/reservations');
const adminRoutes = require('./routes/admin');
const loanRoutes = require('./routes/loans');
const healthRoutes = require('./routes/health');

const app = express();

const frontendPath = path.join(__dirname, '../frontend');

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

const sessionStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000, // Clean up expired sessions every 15 minutes
    expiration: 1000 * 60 * 60,              // 1 hour
});

app.use(session({
    secret: 'library-secret-key',
    resave: false,
    saveUninitialized: false,
    rolling: true,  // Resets expiration on every request (active users stay logged in)
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
        secure: false // true only in HTTPS
    }
}));

app.use(express.static(frontendPath));

// Global auth — /api/v1/auth/* and /api/v1/health are public
app.use((req, res, next) => {
    if (req.path.startsWith('/api/v1/auth/')) return next();
    if (req.path === '/api/v1/health') return next();
    return requireLogin(req, res, next);
});

// API routes (§8.3 API-01〜API-14, all paths under /api/v1/)
app.use('/api/v1/auth', authRoutes);                // API-01 POST /login, API-02 POST /logout
app.use('/api/v1/users', userRoutes);               // API-03/03b/06/07/11/12/13/14
app.use('/api/v1/books', bookRoutes);               // API-04 GET /search, API-04b GET /:bookId
app.use('/api/v1/reservations', reservationRoutes); // API-05 POST /
app.use('/api/v1/admin/bridge', adminRoutes);       // API-08a/08b/08c
app.use('/api/v1/loans', loanRoutes);               // API-09 POST /events
app.use('/api/v1/health', healthRoutes);            // API-10 GET /

// PROTECTED ROUTE
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'reservation-status.html'));
});

// ✅ Initialize DB before starting server
sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected');

        // Sync session table then start server
        return sessionStore.sync();
    })
    .then(() => {
        console.log('✅ Session store synced');

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(err => {
        console.error('❌ Startup error:', err);
    });