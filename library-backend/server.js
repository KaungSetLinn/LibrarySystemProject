const express = require('express');
const cors = require('cors');
const path = require('path');

const { requireLogin } = require('./middleware/auth');

const session = require('express-session');

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

app.use(session({
    secret: 'library-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false // true only in HTTPS
    }
}));

app.use(express.static(frontendPath));

// API routes
app.use('/api/users', userRoutes);

app.use('/api/books', bookRoutes);

// PROTECTED ROUTE
app.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(frontendPath, 'reservation-status.html'));
});

// ✅ Initialize DB before starting server
sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected');

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(err => {
        console.error('❌ DB connection error:', err);
    });


/* const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); */