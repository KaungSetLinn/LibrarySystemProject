/*
 * =============================================================================
 * ファイル名 : start.js
 * 概要       : ConfigFile (frontend/library-system-config.txt) の backendMode を
 *              読み取り、library-backend / library-Tbackend のいずれかを
 *              子プロセスとして起動する統合エントリ。
 *
 * 使用法     : node start.js
 *              または npm start
 *
 * 動作       : backendMode=MAIN  → library-backend/server.js  を起動
 *              backendMode=TEST  → library-Tbackend/server.js を起動
 *              既定/不明な値     → MAIN として扱う(安全側)
 *
 * 作成者     : Y.Toyoda
 * 作成日     : 2026-05-12
 * =============================================================================
 */
"use strict";

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ConfigFile の場所
const CONFIG_PATH = path.join(__dirname, 'frontend', 'library-system-config.txt');

/**
 * ConfigFile から backendMode を抽出する。
 * 失敗時は "MAIN" を返す(安全側)。
 */
function readBackendMode() {
    try {
        const text = fs.readFileSync(CONFIG_PATH, 'utf8');
        const lines = text.split(/\r?\n/);
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const idx = trimmed.indexOf(',');
            if (idx === -1) continue;
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim().toUpperCase();
            if (key === 'backendMode') {
                if (val === 'MAIN' || val === 'TEST') return val;
                console.warn(`[start.js] 不正な backendMode=${val}、MAIN として扱います。`);
                return 'MAIN';
            }
        }
    } catch (e) {
        console.warn(`[start.js] ConfigFile 読込失敗: ${e.message}`);
    }
    return 'MAIN';
}

const mode = readBackendMode();
const targetDir = mode === 'TEST' ? 'library-Tbackend' : 'library-backend';
const targetPath = path.join(__dirname, targetDir);

console.log('='.repeat(64));
console.log(`📚 図書予約システム 統合起動`);
console.log(`   backendMode = ${mode}`);
console.log(`   起動対象    = ${targetDir}/server.js`);
console.log(`   作業ディレクトリ = ${targetPath}`);
console.log('='.repeat(64));

// node_modules の存在チェック
if (!fs.existsSync(path.join(targetPath, 'node_modules'))) {
    console.error(`\n❌ ${targetDir}/node_modules が見つかりません。`);
    console.error(`   先に以下を実行してください:`);
    console.error(`   cd ${targetDir} && npm install`);
    process.exit(1);
}

// DB ファイルの存在チェック(警告のみ)
const dbFile = mode === 'TEST' ? 'libraryT.db' : 'library2.db';
if (!fs.existsSync(path.join(targetPath, dbFile))) {
    console.warn(`\n⚠️  ${targetDir}/${dbFile} が見つかりません。`);
    console.warn(`   初回起動時は以下で DB を初期化してください:`);
    if (mode === 'TEST') {
        console.warn(`   cd ${targetDir} && npm run init-db`);
    } else {
        console.warn(`   cd ${targetDir} && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`);
    }
    console.warn(`   (このまま起動を試行しますが、API がエラーになる可能性があります)\n`);
}

// 子プロセスとして起動
const child = spawn('node', ['server.js'], {
    cwd: targetPath,
    stdio: 'inherit',
    env: { ...process.env }
});

child.on('error', (err) => {
    console.error(`❌ 子プロセス起動エラー: ${err.message}`);
    process.exit(1);
});

child.on('exit', (code, signal) => {
    if (signal) {
        console.log(`\n[start.js] 子プロセスが signal=${signal} で終了`);
    } else {
        console.log(`\n[start.js] 子プロセスが code=${code} で終了`);
    }
    process.exit(code || 0);
});

// Ctrl+C を子プロセスへ伝搬
process.on('SIGINT', () => {
    console.log('\n[start.js] SIGINT を受信、子プロセスを停止します...');
    child.kill('SIGINT');
});
process.on('SIGTERM', () => {
    child.kill('SIGTERM');
});
