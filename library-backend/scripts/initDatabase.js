const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Path to DB
const dbPath = path.join(__dirname, '../library2.db');

// Path to SQL file
const sqlPath = path.join(__dirname, '../create_database.sql');

// Create / connect DB
const db = new sqlite3.Database(dbPath);

// Read SQL file
const sql = fs.readFileSync(sqlPath, 'utf8');

// Execute SQL
db.exec(sql, (err) => {
    if (err) {
        console.error("❌ Error initializing database:", err.message);
    } else {
        console.log("✅ Database initialized successfully!");
    }

    db.close();
});