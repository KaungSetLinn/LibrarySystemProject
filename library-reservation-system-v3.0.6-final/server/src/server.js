/*
 * =============================================================================
 * ファイル名 : server/src/server.js
 * 概要       : 図書予約システム v3.0 サーバーモード エントリポイント。
 *              Express 4.x + better-sqlite3 + SQLite で永続化を行う。
 *              app/ がブラウザ単体（dbType=Excel）で動くのに対し、
 *              本サーバーは dbType=SQLite 時のバックエンドとして動作する。
 *
 *              ★ 共通設定 SSOT は app/library-system-config.txt ★
 *              本サーバー起動時も同 txt を読み込み、整合を保つ。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §7 認証認可 / §8 API一覧 / §16 セキュリティ / §17 ロギング
 *   - 内部仕様書 v3.0  §5 ミドルウェア標準チェーン
 *   - DB仕様書   v3.0  §2.2 PRAGMA / §22 ハイブリッド構成
 *   - ADR-001 / ADR-006 / ADR-010 / ADR-013 / ADR-014
 *   - 議事録          S-01〜S-09（server/ モード追加考慮事項）
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成（議事録 S-01〜S-09 反映）
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const express      = require("express");
const session      = require("express-session");
const SQLiteStore  = require("connect-sqlite3")(session);
const helmet       = require("helmet");
const rateLimit    = require("express-rate-limit");
const csurf        = require("csurf");
const path         = require("path");
const { logger, requestLogger } = require("./utils/logger");
const { errorMiddleware }       = require("./middleware/error");
const { initDb, getConfig }     = require("./utils/db");
const { loadAppConfig }         = require("./utils/config-loader");
const routes                    = require("./routes");

/**
 * bootstrap
 * 概要 : サーバーを起動する。設定読込 → DB初期化 → Express構築 → listen。
 * @returns {Promise<void>}
 * @spec    内部仕様 §5 / 外部仕様 §17 / ADR-014
 */
async function bootstrap() {
  // ---- (1) app/library-system-config.txt を SSOT として読込 ----
  const cfg = loadAppConfig();
  logger.info("server.bootstrap", "設定読込完了", cfg);

  // ---- (2) DB 初期化（PRAGMA / Sequelize sync） ----
  await initDb();
  const dbType = await getConfig("dbType") || cfg.dbType;
  logger.info("server.bootstrap", `Server starting. dbType=${dbType}`);

  // ---- (3) Express 構築 ----
  const app = express();

  // ★ §16 セキュリティ - helmet ★
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  // ★ §17 ロギング ★
  app.use(requestLogger);

  // ★ §7 認証 - express-session + connect-sqlite3 ★
  app.use(session({
    store: new SQLiteStore({ db: "sessions.sqlite", dir: "./data" }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: (cfg.sessionTimeoutMinutes || 30) * 60 * 1000
    }
  }));

  // ★ Rate Limit（外部仕様 §16.1） ★
  const loginLimiter = rateLimit({ windowMs: 60_000, max: 10 });
  const apiLimiter   = rateLimit({ windowMs: 60_000, max: 100 });
  app.use("/api/v1/auth/login", loginLimiter);
  app.use("/api/v1/", apiLimiter);

  // ★ CSRF対策 ★
  app.use(csurf({ cookie: false }));
  app.get("/api/v1/csrf-token", (req, res) => {
    res.json({
      result: "success", messageCode: "I00", message: "OK",
      data: { csrfToken: req.csrfToken() }
    });
  });

  // ---- (4) 静的ファイル（app/ を相対 ../app から配信） ----
  app.use(express.static(path.join(__dirname, "..", "..", "app")));

  // ---- (5) ルーティング ----
  app.use("/api/v1", routes);

  // ---- (6) エラーハンドラ（最後尾） ----
  app.use(errorMiddleware);

  // ---- (7) 起動 ----
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => logger.info("server.listen", `Listening on http://localhost:${port}`));
}

bootstrap().catch(e => {
  logger.error("bootstrap", "起動失敗", { err: e.message, stack: e.stack });
  process.exit(1);
});
