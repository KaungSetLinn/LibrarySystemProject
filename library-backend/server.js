const express = require('express');
const cors = require('cors');
const path = require('path');

const { requireLogin } = require('./middleware/auth');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = require('./db/connection');

// IMPORT ASSOCIATION
require('./models/associations');

const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');

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

// Global auth — only login is public
app.use((req, res, next) => {
    if (req.path === '/api/users/login') return next();
    return requireLogin(req, res, next);
});

// API routes
app.use('/api/users', userRoutes);

app.use('/api/books', bookRoutes);

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


/* const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); */