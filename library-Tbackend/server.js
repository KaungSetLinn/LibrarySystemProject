/*
 * -----------------------------------------------------------------------------
 * ファイル名 : library-Tbackend/server.js
 * 概要       : 豊田テストバックエンドのサーバ起動エントリ。
 *              MAIN backend と同一ポート(3000)・同一 frontend を使用。
 *              ConfigFile の backendMode=TEST で start.js が選択起動する。
 * 作成者     : Y.Toyoda
 * 作成日     : 2026-05-12
 * -----------------------------------------------------------------------------
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const { requireLogin } = require('./middleware/auth');
const sequelize = require('./db/connection');
require('./models/associations');

const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');

const app = express();

// frontend は両 backend で共通の 1 セットを使用(プロジェクトルート/frontend)
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
    secret: 'library-Tbackend-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.static(frontendPath));

// グローバル認証ガード(login と health 以外は要ログイン)
app.use((req, res, next) => {
    if (req.path === '/api/users/login') return next();
    if (req.path === '/api/v1/health')   return next();
    return requireLogin(req, res, next);
});

// 識別用ヘルスチェック
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'ok',
        backend: 'Tbackend',
        version: 'v3.0.6-integrated',
        dbConnected: true
    });
});

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'reservation-status.html'));
});

const PORT = process.env.PORT || 3000;
sequelize.authenticate()
    .then(() => {
        console.log('✅ [Tbackend] Database connected (libraryT.db)');
        app.listen(PORT, () => {
            console.log(`🅃 [Tbackend] Server running on port ${PORT}`);
            console.log(`   frontend = ${frontendPath}`);
        });
    })
    .catch(err => {
        console.error('❌ [Tbackend] DB connection error:', err);
        process.exit(1);
    });
