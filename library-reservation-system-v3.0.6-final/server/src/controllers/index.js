/*
 * =============================================================================
 * ファイル名 : server/src/controllers/index.js
 * 概要       : Controller 層。Express ルートハンドラを兼任し、
 *              四層構造応答（ok/err）で統一して返す。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v4.0  §8 API一覧 / §8.2 共通応答形式
 *   - 内部仕様書 v4.0  §3 モジュール構成 / §6 HCP（AU01/RV03/RV02/SR02/MP01/RV01）
 *   - DB仕様書   v4.0  §10 トランザクション / §11 状態管理
 *   - 改訂対象        S-3（予約API強化）/ A-4（API契約整合）/ A-6（簡易認証注記）
 *
 * 改訂履歴:
 *   v3.0    2026-05-04  Y.Toyoda  新規作成
 *   v3.0.3  2026-05-05  Y.Toyoda  予約処理にトランザクション・書籍状態チェック・監査ログ追加。
 *                                 検索/dashboard/mypage/notifications API 新設。
 *   v3.0.5  2026-05-10  Y.Toyoda  API-06 パスを /users/:userId/reservations/:reservationId に修正、:userId 一致確認追加
 *   v3.0.6  2026-05-11  Y.Toyoda  v4.0a-rev3 反映：favorites CRUD（API-11/12/13）・
 *                                 通知既読化（API-14）・getMyPage に favorites 実データ返却
 *
 * @author  Y.Toyoda
 * @version v3.0.6
 * =============================================================================
 */
"use strict";

const { body, query, validationResult } = require("express-validator");
const { ok, err } = require("../utils/response");
const { getDb }   = require("../utils/db");
const { logger } = require("../utils/logger");

/* ================ ヘルパ ================ */

/**
 * _toIntId
 * 概要 : 入力値を正の整数IDに変換。失敗時は ValidationError を投げる。
 * @param {*} v
 * @returns {number}
 * @throws  Error
 */
function _toIntId(v) {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) {
    const e = new Error("IDは正の整数を指定してください。");
    e.messageCode = "E01"; e.httpStatus = 400;
    throw e;
  }
  return n;
}

/**
 * _validate : express-validator の結果を例外化
 * @param {Object} req
 */
function _validate(req) {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    const e = new Error(errs.array().map(x => x.msg).join(", "));
    e.messageCode = "E01"; e.httpStatus = 400;
    throw e;
  }
}

/**
 * _writeAudit
 * 概要 : audit_log に1件追記する（v3.0.3 / S-3 関連）。
 *        トランザクション外でも内でも呼び出せるよう、db ハンドルを引数で受ける。
 * @param {Object} db
 * @param {number|null} userId
 * @param {string} action
 * @param {string} targetTable
 * @param {number|null} targetId
 * @param {Object} [changes]
 * @returns {void}
 * @spec    DB仕様書 §5.8 audit_log
 */
function _writeAudit(db, userId, action, targetTable, targetId, changes) {
  try {
    db.prepare(
      "INSERT INTO audit_log(user_id, action, target_table, target_id, changes) VALUES(?,?,?,?,?)"
    ).run(userId ?? null, action, targetTable, targetId ?? null,
          changes ? JSON.stringify(changes) : null);
  } catch (e) {
    // 監査ログ失敗は業務処理を止めない（ただし必ず記録）
    logger.warn("audit", "writeAudit failed: " + e.message);
  }
}

/* ================ Auth ================
 * NOTE (A-6): v3.x は簡易認証（利用者ID＋利用者名）。
 *             EX-01 でパスワードハッシュ照合（bcrypt）に拡張予定。
 *             本番運用ではハッシュ化必須。
 * ============================================ */

/**
 * login（API-01 / 簡易認証）
 * @spec  RF-01 / AU01
 * @note  v3.x 簡易認証モード — A-6 に基づき README/docs/known-issues.md に明記
 */
async function login(req, res, next) {
  try {
    _validate(req);
    const { userCode, userName } = req.body;
    const db = getDb();
    const u = db.prepare("SELECT * FROM users WHERE user_code = ? AND name = ?")
                .get(userCode, userName);
    if (!u) {
      _writeAudit(db, null, "LOGIN_FAILED", "users", null, { userCode });
      return err(res, "W01", "利用者IDまたは利用者名が一致しません。", 401);
    }
    // TODO(EX-01): bcrypt.compareSync(req.body.password, u.password_hash) を追加
    req.session.userId = u.user_id;
    req.session.userName = u.name;
    _writeAudit(db, u.user_id, "LOGIN_SUCCESS", "users", u.user_id, null);
    return ok(res, "I01", "ログインしました。",
      { user: { userId: u.user_id, userName: u.name } });
  } catch (e) { next(e); }
}

/** logout（API-02） */
async function logout(req, res, next) {
  const userId = req.session && req.session.userId;
  try {
    if (userId) _writeAudit(getDb(), userId, "LOGOUT", "users", userId, null);
  } catch (_) { /* DB未初期化等は無視 */ }
  req.session.destroy(() => ok(res, "I00", "ログアウトしました。", null));
}

/* ================ Reservation ================ */

/**
 * reserve（API-05）
 * 概要 : 予約登録。書籍存在・利用可否・重複・上限を再検証し、
 *        reservations / audit_log を1トランザクションで原子更新する（v3.0.3 / S-3）。
 *
 * @spec  RF-07 / RV03 / DB §10 トランザクション
 */
async function reserve(req, res, next) {
  try {
    _validate(req);
    const userId = req.session.userId;
    const bookId = _toIntId(req.body.bookId);
    const db = getDb();

    // ===== トランザクション化 (v3.0.3 / S-3) =====
    const txn = db.transaction(() => {
      // (1) 書籍存在確認
      const book = db.prepare("SELECT * FROM books WHERE book_id = ?").get(bookId);
      if (!book) {
        return { kind: "err", code: "W17", msg: "対象の書籍が見つかりません。", status: 404 };
      }

      // (2) 書籍が利用可能か（is_disabled=1 の場合は予約不可）
      if (book.is_disabled === 1) {
        return { kind: "err", code: "W13", msg: "この書籍は利用停止中のため予約できません。", status: 422 };
      }

      // (3) 同一利用者が同一書籍をすでに RESERVED していないか（重複）
      const dup = db.prepare(
        "SELECT 1 FROM reservations WHERE user_id=? AND book_id=? AND status='RESERVED'"
      ).get(userId, bookId);
      if (dup) {
        return { kind: "err", code: "W11", msg: "この書籍はすでに予約済です。", status: 422 };
      }

      // (4) 予約上限（3件）チェック
      const cnt = db.prepare(
        "SELECT COUNT(*) AS c FROM reservations WHERE user_id=? AND status='RESERVED'"
      ).get(userId).c;
      if (cnt >= 3) {
        return { kind: "err", code: "W12", msg: "予約上限に達しています（3冊）。", status: 422 };
      }

      // (5) INSERT
      const now = new Date().toISOString();
      const result = db.prepare(`
        INSERT INTO reservations(user_id, book_id, status, reserved_at, created_at, updated_at)
        VALUES(?,?,'RESERVED',?,?,?)
      `).run(userId, bookId, now, now, now);

      // (6) 監査ログ
      _writeAudit(db, userId, "RESERVE_BOOK", "reservations",
        result.lastInsertRowid, { bookId, status: "RESERVED" });

      return {
        kind: "ok",
        reservationId: result.lastInsertRowid,
        bookTitle: book.title
      };
    });

    let outcome;
    try {
      outcome = txn();
    } catch (txnErr) {
      // 部分一意INDEX（uq_reservations_active）で UNIQUE 違反 → 重複扱い
      if (String(txnErr.message || "").includes("UNIQUE")) {
        return err(res, "W11", "この書籍はすでに予約済です。", 422);
      }
      // SQLITE_BUSY 等の競合
      if (String(txnErr.code || "").includes("BUSY")) {
        return err(res, "W18", "処理が競合しました。再度お試しください。", 423);
      }
      throw txnErr;
    }

    if (outcome.kind === "err") {
      return err(res, outcome.code, outcome.msg, outcome.status);
    }
    return ok(res, "I02", "予約を登録しました。", {
      reservationId: outcome.reservationId,
      status: "RESERVED",
      bookTitle: outcome.bookTitle
    }, 201);
  } catch (e) { next(e); }
}

/**
 * cancel（API-06）
 * 概要 : 予約取消。パスの :userId とセッション userId の一致確認、
 *        本人確認・状態確認・更新・監査ログを1トランザクションで実行。
 *        URL: DELETE /api/v1/users/:userId/reservations/:reservationId（v3.0.5）
 * @spec  RF-08 / RV02 / 外部仕様 v4.0a-rev2 §8.4.5
 */
async function cancel(req, res, next) {
  try {
    const sessionUserId = req.session.userId;
    const pathUserId = _toIntId(req.params.userId);
    if (pathUserId !== sessionUserId) {
      return err(res, "W03", "他者の予約は取消できません。", 403);
    }
    const userId = sessionUserId;
    const id = _toIntId(req.params.reservationId);
    const db = getDb();

    const txn = db.transaction(() => {
      const r = db.prepare(
        "SELECT * FROM reservations WHERE reservation_id=? AND user_id=?"
      ).get(id, userId);
      if (!r) return { kind: "err", code: "W17", msg: "対象の予約が見つかりません。", status: 404 };
      if (r.status !== "RESERVED")
        return { kind: "err", code: "W14", msg: "キャンセル可能な予約ではありません。", status: 422 };

      const now = new Date().toISOString();
      db.prepare("UPDATE reservations SET status='CANCELED', canceled_at=?, updated_at=? WHERE reservation_id=?")
        .run(now, now, id);
      _writeAudit(db, userId, "CANCEL_RESERVATION", "reservations", id, { from: "RESERVED", to: "CANCELED" });
      return { kind: "ok" };
    });

    const outcome = txn();
    if (outcome.kind === "err") return err(res, outcome.code, outcome.msg, outcome.status);
    return ok(res, "I03", "予約をキャンセルしました。", { reservationId: id, status: "CANCELED" });
  } catch (e) { next(e); }
}

/* ================ Read APIs（v3.0.3 / A-4 新設）================ */

/**
 * searchBooks（API-04）
 * 概要 : 書籍検索。title/author 部分一致、category 完全一致、ページング。
 *        全空時は W04 を返す（外部仕様書 §7.2.3）。
 * @spec  RF-04/05/06 / SR02
 */
async function searchBooks(req, res, next) {
  try {
    const title = (req.query.title || "").trim();
    const author = (req.query.author || "").trim();
    const category = (req.query.category || "").trim();
    if (!title && !author && !category) {
      return err(res, "W04", "検索条件を1つ以上入力してください。", 400);
    }
    const page = Math.max(0, parseInt(req.query.page, 10) || 0);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
    const sort = ["title", "author", "arrivalDateDesc", "bookId"].includes(req.query.sort)
      ? req.query.sort : "bookId";

    const conds = [];
    const params = [];
    if (title)    { conds.push("title LIKE ?");    params.push("%" + title + "%"); }
    if (author)   { conds.push("author LIKE ?");   params.push("%" + author + "%"); }
    if (category) { conds.push("category = ?");    params.push(category); }
    const where = conds.length ? "WHERE " + conds.join(" AND ") : "";

    const orderBy = ({
      title: "title ASC, book_id ASC",
      author: "author ASC, book_id ASC",
      arrivalDateDesc: "arrival_date DESC, book_id ASC",
      bookId: "book_id ASC"
    })[sort];

    const db = getDb();
    const count = db.prepare(`SELECT COUNT(*) AS c FROM books ${where}`).get(...params).c;
    const rows = db.prepare(
      `SELECT book_id, title, author, category, arrival_date, is_disabled FROM books ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
    ).all(...params, pageSize, page * pageSize);

    const userId = req.session.userId;
    const myReserved = new Set(
      db.prepare("SELECT book_id FROM reservations WHERE user_id=? AND status='RESERVED'")
        .all(userId).map(r => r.book_id)
    );
    const othersReserved = new Set(
      db.prepare("SELECT DISTINCT book_id FROM reservations WHERE user_id<>? AND status='RESERVED'")
        .all(userId).map(r => r.book_id)
    );

    const books = rows.map(b => {
      let actionState, actionLabel;
      if (b.is_disabled) { actionState = "DISABLED"; actionLabel = "不可"; }
      else if (myReserved.has(b.book_id))     { actionState = "RESERVED"; actionLabel = "予約済（自分）"; }
      else if (othersReserved.has(b.book_id)) { actionState = "RESERVED"; actionLabel = "予約済（他利用者）"; }
      else                                     { actionState = "AVAILABLE"; actionLabel = "予約する"; }
      return {
        bookId: String(b.book_id),
        title: b.title, author: b.author, category: b.category,
        arrivalDate: b.arrival_date,
        status: b.is_disabled ? "利用停止" : "在庫あり",
        actionState, actionLabel, dueDate: null
      };
    });

    return ok(res, "I00", "OK", {
      count, page, pageSize,
      totalPages: Math.max(1, Math.ceil(count / pageSize)),
      books
    });
  } catch (e) { next(e); }
}

/**
 * getDashboard（API-03）
 * 概要 : 予約状況ダッシュボード（残予約枠・通知サマリ・現在予約一覧）。
 * @spec  RF-03 / RV01
 */
async function getDashboard(req, res, next) {
  try {
    const userId = _toIntId(req.params.userId);
    if (userId !== req.session.userId) {
      return err(res, "W03", "他者のダッシュボードは取得できません。", 403);
    }
    const db = getDb();
    const reservations = db.prepare(`
      SELECT r.reservation_id AS reservationId, r.book_id AS bookId, b.title, b.author,
             r.status, r.reserved_at AS reservedAt, r.pickup_deadline AS pickupDeadline
      FROM reservations r LEFT JOIN books b ON r.book_id = b.book_id
      WHERE r.user_id = ? AND r.status = 'RESERVED'
      ORDER BY r.reserved_at DESC
    `).all(userId);
    const reservationCount = reservations.length;
    const remainingQuota = Math.max(0, 3 - reservationCount);
    const unreadCount = db.prepare(
      "SELECT COUNT(*) AS c FROM notifications WHERE user_id=? AND is_read=0"
    ).get(userId).c;

    return ok(res, "I00", "OK", {
      reservations,
      reservationCount,
      remainingQuota,
      unreadCount
    });
  } catch (e) { next(e); }
}

/**
 * getMyPage（API-07）
 * 概要 : マイページ集約（5タブ分のデータを一度に返却）。
 * @spec  RF-10 / MP01
 */
async function getMyPage(req, res, next) {
  try {
    const userId = _toIntId(req.params.userId);
    if (userId !== req.session.userId) {
      return err(res, "W03", "他者のマイページは取得できません。", 403);
    }
    const db = getDb();
    const currentReservations = db.prepare(`
      SELECT r.reservation_id AS reservationId, r.book_id AS bookId, b.title, b.author,
             r.status, r.reserved_at AS reservedAt
      FROM reservations r LEFT JOIN books b ON r.book_id = b.book_id
      WHERE r.user_id = ? AND r.status = 'RESERVED'
      ORDER BY r.reserved_at DESC
    `).all(userId);
    const history = db.prepare(`
      SELECT r.reservation_id AS reservationId, r.book_id AS bookId, b.title,
             r.status, r.reserved_at AS reservedAt, r.canceled_at AS canceledAt
      FROM reservations r LEFT JOIN books b ON r.book_id = b.book_id
      WHERE r.user_id = ?
      ORDER BY r.reserved_at DESC LIMIT 50
    `).all(userId);
    const notifications = db.prepare(
      "SELECT notification_id AS notificationId, type, title, body, is_read AS isRead, created_at AS createdAt FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50"
    ).all(userId);
    // v3.0.6: favorites を実データで返す
    const favorites = db.prepare(`
      SELECT f.favorite_id AS favoriteId, f.book_id AS bookId,
             b.title, b.author, b.category,
             f.created_at AS addedAt
      FROM favorites f LEFT JOIN books b ON f.book_id = b.book_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC LIMIT 50
    `).all(userId);

    return ok(res, "I00", "OK", {
      currentReservations,
      history,
      favorites,
      notifications
    });
  } catch (e) { next(e); }
}

/**
 * getNotifications（API-03b）
 * @spec  RF-09
 */
async function getNotifications(req, res, next) {
  try {
    const userId = _toIntId(req.params.userId);
    if (userId !== req.session.userId) {
      return err(res, "W03", "他者の通知は取得できません。", 403);
    }
    const db = getDb();
    const list = db.prepare(
      "SELECT notification_id AS notificationId, type, title, body, is_read AS isRead, created_at AS createdAt FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100"
    ).all(userId);
    return ok(res, "I00", "OK", { notifications: list });
  } catch (e) { next(e); }
}

/**
 * getBook（B-9 関連の補助API：書籍1件取得）
 * @spec  RF-04
 */
async function getBook(req, res, next) {
  try {
    const bookId = _toIntId(req.params.bookId);
    const db = getDb();
    const b = db.prepare("SELECT book_id, title, author, category, arrival_date, is_disabled FROM books WHERE book_id=?")
                .get(bookId);
    if (!b) return err(res, "W17", "書籍が見つかりません。", 404);
    return ok(res, "I00", "OK", {
      bookId: String(b.book_id),
      title: b.title, author: b.author, category: b.category,
      arrivalDate: b.arrival_date, isDisabled: b.is_disabled === 1
    });
  } catch (e) { next(e); }
}

/**
 * health（API-10）
 */
async function health(req, res) {
  let dbConnected = false;
  try {
    const db = getDb();
    db.prepare("SELECT 1").get();
    dbConnected = true;
  } catch (_) { /* noop */ }
  return ok(res, "I00", "OK", {
    status: dbConnected ? "ok" : "degraded",
    dbConnected,
    uptime: Math.floor(process.uptime())
  });
}

/* ================ Favorites (v3.0.6 / API-11/12/13) ================ */

/**
 * listFavorites（API-11）
 * 概要 : お気に入り一覧をページング付きで返す。本人のみ。
 * @spec  RF-10 / MP02 / 外部仕様 v4.0a-rev3 §8.4.11
 */
async function listFavorites(req, res, next) {
  try {
    const pathUserId = _toIntId(req.params.userId);
    if (pathUserId !== req.session.userId) {
      return err(res, "W03", "他者のお気に入りは取得できません。", 403);
    }
    const page = Math.max(0, parseInt(req.query.page, 10) || 0);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
    const db = getDb();
    const count = db.prepare("SELECT COUNT(*) AS c FROM favorites WHERE user_id=?").get(pathUserId).c;
    const rows = db.prepare(`
      SELECT f.favorite_id AS favoriteId, f.book_id AS bookId,
             b.title, b.author, b.category,
             f.created_at AS addedAt
      FROM favorites f LEFT JOIN books b ON f.book_id = b.book_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `).all(pathUserId, pageSize, page * pageSize);
    return ok(res, "I00", "OK", {
      count, page, pageSize,
      totalPages: Math.max(1, Math.ceil(count / pageSize)),
      favorites: rows
    });
  } catch (e) { next(e); }
}

/**
 * addFavorite（API-12）
 * 概要 : お気に入りに書籍を追加する。UNIQUE 違反時は W19。
 * @spec  RF-10 / MP02 / 外部仕様 v4.0a-rev3 §8.4.12
 */
async function addFavorite(req, res, next) {
  try {
    _validate(req);
    const pathUserId = _toIntId(req.params.userId);
    if (pathUserId !== req.session.userId) {
      return err(res, "W03", "他者のお気に入りには追加できません。", 403);
    }
    const bookId = _toIntId(req.body.bookId);
    const db = getDb();

    const txn = db.transaction(() => {
      const book = db.prepare("SELECT * FROM books WHERE book_id = ?").get(bookId);
      if (!book) {
        return { kind: "err", code: "W17", msg: "対象の書籍が見つかりません。", status: 404 };
      }
      const now = new Date().toISOString();
      try {
        const r = db.prepare(
          "INSERT INTO favorites(user_id, book_id, created_at) VALUES(?,?,?)"
        ).run(pathUserId, bookId, now);
        _writeAudit(db, pathUserId, "ADD_FAVORITE", "favorites", r.lastInsertRowid, { bookId });
        return { kind: "ok", favoriteId: r.lastInsertRowid, addedAt: now };
      } catch (e) {
        if (String(e.message || "").includes("UNIQUE")) {
          return { kind: "err", code: "W19", msg: "既にお気に入りに登録されています。", status: 409 };
        }
        throw e;
      }
    });

    const outcome = txn();
    if (outcome.kind === "err") return err(res, outcome.code, outcome.msg, outcome.status);
    return ok(res, "I05", "お気に入りに追加しました。", {
      favoriteId: outcome.favoriteId, bookId, addedAt: outcome.addedAt
    }, 201);
  } catch (e) { next(e); }
}

/**
 * removeFavorite（API-13）
 * 概要 : お気に入りから書籍を削除する。本人のみ。
 * @spec  RF-10 / MP02 / 外部仕様 v4.0a-rev3 §8.4.13
 */
async function removeFavorite(req, res, next) {
  try {
    const pathUserId = _toIntId(req.params.userId);
    if (pathUserId !== req.session.userId) {
      return err(res, "W03", "他者のお気に入りは削除できません。", 403);
    }
    const favoriteId = _toIntId(req.params.favoriteId);
    const db = getDb();

    const txn = db.transaction(() => {
      const row = db.prepare(
        "SELECT * FROM favorites WHERE favorite_id=? AND user_id=?"
      ).get(favoriteId, pathUserId);
      if (!row) return { kind: "err", code: "W17", msg: "対象のお気に入りが見つかりません。", status: 404 };
      db.prepare("DELETE FROM favorites WHERE favorite_id=?").run(favoriteId);
      _writeAudit(db, pathUserId, "REMOVE_FAVORITE", "favorites", favoriteId, { bookId: row.book_id });
      return { kind: "ok" };
    });

    const outcome = txn();
    if (outcome.kind === "err") return err(res, outcome.code, outcome.msg, outcome.status);
    return ok(res, "I06", "お気に入りから削除しました。", null);
  } catch (e) { next(e); }
}

/* ================ Notification Read (v3.0.6 / API-14) ================ */

/**
 * markNotificationRead（API-14）
 * 概要 : 通知を既読状態にする。本人のみ。
 * @spec  RF-09 / MP03 / 外部仕様 v4.0a-rev3 §8.4.14
 */
async function markNotificationRead(req, res, next) {
  try {
    const pathUserId = _toIntId(req.params.userId);
    if (pathUserId !== req.session.userId) {
      return err(res, "W03", "他者の通知は既読化できません。", 403);
    }
    const notificationId = _toIntId(req.params.notificationId);
    const db = getDb();
    const now = new Date().toISOString();

    const txn = db.transaction(() => {
      const row = db.prepare(
        "SELECT * FROM notifications WHERE notification_id=? AND user_id=?"
      ).get(notificationId, pathUserId);
      if (!row) return { kind: "err", code: "W17", msg: "対象の通知が見つかりません。", status: 404 };
      db.prepare("UPDATE notifications SET is_read=1, read_at=? WHERE notification_id=?")
        .run(now, notificationId);
      _writeAudit(db, pathUserId, "MARK_READ", "notifications", notificationId, null);
      return { kind: "ok" };
    });

    const outcome = txn();
    if (outcome.kind === "err") return err(res, outcome.code, outcome.msg, outcome.status);
    return ok(res, "I04", "通知を既読にしました。", {
      notificationId, isRead: true, readAt: now
    });
  } catch (e) { next(e); }
}

/* ================ Validators ================ */
const validators = {
  login: [
    body("userCode").isString().notEmpty().withMessage("利用者IDは必須です。"),
    body("userName").isString().notEmpty().withMessage("利用者名は必須です。")
  ],
  reserve: [body("bookId").isInt({ gt: 0 }).withMessage("bookIdは正整数で指定してください。")],
  search: [
    query("page").optional().isInt({ min: 0 }),
    query("pageSize").optional().isInt({ min: 1, max: 50 })
  ],
  favoriteAdd: [body("bookId").isInt({ gt: 0 }).withMessage("bookIdは正整数で指定してください。")]
};

module.exports = {
  login, logout,
  reserve, cancel,
  searchBooks, getDashboard, getMyPage, getNotifications, getBook,
  listFavorites, addFavorite, removeFavorite, markNotificationRead,
  health, validators
};
