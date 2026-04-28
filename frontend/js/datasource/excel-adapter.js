/*
 * =============================================================================
 * ファイル名 : js/datasource/excel-adapter.js
 * 概要       : ExcelAdapter（RP02 ExcelRepository 実装）。
 *              localStorage を「Excel ブリッジ対応の擬似データストア」として
 *              用い、IRepository（DataSource 契約）を実装する。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 RP02 ExcelRepository
 *   - 内部仕様書 SR04 determineBookActionState / RV02 / RV03 / LG01 / LN01
 *   - 要求仕様書 RF-07 予約登録 / RF-08 予約取消 / RF-09 通知表示 /
 *                RF-10 マイページ / RF-11 ブリッジ入出力 /
 *                RF-12 監査ログ  / RF-13 貸出データ連携
 *   - 外部仕様書 §7.2 searchBooks 形式 / §10 actionState 仕様
 *   - DB仕様書   §5 全テーブル定義（users / books / reservations /
 *                reservation_history / loans / notifications /
 *                favorites / audit_log / system_config）
 *   - DB仕様書   §6 整合性方針 / §10 トランザクション仕様
 *   - テスト仕様 TC-RES-01〜10 / TC-STA-01〜06 / TC-SRH-01〜10 /
 *                TC-SQL-05 監査ログ完全性
 *
 * IRepository 契約と同じ関数群を window.ExcelAdapter として公開する。
 * SQLiteStubAdapter と完全に同じ API 形状であり、ConfigManager.dbType の
 * 切替だけで動作モードを変えられる（CF03）。
 *
 * データキー（DB仕様§5 のテーブルに 1:1 対応）:
 *   lib-users         : users
 *   lib-books         : books
 *   lib-reservations  : reservations
 *   lib-history       : reservation_history
 *   lib-loans         : loans              （正式名。lending は旧表記）
 *   lib-notifications : notifications
 *   lib-favorites     : favorites
 *   lib-audit         : audit_log
 *   lib-sequences     : 採番カウンタ
 *
 * 設計上の重要ポイント:
 *   - 擬似排他 _withLock() で更新系の同時実行を防ぐ（DB §10 BEGIN IMMEDIATE 相当）。
 *   - actionState を画面制御用、status を表示用と完全に分離（外部仕様§10）。
 *   - 監査ログ書込は失敗しても上位処理を止めない（try/catch で握り潰す）。
 *   - シードに数値userIdが混在しているため、利用者比較は常に String 化して照合。
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

const ExcelAdapter = (() => {

  /* =====================================================================
   * 定数定義
   * ===================================================================== */

  // localStorage のキー（DB仕様§5 のテーブルに 1:1 対応）
  // Object.freeze で書き換え不可にして、取り違えバグを防止する。
  const KEY = Object.freeze({
    USERS:         "lib-users",
    BOOKS:         "lib-books",
    RESERVATIONS:  "lib-reservations",
    HISTORY:       "lib-history",
    LOANS:         "lib-loans",
    NOTIFICATIONS: "lib-notifications",
    FAVORITES:     "lib-favorites",
    AUDIT:         "lib-audit",
    SEQ:           "lib-sequences"
  });

  // 採番のプレフィックスと桁数を定数で集約（命名揺れ防止）
  const SEQ_DEF = Object.freeze({
    reservation:  { prefix: "R-", padLen: 5 },
    history:      { prefix: "H-", padLen: 5 },
    notification: { prefix: "N-", padLen: 5 },
    favorite:     { prefix: "F-", padLen: 5 },
    audit:        { prefix: "A-", padLen: 5 },
    loan:         { prefix: "L-", padLen: 5 }
  });

  // 擬似排他フラグ（DB §10 / E11 排他競合）
  // _withLock() のみが触る。直接変更しない。
  let _locked = false;

  /* =====================================================================
   * 内部ユーティリティ
   * ===================================================================== */

  /**
   * _withLock
   * 概要 : 単一更新トランザクションを擬似的に実現する。
   *        ロック取得 → fn 実行 → 必ずロック解放、を保証する。
   * 例外 : 多重ロック検出時は "E11_LOCK_BUSY" を投げる
   *        （呼び出し元で E11 メッセージに変換する）
   */
  function _withLock(fn) {
    if (_locked) throw new Error("E11_LOCK_BUSY");
    _locked = true;
    try {
      return fn();
    } finally {
      // 例外時でもロックを必ず解放する。
      _locked = false;
    }
  }

  /** _safeJSON : 例外を握り潰して JSON.parse する。不正データ防御。 */
  function _safeJSON(s) {
    try { return s ? JSON.parse(s) : null; }
    catch { return null; }
  }

  /**
   * _getAll
   * 概要 : 指定キーを取得し、未初期化なら LIBRARY_SEED_DATA から初期投入する。
   *        破損データ（配列でない）にも防御的に対処する。
   * 入力 : key（KEY.* のいずれか）
   * 出力 : 配列（必ず保証）
   */
  function _getAll(key) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = _safeJSON(raw);
      if (Array.isArray(parsed)) return parsed;
      // 破損していた場合はシードで上書きする（防御的措置）
    }
    const seed = window.LIBRARY_SEED_DATA || {};
    const seedMap = {
      [KEY.USERS]:         seed.users              || [],
      [KEY.BOOKS]:         seed.books              || [],
      [KEY.RESERVATIONS]:  seed.reservations       || [],
      [KEY.HISTORY]:       seed.reservationHistory || [],
      [KEY.LOANS]:         seed.loans              || [],
      [KEY.NOTIFICATIONS]: seed.notifications      || [],
      [KEY.FAVORITES]:     seed.favorites          || [],
      [KEY.AUDIT]:         seed.auditLog           || []
    };
    const initial = seedMap[key] || [];
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }

  /** _setAll : 配列を JSON にして保存する。 */
  function _setAll(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * _nextSeq
   * 概要 : 採番カウンタを 1 増やして prefix + ゼロ詰め文字列で返す。
   * 入力例: _nextSeq("reservation") → "R-00007"
   */
  function _nextSeq(name) {
    const def = SEQ_DEF[name];
    if (!def) throw new Error(`[ExcelAdapter] 未定義のシーケンス名: ${name}`);
    const seqs = _safeJSON(localStorage.getItem(KEY.SEQ)) || {};
    seqs[name] = (seqs[name] || 0) + 1;
    localStorage.setItem(KEY.SEQ, JSON.stringify(seqs));
    return def.prefix + String(seqs[name]).padStart(def.padLen, "0");
  }

  /** _calcPickupDeadline : 受取期限（現在 + N 日）を YYYY-MM-DD で返す。EX-02 */
  function _calcPickupDeadline() {
    const days = (window.ConfigManager && ConfigManager.get("pickupDeadlineDays")) || 7;
    return _addDays(days);
  }

  /** _addDays : 現在日 + days を YYYY-MM-DD で返す。 */
  function _addDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    return d.toISOString().slice(0, 10);
  }

  /** _err : エラー応答を生成する補助関数。 */
  function _err(code, msg) {
    return { success: false, messageCode: code, message: msg };
  }

  /* =====================================================================
   * 業務メソッド（IRepository 契約）
   * ===================================================================== */

  /**
   * findUser
   * 仕様参照 : RF-01 / AU01 / API-01
   * 入力     : userId（文字列または数値）, userName（文字列）
   * 出力     : 利用者オブジェクト or null
   * 注意     : シードに数値userIdが混在するため、常に String 比較する。
   */
  function findUser(userId, userName) {
    const users = _getAll(KEY.USERS);
    const sUid = String(userId).trim();
    const sNam = String(userName).trim();
    return users.find(u =>
      String(u.userId) === sUid &&
      String(u.userName).trim() === sNam &&
      u.enabled !== false
    ) || null;
  }

  /**
   * getActiveReservations
   * 仕様参照 : RF-03 / RV01
   * 並び順   : 受取期限の昇順、未設定は末尾
   */
  function getActiveReservations(userId) {
    const reservations = _getAll(KEY.RESERVATIONS);
    const books        = _getAll(KEY.BOOKS);
    const active = reservations.filter(r =>
      String(r.userId) === String(userId) && r.status !== "CANCELLED"
    );
    return active.map(r => {
      const book = books.find(b => String(b.bookId) === String(r.bookId)) || {};
      return Object.assign({}, r, {
        bookTitle:  book.title  || "---",
        bookAuthor: book.author || "---"
      });
    }).sort((a, b) => {
      // 期限なしを末尾に押し下げるためのソートキー
      const ka = a.pickupDeadline || "9999-99-99";
      const kb = b.pickupDeadline || "9999-99-99";
      return ka.localeCompare(kb);
    });
  }

  /** getReservationCount : 有効予約件数。 */
  function getReservationCount(userId) {
    return _getAll(KEY.RESERVATIONS)
      .filter(r => String(r.userId) === String(userId) && r.status !== "CANCELLED")
      .length;
  }

  /**
   * SR04 - _determineBookActionState
   * 概要 : 1 件の書籍の (status, actionState, actionLabel, dueDate) を判定する。
   *        外部仕様§7.2 / §10 に従い、status と actionState を分離する。
   *
   *   actionState（画面制御に使用）:
   *     "AVAILABLE" : 在庫あり、即予約可
   *     "ON_LOAN"   : 貸出中。予約は可（待機）
   *     "RESERVED"  : 予約状態（自分または他人）
   *     "DISABLED"  : 利用不可
   *
   *   status（表示専用、変更しても画面挙動は変わらない）:
   *     "在庫あり" / "貸出中" / "予約済" / "予約中" / "利用不可"
   */
  function _determineBookActionState(book, loans, reservations, viewerUserId) {
    // (1) 利用不可フラグを最優先で判定（DB §6 整合性）
    if (book.isDisabled === true || book.canReserve === false) {
      return { status: "利用不可", actionState: "DISABLED",
               actionLabel: "予約不可", dueDate: "" };
    }
    // (2) 貸出中
    const loan = loans.find(l =>
      String(l.bookId) === String(book.bookId) && l.status === "ON_LOAN"
    );
    if (loan) {
      return { status: "貸出中", actionState: "ON_LOAN",
               actionLabel: "予約する（貸出中）", dueDate: loan.dueDate || "" };
    }
    // (3) 自分が予約済み
    const selfReserved = reservations.find(r =>
      String(r.bookId) === String(book.bookId) &&
      r.status !== "CANCELLED" &&
      String(r.userId) === String(viewerUserId)
    );
    if (selfReserved) {
      return { status: "予約済", actionState: "RESERVED",
               actionLabel: "予約済（自分）", dueDate: "" };
    }
    // (4) 他人が予約済み
    const otherReserved = reservations.find(r =>
      String(r.bookId) === String(book.bookId) &&
      r.status !== "CANCELLED" &&
      String(r.userId) !== String(viewerUserId)
    );
    if (otherReserved) {
      return { status: "予約中", actionState: "RESERVED",
               actionLabel: "予約済（他利用者）", dueDate: "" };
    }
    // (5) 上記いずれも非該当 → 予約可能
    return { status: "在庫あり", actionState: "AVAILABLE",
             actionLabel: "予約する", dueDate: "" };
  }

  /**
   * searchBooks
   * 仕様参照 : SR02 / RF-05 / RF-06 / 外部仕様§7.2
   * 入力     : criteria { title, author, category, sort,
   *                       availableOnly, reservableOnly, viewerUserId }
   * 出力     : BookViewModel[]（actionState 付き、ページング前の全件）
   *
   * Service 層が本配列をページングして外部仕様§7.2 の正式形式に整形する。
   */
  function searchBooks(criteria) {
    const all          = _getAll(KEY.BOOKS);
    const loans        = _getAll(KEY.LOANS);
    const reservations = _getAll(KEY.RESERVATIONS);
    const viewer       = (criteria && criteria.viewerUserId) || "";

    // (1) actionState を付与した BookViewModel を作る（SR04）
    let books = all.map(book => {
      const state = _determineBookActionState(book, loans, reservations, viewer);
      return {
        bookId:      String(book.bookId),
        title:       book.title  || "",
        author:      book.author || "",
        category:    book.category || "",
        arrivalDate: book.arrivalDate || "",
        canReserve:  book.canReserve !== false,
        isDisabled:  book.isDisabled === true,
        // 表示用（画面制御に使わない）
        status:      state.status,
        // 制御用（actionState で activate/deactivate を決める）
        actionState: state.actionState,
        actionLabel: state.actionLabel,
        dueDate:     state.dueDate
      };
    });

    // (2) AND 条件のフィルタ（trim 済前提）
    if (criteria.title)    books = books.filter(b => b.title.includes(criteria.title));
    if (criteria.author)   books = books.filter(b => b.author.includes(criteria.author));
    if (criteria.category) books = books.filter(b => b.category === criteria.category);

    // (3) フラグ系フィルタ
    if (criteria.availableOnly)  books = books.filter(b => b.actionState === "AVAILABLE");
    if (criteria.reservableOnly) books = books.filter(b =>
      b.actionState === "AVAILABLE" || b.actionState === "ON_LOAN");

    // (4) 並び順
    const sort = criteria.sort || "bookId";
    books.sort((a, b) => {
      switch (sort) {
        case "title":           return a.title.localeCompare(b.title, "ja");
        case "author":          return a.author.localeCompare(b.author, "ja");
        case "arrivalDateDesc": return (b.arrivalDate || "").localeCompare(a.arrivalDate || "");
        default:                return a.bookId.localeCompare(b.bookId, "ja", { numeric: true });
      }
    });
    return books;
  }

  /**
   * reserveBook
   * 仕様参照 : RV03 / RF-07 / TC-RES-01〜10
   * フロー   : ロック取得 → 上限再判定 → 競合再判定 → 予約レコード作成
   *            → 履歴 → 通知 → 監査ログ → ロック解放
   * 戻り値   : ReservationResult { success, reservationId?, messageCode, message }
   * 例外     : 上限/競合 → E02、対象不在 → E10、排他 → E11
   */
  function reserveBook(userId, bookId) {
    try {
      return _withLock(() => {
        const maxRes       = (window.ConfigManager && ConfigManager.get("maxReservations")) || 3;
        const reservations = _getAll(KEY.RESERVATIONS);
        const books        = _getAll(KEY.BOOKS);
        const loans        = _getAll(KEY.LOANS);

        // (1) 上限再判定（TC-RES-04）
        const cur = reservations.filter(r =>
          String(r.userId) === String(userId) && r.status !== "CANCELLED").length;
        if (cur >= maxRes) {
          _writeAuditLog("RESERVE_DENY_LIMIT", "WARN", userId, `上限超過: max=${maxRes}`);
          return _err("E02", `予約上限（${maxRes}冊）に達しています。`);
        }

        // (2) 対象書籍の存在確認（DB §6）
        const book = books.find(b => String(b.bookId) === String(bookId));
        if (!book) {
          _writeAuditLog("RESERVE_DENY_NOTFOUND", "WARN", userId, `bookId=${bookId} 不存在`);
          return _err("E10", "指定した書籍が見つかりません。");
        }

        // (3) 競合再判定（TC-RES-06）
        const state = _determineBookActionState(book, loans, reservations, userId);
        if (state.actionState === "DISABLED") {
          return _err("E02", "この書籍は予約できません。");
        }
        // 自分自身の重複予約禁止（DB §6）
        const dup = reservations.find(r =>
          String(r.userId) === String(userId) &&
          String(r.bookId) === String(bookId) &&
          r.status !== "CANCELLED");
        if (dup) return _err("E02", "すでにこの書籍を予約済みです。");
        // 他人が予約済（貸出中ではない場合）
        if (state.actionState === "RESERVED" && state.actionLabel === "予約済（他利用者）") {
          return _err("E02", "他の利用者がすでに予約しています。");
        }

        // (4) 予約レコード追加。貸出中なら WAITING、それ以外は RESERVED。
        const reservationId = _nextSeq("reservation");
        const now = new Date().toISOString();
        const isWaiting = state.actionState === "ON_LOAN";
        const newRes = {
          reservationId,
          userId: String(userId),
          bookId: String(bookId),
          status: isWaiting ? "WAITING" : "RESERVED",
          reservedAt: now,
          pickupDeadline: isWaiting ? "" : _calcPickupDeadline(),
          cancelledAt: ""
        };
        reservations.push(newRes);
        _setAll(KEY.RESERVATIONS, reservations);

        // (5) 履歴（reservation_history）
        const history = _getAll(KEY.HISTORY);
        history.push({
          historyId: _nextSeq("history"),
          reservationId,
          userId: String(userId),
          bookId: String(bookId),
          action: "RESERVED",
          actionAt: now,
          note: isWaiting ? "貸出中のため待機予約" : "新規予約"
        });
        _setAll(KEY.HISTORY, history);

        // (6) 通知（RF-09）
        const notifications = _getAll(KEY.NOTIFICATIONS);
        notifications.push({
          notificationId: _nextSeq("notification"),
          userId: String(userId),
          severity: "SUCCESS",
          title: "予約が完了しました",
          body: `『${book.title || ""}』の予約を受け付けました。${isWaiting ? "（貸出中のため待機予約）" : ""}`,
          isRead: false,
          createdAt: now
        });
        _setAll(KEY.NOTIFICATIONS, notifications);

        // (7) 監査ログ（LG01 / RF-12）
        _writeAuditLog("RESERVE_SUCCESS", "INFO", userId,
          `予約成功: bookId=${bookId} reservationId=${reservationId}`,
          { reservationId, bookId, status: newRes.status });

        // (8) 通知画面（G05）への直前操作結果
        sessionStorage.setItem("lib-last-action", JSON.stringify({
          type: "reserve",
          bookTitle: book.title || "",
          reservationId,
          actionAt: now,
          result: "success",
          waiting: isWaiting
        }));

        return {
          success: true, reservationId, messageCode: "I01",
          message: isWaiting
            ? "貸出中のため、待機予約として受け付けました。"
            : "予約が完了しました。"
        };
      });
    } catch (e) {
      // _withLock が投げた排他競合
      if (e && e.message === "E11_LOCK_BUSY") {
        return _err("E11", "更新が混み合っています。少し待ってから再操作してください。");
      }
      _writeAuditLog("RESERVE_ERROR", "ERROR", userId, String(e && e.message));
      return _err("E10", "予約処理でシステムエラーが発生しました。");
    }
  }

  /**
   * cancelReservation
   * 仕様参照 : RV02 / RF-08 / TC-STA-03
   * 入力     : userId, reservationId
   * 出力     : ServiceResult { success, messageCode, message }
   * 例外     : 本人外/不在 → E02、排他 → E11、システム → E10
   */
  function cancelReservation(userId, reservationId) {
    try {
      return _withLock(() => {
        const reservations = _getAll(KEY.RESERVATIONS);
        const idx = reservations.findIndex(r =>
          r.reservationId === reservationId &&
          String(r.userId) === String(userId));
        if (idx === -1) {
          return _err("E02", "予約が見つかりません。または操作権限がありません。");
        }
        if (reservations[idx].status === "CANCELLED") {
          return _err("E02", "この予約はすでに取消済です。");
        }

        const now = new Date().toISOString();
        const target = reservations[idx];
        // ステータス更新
        reservations[idx] = Object.assign({}, target,
          { status: "CANCELLED", cancelledAt: now });
        _setAll(KEY.RESERVATIONS, reservations);

        // 履歴
        const history = _getAll(KEY.HISTORY);
        history.push({
          historyId: _nextSeq("history"),
          reservationId,
          userId: String(userId),
          bookId: target.bookId,
          action: "CANCELLED",
          actionAt: now,
          note: "利用者操作で取消"
        });
        _setAll(KEY.HISTORY, history);

        // 通知
        const books = _getAll(KEY.BOOKS);
        const book = books.find(b => String(b.bookId) === String(target.bookId)) || {};
        const notifications = _getAll(KEY.NOTIFICATIONS);
        notifications.push({
          notificationId: _nextSeq("notification"),
          userId: String(userId),
          severity: "WARN",
          title: "予約を取消しました",
          body: `『${book.title || ""}』の予約を取消しました。`,
          isRead: false,
          createdAt: now
        });
        _setAll(KEY.NOTIFICATIONS, notifications);

        // 監査ログ
        _writeAuditLog("CANCEL_SUCCESS", "INFO", userId,
          `予約取消: reservationId=${reservationId} bookId=${target.bookId}`,
          { reservationId, bookId: target.bookId });

        sessionStorage.setItem("lib-last-action", JSON.stringify({
          type: "cancel",
          bookTitle: book.title || "",
          reservationId,
          actionAt: now,
          result: "success"
        }));

        return { success: true, messageCode: "I02", message: "予約を取消しました。" };
      });
    } catch (e) {
      if (e && e.message === "E11_LOCK_BUSY") {
        return _err("E11", "更新が混み合っています。少し待ってから再操作してください。");
      }
      _writeAuditLog("CANCEL_ERROR", "ERROR", userId, String(e && e.message));
      return _err("E10", "取消処理でシステムエラーが発生しました。");
    }
  }

  /**
   * getMyPageData
   * 仕様参照 : MP01 / RF-10 / API-06
   * 戻り値   : { currentReservations, history, favorites, notifications, summary }
   */
  function getMyPageData(userId) {
    const currentReservations = getActiveReservations(userId);
    const history       = _getAll(KEY.HISTORY).filter(h => String(h.userId) === String(userId));
    const favorites     = _getAll(KEY.FAVORITES).filter(f => String(f.userId) === String(userId));
    const notifications = _getAll(KEY.NOTIFICATIONS).filter(n => String(n.userId) === String(userId));
    const books         = _getAll(KEY.BOOKS);

    // お気に入りに書籍情報を結合
    const favoritesWithBook = favorites.map(f => {
      const book = books.find(b => String(b.bookId) === String(f.bookId)) || {};
      return Object.assign({}, f, {
        bookTitle:    book.title    || "---",
        bookAuthor:   book.author   || "---",
        bookCategory: book.category || "---"
      });
    });

    // 履歴に書籍情報を結合し、新しい順
    const historyWithBook = history.map(h => {
      const book = books.find(b => String(b.bookId) === String(h.bookId)) || {};
      return Object.assign({}, h, { bookTitle: book.title || "---" });
    }).sort((a, b) => (b.actionAt || "").localeCompare(a.actionAt || ""));

    // 通知は未読優先 → 新しい順
    const sortedNotifs = notifications.slice().sort((a, b) => {
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });

    return {
      currentReservations,
      history: historyWithBook,
      favorites: favoritesWithBook,
      notifications: sortedNotifs,
      summary: {
        reservationCount: currentReservations.length,
        historyCount:     historyWithBook.length,
        favoritesCount:   favoritesWithBook.length,
        unreadNotifCount: sortedNotifs.filter(n => !n.isRead).length
      }
    };
  }

  /** getNotifications : 通知一覧（未読優先・新しい順）。RF-09 */
  function getNotifications(userId) {
    return _getAll(KEY.NOTIFICATIONS)
      .filter(n => String(n.userId) === String(userId))
      .sort((a, b) => {
        if (!a.isRead && b.isRead) return -1;
        if (a.isRead && !b.isRead) return 1;
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }

  /** markNotificationRead : 通知を既読化する。 */
  function markNotificationRead(userId, notificationId) {
    const notifications = _getAll(KEY.NOTIFICATIONS);
    const idx = notifications.findIndex(n =>
      n.notificationId === notificationId && String(n.userId) === String(userId));
    if (idx === -1) return false;
    notifications[idx].isRead = true;
    _setAll(KEY.NOTIFICATIONS, notifications);
    return true;
  }

  /** addFavorite : お気に入り追加。重複（DB §6 UQ）は false で返す。 */
  function addFavorite(userId, bookId) {
    const favorites = _getAll(KEY.FAVORITES);
    const exists = favorites.some(f =>
      String(f.userId) === String(userId) && String(f.bookId) === String(bookId));
    if (exists) return false;
    favorites.push({
      favoriteId: _nextSeq("favorite"),
      userId: String(userId),
      bookId: String(bookId),
      createdAt: new Date().toISOString()
    });
    _setAll(KEY.FAVORITES, favorites);
    _writeAuditLog("FAVORITE_ADD", "INFO", userId, `bookId=${bookId}`);
    return true;
  }

  /** removeFavorite : お気に入り削除。 */
  function removeFavorite(userId, bookId) {
    const favorites = _getAll(KEY.FAVORITES);
    const idx = favorites.findIndex(f =>
      String(f.userId) === String(userId) && String(f.bookId) === String(bookId));
    if (idx === -1) return false;
    favorites.splice(idx, 1);
    _setAll(KEY.FAVORITES, favorites);
    _writeAuditLog("FAVORITE_REMOVE", "INFO", userId, `bookId=${bookId}`);
    return true;
  }

  /**
   * exportAll : 全データを JSON 文字列で返す（API-08 / RF-11）。
   * 出力形状  : { dbType, exportedAt, users, books, reservations, history,
   *              loans, notifications, favorites, auditLog }
   */
  function exportAll() {
    return JSON.stringify({
      dbType:        (window.ConfigManager && ConfigManager.get("dbType")) || "Excel",
      exportedAt:    new Date().toISOString(),
      users:         _getAll(KEY.USERS),
      books:         _getAll(KEY.BOOKS),
      reservations:  _getAll(KEY.RESERVATIONS),
      history:       _getAll(KEY.HISTORY),
      loans:         _getAll(KEY.LOANS),
      notifications: _getAll(KEY.NOTIFICATIONS),
      favorites:     _getAll(KEY.FAVORITES),
      auditLog:      _getAll(KEY.AUDIT)
    }, null, 2);
  }

  /** importAll : JSON 文字列を取り込む（API-07 / RF-11）。 */
  function importAll(jsonStr) {
    try {
      const data = _safeJSON(jsonStr);
      if (!data || typeof data !== "object") {
        return _err("E10", "ブリッジファイルの形式が不正です。");
      }
      if (Array.isArray(data.users))         _setAll(KEY.USERS,         data.users);
      if (Array.isArray(data.books))         _setAll(KEY.BOOKS,         data.books);
      if (Array.isArray(data.reservations))  _setAll(KEY.RESERVATIONS,  data.reservations);
      if (Array.isArray(data.history))       _setAll(KEY.HISTORY,       data.history);
      if (Array.isArray(data.loans))         _setAll(KEY.LOANS,         data.loans);
      if (Array.isArray(data.notifications)) _setAll(KEY.NOTIFICATIONS, data.notifications);
      if (Array.isArray(data.favorites))     _setAll(KEY.FAVORITES,     data.favorites);
      if (Array.isArray(data.auditLog))      _setAll(KEY.AUDIT,         data.auditLog);
      _writeAuditLog("BRIDGE_IMPORT", "INFO", "SYSTEM", "JSON ブリッジ取込");
      return { success: true, messageCode: "I01", message: "ブリッジデータを取り込みました。" };
    } catch (_e) {
      return _err("E10", "ブリッジファイルの取込に失敗しました。");
    }
  }

  /** resetToSeed : シードに戻す（API-09 / RF-11）。 */
  function resetToSeed() {
    Object.keys(localStorage)
      .filter(k => k.startsWith("lib-"))
      .forEach(k => localStorage.removeItem(k));
    _writeAuditLog("BRIDGE_RESET", "INFO", "SYSTEM", "初期データに戻しました");
  }

  /**
   * handleLoanEvent
   * 仕様参照 : LN01 / RF-13 / API-10
   * 入力     : { eventType: "LOAN_START"|"RETURN", userId, bookId, loanId?, dueDate? }
   * 設計     : DB §6 - 予約システム側は loans を正本としない。
   *            受領したイベントを loans テーブルに反映し、監査ログを残す。
   */
  function handleLoanEvent(event) {
    if (!event || !event.eventType) {
      return _err("E10", "貸出イベントの形式が不正です。");
    }
    const loans = _getAll(KEY.LOANS);
    const now = new Date().toISOString();

    if (event.eventType === "LOAN_START") {
      loans.push({
        loanId: event.loanId || _nextSeq("loan"),
        userId: String(event.userId),
        bookId: String(event.bookId),
        loanedAt: now,
        dueDate: event.dueDate || _addDays(14),
        returnedAt: "",
        status: "ON_LOAN"
      });
      _setAll(KEY.LOANS, loans);
      _writeAuditLog("LOAN_START", "INFO", event.userId, `bookId=${event.bookId}`);
    } else if (event.eventType === "RETURN") {
      const idx = loans.findIndex(l => l.loanId === event.loanId);
      if (idx >= 0) {
        loans[idx] = Object.assign({}, loans[idx],
          { status: "RETURNED", returnedAt: now });
        _setAll(KEY.LOANS, loans);
        _writeAuditLog("LOAN_RETURN", "INFO", event.userId, `loanId=${event.loanId}`);
      }
    } else {
      return _err("E10", "未知の貸出イベント種別です。");
    }
    return { success: true, messageCode: "I01", message: "貸出イベントを受け付けました。" };
  }

  /**
   * LG01 - _writeAuditLog
   * 仕様参照 : RF-12 / TC-SQL-05 監査ログ完全性
   * 注意     : 監査ログ書込が失敗しても上位処理を止めない（DB §10 設計方針）。
   *
   * 引数（IRepository 契約）:
   *   eventType : 監査イベント名（"LOGIN_SUCCESS" 等）
   *   level     : "INFO"|"WARN"|"ERROR"
   *   userId    : 操作者 ID（不明時は "SYSTEM"）
   *   message   : 概要メッセージ
   *   detail    : 任意の追加情報（JSON シリアライズして格納）
   */
  function _writeAuditLog(eventType, level, userId, message, detail) {
    try {
      const audit = _getAll(KEY.AUDIT);
      audit.push({
        auditId:    _nextSeq("audit"),
        eventType:  eventType || "UNKNOWN",
        level:      level || "INFO",
        userId:     userId ? String(userId) : "SYSTEM",
        message:    message || "",
        detailJson: detail ? JSON.stringify(detail) : "",
        browser:    (navigator && navigator.userAgent) ? navigator.userAgent.slice(0, 100) : "",
        createdAt:  new Date().toISOString()
      });
      _setAll(KEY.AUDIT, audit);
    } catch (_e) {
      /* 監査ログ失敗は無視（DB §10）。呼出元処理を中断しないことが優先。 */
    }
  }

  /* =====================================================================
   * 公開 API（IRepository 契約。SQLiteStubAdapter と完全に同形状）
   * ===================================================================== */
  return {
    // 認証 / 利用者
    findUser,
    // 予約状況
    getActiveReservations,
    getReservationCount,
    // 検索
    searchBooks,
    // 予約・取消
    reserveBook,
    cancelReservation,
    // マイページ / 通知 / お気に入り
    getMyPageData,
    getNotifications,
    markNotificationRead,
    addFavorite,
    removeFavorite,
    // ブリッジ
    exportAll,
    importAll,
    resetToSeed,
    // 貸出連携
    handleLoanEvent,
    // 監査ログ（IRepository 契約名は writeAuditLog）
    writeAuditLog: _writeAuditLog
  };
})();

// 後続スクリプトから参照できるよう window に公開する。
window.ExcelAdapter = ExcelAdapter;
