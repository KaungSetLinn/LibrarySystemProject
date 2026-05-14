const sequelize = require('../db/connection');

// =============================================================
// API-10
// GET /api/v1/health
// =============================================================
exports.getHealth = async (req, res) => {

    try {

        // --------------------------------------------------
        // DB接続確認
        // --------------------------------------------------
        await sequelize.authenticate();

        return res.status(200).json({
            result:      'success',
            messageCode: 'I00',
            message:     'OK',
            data: {
                status: 'ok',
                dbConnected: true,
                uptime: process.uptime(),
                dbType: 'SQLite',
                schemaVersion: '3.0.0',
            },
        });

    } catch (err) {

        return res.status(500).json({
            result:      'error',
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
            data:        null,
        });
    }
};