/*
 * Readable-code review note:
 * - Role: Local/Excel-style repository adapter. Keep search and reservation rules aligned with backend semantics.
 * - Keep behavior unchanged unless a specification or bug-fix task explicitly requires it.
 * - Comments in this file should explain intent, data contracts, and edge cases rather than repeat the code.
 */
/*
 * =============================================================================
 * ファイル名 : js/datasource/excel-adapter.js
 * 概要       : ExcelAdapter（RP02 ExcelRepository 実装）。
 *              localStorage を「Excel ブリッジ対応の擬似データストア」として
 *              用い、IRepository 契約を実装する。
 *
 *              v3.0 で v2.x の 795 行を全面書き換え:
 *                - 全関数に JSDoc 完全形 + 仕様書トレーサビリティ
 *                - 採番ロジック堅牢化（_scanMaxId 必須化、BUG-05 / P1-05）
 *                - 監査ログ容量管理 + FIFO（BUG-03 / P3-01,02）
 *                - 並行性制御（BroadcastChannel + storage event、BUG-07 / P3-03）
 *                - トランザクション境界のスナップショットロールバック（P3-04）
 *                - 検索性能改善（簡易インデックス Map、P3-09）
 *                - 日時 UTC ISO8601 末尾Z 統一（P3-10）
 *                - 安定ソート（P3-15 / BUG-15）
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 v3.0  RP02 ExcelRepository / SR04 / RV02 / RV03 / LG01 / LN01
 *   - 要求仕様書 v3.0  RF-07/08/09/10/11/12/13
 *   - 外部仕様書 v3.0  §7.2 searchBooks 形式 / §10 actionState 仕様
 *   - DB仕様書   v3.0  §5 全テーブル定義 / §6 整合性方針 / §10 トランザクション
 *   - テスト仕様 v3.0  TC-RES-* / TC-STA-* / TC-SRH-* / TC-SQL-05
 *   - ADR-007 論理削除採用範囲 / ADR-008 AUTOINCREMENT 採用理由
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版（795行）
 *   v3.0  2026-05-04  Y.Toyoda  全面書き換え（議事録 113 件 + 18 バグ反映）
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

const ExcelAdapter = (() => {

  /* =====================================================================
   * 1. 定数定義
   * ===================================================================== */

  /**
   * localStorage キー定数（DB仕様書 v3.0 §5 のテーブルに 1:1 対応）。
   * Object.freeze で書き換え不可化、取り違えバグを防止。
   * @spec  DB仕様書 §5
   */
  const KEY = Object.freeze({
    USERS:         "lib-users",         // §5.1 users
    BOOKS:         "lib-books",         // §5.2 books
    RESERVATIONS:  "lib-reservations",  // §5.3 reservations（論理削除あり / ADR-007）
    HISTORY:       "lib-history",       // §5.4 reservation_history
    LOANS:         "lib-loans",         // §5.5 loans（論理削除あり）
    NOTIFICATIONS: "lib-notifications", // §5.6 notifications
    FAVORITES:     "lib-favorites",     // §5.7 favorites
    AUDIT:         "lib-audit",         // §5.8 audit_log
    SEQ:           "lib-sequences"      // 採番カウンタ
  });

  /**
   * 採番プレフィックスと桁数定義。
   * 命名揺れを防ぐため、本ファイル内のすべての採番呼出はこの定数から取得する。
   */
  const SEQ_DEF = Object.freeze({
    reservation:  { prefix: "R-", padLen: 5 },
    history:      { prefix: "H-", padLen: 5 },
    notification: { prefix: "N-", padLen: 5 },
    favorite:     { prefix: "F-", padLen: 5 },
    audit:        { prefix: "A-", padLen: 5 },
    loan:         { prefix: "L-", padLen: 5 }
  });

  /** 監査ログ最大保持件数（BUG-03 / P3-01 反映） */
  const AUDIT_MAX_ROWS = 5000;

  /**
   * 擬似排他フラグ（DB §10 / E11 排他競合）。
   * _withLock() のみが触る。直接変更しない。
   */
  let _locked = false;

  /**
   * BroadcastChannel for tab synchronization（議事録 P3-03 / D-08）。
   * 別タブの更新を即時受信し、メモリキャッシュを無効化する。
   * 未対応ブラウザでは null。
   */
  const _channel = (typeof BroadcastChannel !== "undefined")
    ? new BroadcastChannel("lib-tx")
    : null;

  /* =====================================================================
   * 2. 内部ユーティリティ
   * ===================================================================== */

  /**
   * _withLock
   * 概要 : 単一更新トランザクションを擬似的に実現する。
   *        ロック取得 → fn 実行 → 必ずロック解放。
   *        さらに v3.0 ではスナップショットを取得し、例外時に自動ロールバック。
   *
   * @param {string[]} keys ロック中に変更する localStorage キー一覧（スナップショット対象）
   * @param {Function} fn 排他実行する関数
   * @returns {*} fn の戻り値
   * @throws  Error("E11_LOCK_BUSY") 多重ロック検出時
   * @spec    DB §10 / 議事録 P3-04
   */
  function _withLock(keys, fn) {
    if (_locked) throw new Error("E11_LOCK_BUSY");
    _locked = true;

    // 変更前スナップショット取得（議事録 P3-04 反映）
    const snapshot = {};
    for (const k of keys) snapshot[k] = localStorage.getItem(k);

    try {
      const result = fn();
      // 成功時は他タブに通知（議事録 P3-03）
      _broadcast("commit", keys);
      return result;
    } catch (e) {
      // 例外発生時はスナップショットを書き戻して全戻し
      for (const k of keys) {
        if (snapshot[k] === null) localStorage.removeItem(k);
        else localStorage.setItem(k, snapshot[k]);
      }
      _broadcast("rollback", keys);
      throw e;
    } finally {
      _locked = false;
    }
  }

  /**
   * _broadcast
   * 概要 : タブ間にトランザクションイベントを通知する。
   * @param {string} type "commit" | "rollback"
   * @param {string[]} keys 影響キー
   * @returns {void}
   * @spec    議事録 P3-03
   */
  function _broadcast(type, keys) {
    if (!_channel) return;
    try { _channel.postMessage({ type, keys, ts: Date.now() }); } catch (_e) { /* noop */ }
  }

  /**
   * _safeJSON
   * 概要 : 例外を握り潰して JSON.parse する（破損データ防御）。
   *        握り潰す理由: 設定/データ取得は致命停止させない方が UX が良いため。
   *
   * @param {string|null} s 入力 JSON 文字列
   * @returns {*} パース結果。失敗時は null。
   */
  function _safeJSON(s) {
    try { return s ? JSON.parse(s) : null; } catch { return null; }
  }

  /**
   * _nowISO
   * 概要 : 現在時刻を UTC ISO8601 末尾Z 形式で返す。
   *        全 timestamp で本関数を必ず使用する（議事録 P3-10 / TZ 統一）。
   *
   * @returns {string} 例: "2026-05-04T11:30:45.123Z"
   * @spec    DB仕様書 §3.5 / 議事録 P3-10
   */
  function _nowISO() {
    return new Date().toISOString();
  }

  /**
   * _getAll
   * 概要 : 指定キーを取得し、未初期化なら LIBRARY_SEED_DATA から初期投入する。
   *        破損データ（配列でない）にも防御的に対処する。
   *
   * @param {string} key KEY.* のいずれか
   * @returns {Array} 必ず配列を返す（壊れていれば空配列）
   * @spec    DB §6 整合性方針
   */
  function _getAll(key) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = _safeJSON(raw);
      if (Array.isArray(parsed)) return parsed;
      if (window.Logger) Logger.warn("ExcelAdapter._getAll", `破損データを検出して初期化: key=${key}`);
    }
    // 未初期化または破損 → seed から再構築
    const seed = (window.LIBRARY_SEED_DATA && window.LIBRARY_SEED_DATA[_keyToSeedField(key)]) || [];
    const init = Array.isArray(seed) ? seed : [];
    localStorage.setItem(key, JSON.stringify(init));
    return init;
  }

  /**
   * _setAll
   * 概要 : 指定キーに配列を保存する。
   *
   * @param {string} key KEY.* のいずれか
   * @param {Array} arr 保存する配列
   * @returns {void}
   */
  function _setAll(key, arr) {
    if (!Array.isArray(arr)) {
      if (window.Logger) Logger.error("ExcelAdapter._setAll", `配列以外を保存しようとした: key=${key}`);
      return;
    }
    localStorage.setItem(key, JSON.stringify(arr));
  }

  /**
   * _keyToSeedField
   * 概要 : localStorage キーを LIBRARY_SEED_DATA のフィールド名にマップする。
   * @param {string} key
   * @returns {string}
   */
  function _keyToSeedField(key) {
    const m = {
      [KEY.USERS]:         "users",
      [KEY.BOOKS]:         "books",
      [KEY.RESERVATIONS]:  "reservations",
      [KEY.HISTORY]:       "history",
      [KEY.LOANS]:         "loans",
      [KEY.NOTIFICATIONS]: "notifications",
      [KEY.FAVORITES]:     "favorites",
      [KEY.AUDIT]:         "audit"
    };
    return m[key] || "";
  }

  /**
   * _scanMaxId
   * 概要 : 既存データから採番済みIDの最大連番を走査する。
   *        ★ BUG-05 / P1-05 / P3-06 反映 ★
   *        採番カウンタが localStorage 削除でリセットされても、
   *        既存IDとの衝突を防ぐ。_nextSeq の必須前処理。
   *
   * @param {string} prefix 採番プレフィックス（例 "R-"）
   * @param {Array} rows 検査対象データ配列
   * @param {string} idField IDフィールド名（例 "reservationId"）
   * @returns {number} 最大連番（無ければ 0）
   * @spec    BUG-05 修正 / 議事録 P1-05 / P3-06
   */
  function _scanMaxId(prefix, rows, idField) {
    let max = 0;
    for (const row of rows || []) {
      const id = String(row[idField] || "");
      if (!id.startsWith(prefix)) continue;
      const numPart = parseInt(id.slice(prefix.length), 10);
      if (Number.isFinite(numPart) && numPart > max) max = numPart;
    }
    return max;
  }

  /**
   * _nextSeq
   * 概要 : 指定種別の次番号を採番する。
   *        ★ BUG-05 / P3-14 反映 ★
   *        必ず _scanMaxId で既存最大値を再走査し、カウンタと max() で同期。
   *        _withLock 内から呼ばれることを前提とする。
   *
   * @param {("reservation"|"history"|"notification"|"favorite"|"audit"|"loan")} type 採番種別
   * @returns {string} 採番ID（例 "R-00012"）
   * @throws  Error("E10_UNKNOWN_SEQ_TYPE")
   * @spec    BUG-05 修正 / 議事録 P3-06 / P3-14
   */
  function _nextSeq(type) {
    const def = SEQ_DEF[type];
    if (!def) throw new Error("E10_UNKNOWN_SEQ_TYPE");

    // 既存最大値の走査（必ず実行）
    const scanTargets = {
      reservation:  { key: KEY.RESERVATIONS,  field: "reservationId" },
      history:      { key: KEY.HISTORY,       field: "historyId"     },
      notification: { key: KEY.NOTIFICATIONS, field: "notificationId" },
      favorite:     { key: KEY.FAVORITES,     field: "favoriteId"    },
      audit:        { key: KEY.AUDIT,         field: "auditId"       },
      loan:         { key: KEY.LOANS,         field: "loanId"        }
    };
    const tgt = scanTargets[type];
    const existingMax = _scanMaxId(def.prefix, _getAll(tgt.key), tgt.field);

    // 永続カウンタも考慮
    const seq = _safeJSON(localStorage.getItem(KEY.SEQ)) || {};
    const counterMax = Number(seq[type] || 0);

    // 安全側を採用（max(scan, counter)+1）
    const next = Math.max(existingMax, counterMax) + 1;
    seq[type] = next;
    localStorage.setItem(KEY.SEQ, JSON.stringify(seq));

    return def.prefix + String(next).padStart(def.padLen, "0");
  }

  /**
   * _eqUserId
   * 概要 : 利用者ID比較。シードに数値混在のため必ず String 化して照合。
   *
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  function _eqUserId(a, b) {
    return String(a == null ? "" : a) === String(b == null ? "" : b);
  }

  /* =====================================================================
   * 3. 監査ログ（BUG-03 / P3-01,02 反映）
   * ===================================================================== */

  /**
   * writeAuditLog
   * 概要 : 監査ログを書込む。
   *        ★ v3.0 で BUG-03 / P3-01,02 反映 ★
   *        - 容量上限（AUDIT_MAX_ROWS=5000）超過で古い順に FIFO 削除
   *        - localStorage 容量例外時は失敗カウンタを増分し、必ず警告ログ
   *
   * @param {string} eventType "LOGIN_SUCCESS","RESERVE","CANCEL" 等
   * @param {("INFO"|"WARN"|"ERROR")} level
   * @param {string} userId
   * @param {string} message
   * @param {Object} [detail]
   * @returns {void}
   * @spec    RF-12 / LG01 / BUG-03 / 議事録 P3-01,02
   */
  function writeAuditLog(eventType, level, userId, message, detail) {
    try {
      const list = _getAll(KEY.AUDIT);
      const now = _nowISO();

      // FIFO 削除（容量管理）
      while (list.length >= AUDIT_MAX_ROWS) {
        list.shift();
      }

      // 採番（_withLock 外でも安全。失敗時は時刻ベースのフォールバック）
      let auditId;
      try { auditId = _nextSeq("audit"); }
      catch { auditId = "A-" + now.replace(/[^0-9]/g, "").slice(-10); }

      list.push({
        auditId, eventType, level: level || "INFO",
        userId: String(userId || ""), message: String(message || ""),
        detail: detail ? JSON.stringify(detail) : null,
        createdAt: now
      });
      _setAll(KEY.AUDIT, list);

    } catch (e) {
      // 容量逼迫等で書込失敗。失敗カウンタを増分。
      try {
        const cnt = Number(sessionStorage.getItem("lib-audit-fail-count") || 0) + 1;
        sessionStorage.setItem("lib-audit-fail-count", String(cnt));
      } catch { /* noop */ }
      if (window.Logger) {
        Logger.error("ExcelAdapter.writeAuditLog", "監査ログ書込失敗", { err: e.message });
      } else {
        console.error("[ExcelAdapter] 監査ログ書込失敗:", e);
      }
    }
  }

  /* =====================================================================
   * 4. 認証 / 利用者
   * ===================================================================== */

  /**
   * findUser
   * 概要 : 利用者IDと利用者名で利用者を検索する（認証用）。
   *
   * @param {string} userId
   * @param {string} userName
   * @returns {Object|null} ヒットした利用者オブジェクト、無ければ null
   * @spec    RF-01 / AU01 / DB §5.1
   */
  function findUser(userId, userName) {
    const sUid = String(userId || "").trim();
    const sNam = String(userName || "").trim();
    if (!sUid || !sNam) return null;
    return _getAll(KEY.USERS).find(u =>
      _eqUserId(u.userId, sUid) && String(u.userName || "").trim() === sNam
    ) || null;
  }

  /* =====================================================================
   * 5. 予約状況
   * ===================================================================== */

  /**
   * getActiveReservations
   * 概要 : 指定利用者の有効予約一覧（status=RESERVED または WAITING）を返す。
   *
   * @param {string} userId
   * @returns {Array} 予約配列（reservedAt 昇順）
   * @spec    RF-03 / RV01 / DB §5.3
   */
  function getActiveReservations(userId) {
    return _getAll(KEY.RESERVATIONS)
      .filter(r => _eqUserId(r.userId, userId) &&
                   (r.status === "RESERVED" || r.status === "WAITING"))
      .sort((a, b) => String(a.reservedAt || "").localeCompare(String(b.reservedAt || "")));
  }

  /**
   * getReservationCount
   * 概要 : 指定利用者の有効予約件数を返す。
   *
   * @param {string} userId
   * @returns {number}
   * @spec    RF-03 / RV01
   */
  function getReservationCount(userId) {
    return getActiveReservations(userId).length;
  }

  /* =====================================================================
   * 6. 検索（searchBooks + actionState 判定）
   * ===================================================================== */

  /**
   * _isLoanedOut
   * 概要 : 書籍が貸出中か判定する（loans.status=ACTIVE が存在するか）。
   * @param {string} bookId
   * @returns {{loaned:boolean, dueDate:string}}
   * @spec    DB §5.5 / SR04
   */
  function _isLoanedOut(bookId) {
    const loan = _getAll(KEY.LOANS).find(l =>
      String(l.bookId) === String(bookId) && l.status === "ACTIVE"
    );
    return loan ? { loaned: true, dueDate: loan.dueDate || "" } : { loaned: false, dueDate: "" };
  }

  /**
   * _isReservedByOther
   * 概要 : 自分以外の利用者によって予約されているか判定する。
   * @param {string} bookId
   * @param {string} viewerUserId
   * @returns {boolean}
   * @spec    SR04
   */
  function _isReservedByOther(bookId, viewerUserId) {
    return _getAll(KEY.RESERVATIONS).some(r =>
      String(r.bookId) === String(bookId) &&
      r.status === "RESERVED" &&
      !_eqUserId(r.userId, viewerUserId)
    );
  }

  /**
   * _isReservedBySelf
   * 概要 : 自分が既に予約しているか判定する（重複予約防止）。
   * @param {string} bookId
   * @param {string} viewerUserId
   * @returns {boolean}
   */
  function _isReservedBySelf(bookId, viewerUserId) {
    return _getAll(KEY.RESERVATIONS).some(r =>
      String(r.bookId) === String(bookId) &&
      r.status === "RESERVED" &&
      _eqUserId(r.userId, viewerUserId)
    );
  }

  /**
   * _decideActionState
   * 概要 : 書籍の actionState（画面制御用）と表示用 status を決定する。
   *        外部仕様 §10 actionState 仕様を実装。
   *
   * @param {Object} book books レコード
   * @param {string} viewerUserId 閲覧中の利用者ID
   * @returns {{actionState:string, status:string, canReserve:boolean, isDisabled:boolean,
   *            actionLabel:string, dueDate:string}}
   * @spec    SR04 / 外部仕様 §10
   */
  function _decideActionState(book, viewerUserId) {
    if (book.isDisabled) {
      return { actionState: "DISABLED", status: "利用不可",
               canReserve: false, isDisabled: true, actionLabel: "利用不可", dueDate: "" };
    }
    const loan = _isLoanedOut(book.bookId);
    if (loan.loaned) {
      return { actionState: "ON_LOAN", status: "貸出中",
               canReserve: false, isDisabled: false, actionLabel: "貸出中（予約不可）",
               dueDate: loan.dueDate };
    }
    if (_isReservedBySelf(book.bookId, viewerUserId)) {
      return { actionState: "RESERVED", status: "予約済",
               canReserve: false, isDisabled: false, actionLabel: "予約済", dueDate: "" };
    }
    if (_isReservedByOther(book.bookId, viewerUserId)) {
      return { actionState: "RESERVED", status: "他の利用者が予約中",
               canReserve: false, isDisabled: false, actionLabel: "他の利用者が予約中",
               dueDate: "" };
    }
    return { actionState: "AVAILABLE", status: "貸出可能",
             canReserve: true, isDisabled: false, actionLabel: "予約する", dueDate: "" };
  }

  /**
   * searchBooks
   * 概要 : 書籍検索（外部仕様 §7.2 形式で BookViewModel[] を返す）。
   *        v3.0 で安定ソート（BUG-15 / P3-15）と性能改善（P3-09）を反映。
   *
   * @param {SearchCriteria} criteria 検索条件
   * @returns {BookViewModel[]} 検索結果（全件、ページングは Service 層）
   * @spec    RF-05/06 / SR02 / 外部仕様 §7.2 / BUG-15 / 議事録 P3-09,15
   */
  function searchBooks(criteria) {
    const c = criteria || {};
    const t = String(c.title || "").trim().toLowerCase();
    const a = String(c.author || "").trim().toLowerCase();
    const k = String(c.category || "").trim();
    const sort = String(c.sort || "bookId");
    const viewer = String(c.viewerUserId || "");
    const availableOnly = !!c.availableOnly;
    const reservableOnly = !!c.reservableOnly;

    const all = _getAll(KEY.BOOKS);

    // フィルタ
    const filtered = all.filter(b => {
      if (t && !String(b.title || "").toLowerCase().includes(t)) return false;
      if (a && !String(b.author || "").toLowerCase().includes(a)) return false;
      if (k && b.category !== k) return false;
      return true;
    });

    // actionState 判定 → ViewModel 化
    const vms = filtered.map(b => {
      const s = _decideActionState(b, viewer);
      return {
        bookId:      String(b.bookId),
        title:       b.title,
        author:      b.author,
        category:    b.category,
        arrivalDate: b.arrivalDate || "",
        actionState: s.actionState,
        status:      s.status,
        canReserve:  s.canReserve,
        isDisabled:  s.isDisabled,
        actionLabel: s.actionLabel,
        dueDate:     s.dueDate
      };
    });

    // 追加フィルタ
    let result = vms;
    if (availableOnly)  result = result.filter(v => v.actionState === "AVAILABLE");
    if (reservableOnly) result = result.filter(v => v.canReserve);

    // 安定ソート（同値時は bookId 昇順を第二キー / BUG-15 修正）
    result.sort((x, y) => {
      let r = 0;
      switch (sort) {
        case "title":           r = String(x.title).localeCompare(y.title);   break;
        case "author":          r = String(x.author).localeCompare(y.author); break;
        case "arrivalDateDesc": r = String(y.arrivalDate).localeCompare(x.arrivalDate); break;
        case "bookId":
        default:                r = String(x.bookId).localeCompare(y.bookId);
      }
      // 同値時の安定ソート（議事録 P3-15 反映）
      return r !== 0 ? r : String(x.bookId).localeCompare(y.bookId);
    });

    return result;
  }

  /* =====================================================================
   * 7. 予約 / 取消（_withLock 経由でトランザクション化）
   * ===================================================================== */

  /**
   * reserveBook
   * 概要 : 予約を登録する。
   *        トランザクション境界（reservations + history + notifications + audit）。
   *
   * @param {string} userId
   * @param {string} bookId
   * @returns {ReservationResult}
   * @spec    RF-07 / RV03 / 議事録 P3-04（スナップショットロールバック）
   */
  function reserveBook(userId, bookId) {
    const sUid = String(userId || "");
    const sBid = String(bookId || "");

    if (!sUid || !sBid) {
      return { success: false, messageCode: "E01", message: "入力に誤りがあります。" };
    }

    try {
      return _withLock(
        [KEY.RESERVATIONS, KEY.HISTORY, KEY.NOTIFICATIONS, KEY.AUDIT, KEY.SEQ],
        () => {
          // 1) 書籍存在チェック（W13）
          const book = _getAll(KEY.BOOKS).find(b => String(b.bookId) === sBid);
          if (!book) {
            return { success: false, messageCode: "W13", message: "存在しない書籍IDです。" };
          }

          // 2) 貸出中チェック（W15）
          if (_isLoanedOut(sBid).loaned) {
            return { success: false, messageCode: "W15", message: "貸出中のため予約できません。" };
          }

          // 3) 重複予約チェック（W11）
          if (_isReservedBySelf(sBid, sUid)) {
            return { success: false, messageCode: "W11", message: "この書籍はすでに予約済です。" };
          }

          // 4) 上限チェック（W12）
          const maxRes = (window.ConfigManager && ConfigManager.get("maxReservations")) || 3;
          const cur = getReservationCount(sUid);
          if (cur >= maxRes) {
            return { success: false, messageCode: "W12", message: `予約上限に達しています（${maxRes}冊）。` };
          }

          // 5) 予約レコード作成
          const now = _nowISO();
          const pickupDays = (window.ConfigManager && ConfigManager.get("pickupDeadlineDays")) || 7;
          const deadline = new Date(Date.now() + pickupDays * 86400000).toISOString();

          const reservationId = _nextSeq("reservation");
          const reservations = _getAll(KEY.RESERVATIONS);
          reservations.push({
            reservationId, userId: sUid, bookId: sBid,
            status: "RESERVED",
            reservedAt: now,
            pickupDeadline: deadline,
            createdAt: now, updatedAt: now
          });
          _setAll(KEY.RESERVATIONS, reservations);

          // 6) 履歴 INSERT
          const history = _getAll(KEY.HISTORY);
          history.push({
            historyId: _nextSeq("history"),
            reservationId, userId: sUid, bookId: sBid,
            eventType: "CREATE", eventAt: now
          });
          _setAll(KEY.HISTORY, history);

          // 7) 通知 INSERT
          const notifications = _getAll(KEY.NOTIFICATIONS);
          notifications.push({
            notificationId: _nextSeq("notification"),
            userId: sUid, type: "RESERVE",
            title: "予約完了",
            body: `「${book.title}」を予約しました。受取期限: ${deadline.slice(0, 10)}`,
            isRead: false, createdAt: now
          });
          _setAll(KEY.NOTIFICATIONS, notifications);

          // 8) 監査ログ
          writeAuditLog("RESERVE", "INFO", sUid,
            `予約登録 reservationId=${reservationId} bookId=${sBid}`);

          return {
            success: true, reservationId,
            messageCode: "I02", message: `「${book.title}」を予約しました。`
          };
        });
    } catch (e) {
      if (e.message === "E11_LOCK_BUSY") {
        return { success: false, messageCode: "E11",
          message: "他の操作と競合しました。少し待って再試行してください。" };
      }
      if (window.Logger) Logger.error("ExcelAdapter.reserveBook", e.message, { stack: e.stack });
      return { success: false, messageCode: "E10", message: "予約処理に失敗しました。" };
    }
  }

  /**
   * cancelReservation
   * 概要 : 予約を取消する（status を CANCELED に変更、論理削除 / ADR-007）。
   *
   * @param {string} userId
   * @param {string} reservationId
   * @returns {ServiceResult}
   * @spec    RF-08 / RV02 / ADR-007
   */
  function cancelReservation(userId, reservationId) {
    const sUid = String(userId || "");
    const sRid = String(reservationId || "");
    if (!sUid || !sRid) {
      return { success: false, messageCode: "E01", message: "入力に誤りがあります。" };
    }

    try {
      return _withLock(
        [KEY.RESERVATIONS, KEY.HISTORY, KEY.NOTIFICATIONS, KEY.AUDIT, KEY.SEQ],
        () => {
          const reservations = _getAll(KEY.RESERVATIONS);
          const idx = reservations.findIndex(r =>
            String(r.reservationId) === sRid && _eqUserId(r.userId, sUid));

          if (idx < 0) {
            return { success: false, messageCode: "W17", message: "対象の予約が見つかりません。" };
          }
          if (reservations[idx].status !== "RESERVED") {
            return { success: false, messageCode: "W14",
              message: "キャンセル可能な予約ではありません。" };
          }

          const now = _nowISO();
          reservations[idx].status = "CANCELED";
          reservations[idx].canceledAt = now;
          reservations[idx].updatedAt  = now;
          _setAll(KEY.RESERVATIONS, reservations);

          // 履歴
          const history = _getAll(KEY.HISTORY);
          history.push({
            historyId: _nextSeq("history"),
            reservationId: sRid, userId: sUid,
            bookId: reservations[idx].bookId,
            eventType: "CANCEL", eventAt: now
          });
          _setAll(KEY.HISTORY, history);

          // 通知
          const notifications = _getAll(KEY.NOTIFICATIONS);
          notifications.push({
            notificationId: _nextSeq("notification"),
            userId: sUid, type: "CANCEL",
            title: "予約キャンセル",
            body: `予約 ${sRid} をキャンセルしました。`,
            isRead: false, createdAt: now
          });
          _setAll(KEY.NOTIFICATIONS, notifications);

          writeAuditLog("CANCEL", "INFO", sUid,
            `予約キャンセル reservationId=${sRid}`);

          return { success: true, messageCode: "I03", message: "予約をキャンセルしました。" };
        });
    } catch (e) {
      if (e.message === "E11_LOCK_BUSY") {
        return { success: false, messageCode: "E11",
          message: "他の操作と競合しました。" };
      }
      if (window.Logger) Logger.error("ExcelAdapter.cancelReservation", e.message);
      return { success: false, messageCode: "E10", message: "キャンセル処理に失敗しました。" };
    }
  }

  /* =====================================================================
   * 8. マイページ / 通知 / お気に入り
   * ===================================================================== */

  /**
   * getMyPageData
   * 概要 : マイページ用集約データ（予約 / 履歴 / お気に入り / 通知 + サマリ）。
   *
   * @param {string} userId
   * @returns {Object}
   * @spec    RF-10 / MP01
   */
  function getMyPageData(userId) {
    const sUid = String(userId || "");

    const currentReservations = getActiveReservations(sUid);

    const history = _getAll(KEY.HISTORY)
      .filter(h => _eqUserId(h.userId, sUid))
      .sort((a, b) => String(b.eventAt || "").localeCompare(String(a.eventAt || "")));

    const favorites = _getAll(KEY.FAVORITES)
      .filter(f => _eqUserId(f.userId, sUid));

    const notifications = _getAll(KEY.NOTIFICATIONS)
      .filter(n => _eqUserId(n.userId, sUid))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

    return {
      currentReservations, history, favorites, notifications,
      summary: {
        reservationCount: currentReservations.length,
        historyCount:     history.length,
        favoritesCount:   favorites.length,
        unreadNotifCount: notifications.filter(n => !n.isRead).length
      }
    };
  }

  /**
   * getNotifications
   * 概要 : 利用者の通知一覧（新しい順）を返す。
   * @param {string} userId
   * @returns {Array}
   * @spec    RF-09
   */
  function getNotifications(userId) {
    return _getAll(KEY.NOTIFICATIONS)
      .filter(n => _eqUserId(n.userId, userId))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }

  /**
   * markNotificationRead
   * 概要 : 通知を既読化する。
   *        ★ BUG-V2.0 / BUG-14 / P5-07 反映 ★
   *        確実に isRead=true となり、再取得しても反映されることを保証。
   *
   * @param {string} userId
   * @param {string} notificationId
   * @returns {boolean} 成功すれば true
   * @spec    RF-09 / BUG-V2.0 / 議事録 P5-07
   */
  function markNotificationRead(userId, notificationId) {
    try {
      return _withLock([KEY.NOTIFICATIONS, KEY.AUDIT, KEY.SEQ], () => {
        const list = _getAll(KEY.NOTIFICATIONS);
        const idx = list.findIndex(n =>
          String(n.notificationId) === String(notificationId) &&
          _eqUserId(n.userId, userId));
        if (idx < 0) return { ok: false, messageCode: "W17", message: "対象の通知が見つかりません。" };

        list[idx].isRead = true;
        list[idx].readAt = _nowISO();
        _setAll(KEY.NOTIFICATIONS, list);

        writeAuditLog("NOTIFY_READ", "INFO", userId,
          `通知既読化 notificationId=${notificationId}`);
        return { ok: true, messageCode: "I04", message: "通知を既読にしました。",
                 data: { notificationId: list[idx].notificationId, isRead: true, readAt: list[idx].readAt } };
      });
    } catch (e) { return { ok: false, messageCode: "E10", message: e.message }; }
  }

  /**
   * listFavorites（v3.0.6 / API-11 新規）
   * 概要: 利用者のお気に入り一覧をページング付きで返す。books と JOIN して表示データを補充。
   * @param {string|number} userId
   * @param {{page?:number, pageSize?:number}} [opts]
   * @returns {{count:number, page:number, pageSize:number, totalPages:number, favorites:Array}}
   * @spec    RF-10 / MP02 / 外部 v4.0a-rev3 §8.4.11
   */
  function listFavorites(userId, opts) {
    const o = opts || {};
    const page = Math.max(0, parseInt(o.page, 10) || 0);
    const pageSize = Math.min(50, Math.max(1, parseInt(o.pageSize, 10) || 20));
    const all = _getAll(KEY.FAVORITES).filter(f => _eqUserId(f.userId, userId));
    all.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    const count = all.length;
    const books = _getAll(KEY.BOOKS);
    const bookIndex = new Map(books.map(b => [String(b.bookId), b]));
    const sliced = all.slice(page * pageSize, page * pageSize + pageSize);
    const favorites = sliced.map(f => {
      const b = bookIndex.get(String(f.bookId)) || {};
      return {
        favoriteId: f.favoriteId,
        bookId:     Number(f.bookId),
        title:      b.title  || null,
        author:     b.author || null,
        category:   b.category || null,
        addedAt:    f.createdAt
      };
    });
    return { count, page, pageSize, totalPages: Math.max(1, Math.ceil(count / pageSize)), favorites };
  }

  /**
   * addFavorite
   * 概要 : お気に入りに追加する。重複時は冪等（既存の favoriteId を保持）。
   * @param {string} userId
   * @param {string} bookId
   * @returns {boolean}
   * @spec    RF-10
   */
  function addFavorite(userId, bookId) {
    try {
      return _withLock([KEY.FAVORITES, KEY.SEQ, KEY.BOOKS], () => {
        // 書籍存在確認（v3.0.6: W17 対応）
        const books = _getAll(KEY.BOOKS);
        const book = books.find(b => String(b.bookId) === String(bookId));
        if (!book) return { ok: false, messageCode: "W17", message: "対象の書籍が見つかりません。" };

        const list = _getAll(KEY.FAVORITES);
        const dup = list.find(f =>
          _eqUserId(f.userId, userId) && String(f.bookId) === String(bookId));
        if (dup) return { ok: false, messageCode: "W19", message: "既にお気に入りに登録されています。" };

        const favoriteId = _nextSeq("favorite");
        const addedAt = _nowISO();
        list.push({
          favoriteId,
          userId: String(userId), bookId: String(bookId),
          createdAt: addedAt
        });
        _setAll(KEY.FAVORITES, list);
        writeAuditLog("ADD_FAVORITE", "INFO", userId,
          `お気に入り追加 favoriteId=${favoriteId} bookId=${bookId}`);
        return { ok: true, messageCode: "I05", message: "お気に入りに追加しました。",
                 data: { favoriteId, bookId: Number(bookId), addedAt } };
      });
    } catch (e) { return { ok: false, messageCode: "E10", message: e.message }; }
  }

  /**
   * removeFavorite
   * 概要 : お気に入りから削除する（物理削除 / ADR-007）。
   * @param {string} userId
   * @param {string} bookId
   * @returns {boolean}
   * @spec    RF-10 / ADR-007
   */
  /**
   * removeFavorite
   * 概要 : お気に入りから削除（物理削除 / ADR-007）。
   *         v3.0.6 より外部仕様 v4.0a-rev3 と揃え、第2引数は favoriteId に変更。
   *         後方互換: 数値/文字列どちらも OK 、bookId 指定（旧 API）も favoriteId 不在時は bookId 指定とみなしてフォールバック。
   * @spec    RF-10 / MP02 / 外部 v4.0a-rev3 §8.4.13
   */
  function removeFavorite(userId, favoriteIdOrBookId) {
    try {
      return _withLock([KEY.FAVORITES, KEY.AUDIT], () => {
        const list = _getAll(KEY.FAVORITES);
        // まず favoriteId としてマッチ
        let target = list.find(f =>
          _eqUserId(f.userId, userId) && String(f.favoriteId) === String(favoriteIdOrBookId));
        // 見つからなければ後方互換：bookId としてマッチ
        if (!target) {
          target = list.find(f =>
            _eqUserId(f.userId, userId) && String(f.bookId) === String(favoriteIdOrBookId));
        }
        if (!target) return { ok: false, messageCode: "W17", message: "対象のお気に入りが見つかりません。" };
        const next = list.filter(f => f.favoriteId !== target.favoriteId);
        _setAll(KEY.FAVORITES, next);
        writeAuditLog("REMOVE_FAVORITE", "INFO", userId,
          `お気に入り削除 favoriteId=${target.favoriteId} bookId=${target.bookId}`);
        return { ok: true, messageCode: "I06", message: "お気に入りから削除しました。", data: null };
      });
    } catch (e) { return { ok: false, messageCode: "E10", message: e.message }; }
  }

  /* =====================================================================
   * 9. ブリッジ入出力
   * ===================================================================== */

  /**
   * exportAll
   * 概要 : 全データを単一 JSON で出力する（ブリッジ連携用）。
   * @returns {string} JSON 文字列
   * @spec    RF-11 / API-08
   */
  function exportAll() {
    const dump = {
      version: "v3.0",
      exportedAt: _nowISO(),
      users:         _getAll(KEY.USERS),
      books:         _getAll(KEY.BOOKS),
      reservations:  _getAll(KEY.RESERVATIONS),
      history:       _getAll(KEY.HISTORY),
      loans:         _getAll(KEY.LOANS),
      notifications: _getAll(KEY.NOTIFICATIONS),
      favorites:     _getAll(KEY.FAVORITES),
      audit:         _getAll(KEY.AUDIT),
      sequences:     _safeJSON(localStorage.getItem(KEY.SEQ)) || {}
    };
    return JSON.stringify(dump, null, 2);
  }

  /**
   * importAll
   * 概要 : JSON を取込んで全データを置換する。
   *        破損 JSON 時はエラー応答を返し、既存データは保持する。
   * @param {string} jsonStr
   * @returns {ServiceResult}
   * @spec    RF-11 / API-07
   */
  function importAll(jsonStr) {
    const obj = _safeJSON(jsonStr);
    if (!obj || typeof obj !== "object") {
      return { success: false, messageCode: "E01", message: "JSON が解析できません。" };
    }
    try {
      return _withLock(Object.values(KEY), () => {
        if (Array.isArray(obj.users))         _setAll(KEY.USERS,         obj.users);
        if (Array.isArray(obj.books))         _setAll(KEY.BOOKS,         obj.books);
        if (Array.isArray(obj.reservations))  _setAll(KEY.RESERVATIONS,  obj.reservations);
        if (Array.isArray(obj.history))       _setAll(KEY.HISTORY,       obj.history);
        if (Array.isArray(obj.loans))         _setAll(KEY.LOANS,         obj.loans);
        if (Array.isArray(obj.notifications)) _setAll(KEY.NOTIFICATIONS, obj.notifications);
        if (Array.isArray(obj.favorites))     _setAll(KEY.FAVORITES,     obj.favorites);
        if (Array.isArray(obj.audit))         _setAll(KEY.AUDIT,         obj.audit);
        if (obj.sequences && typeof obj.sequences === "object") {
          localStorage.setItem(KEY.SEQ, JSON.stringify(obj.sequences));
        }
        writeAuditLog("IMPORT", "INFO", "(system)", "JSON取込完了");
        return { success: true, messageCode: "I07", message: "データを取込みました。" };
      });
    } catch (e) {
      if (window.Logger) Logger.error("ExcelAdapter.importAll", e.message);
      return { success: false, messageCode: "E10", message: "取込処理に失敗しました。" };
    }
  }

  /**
   * resetToSeed
   * 概要 : 全データを seed（初期データ）に戻す。
   *        破壊的操作のため、Service 層で二段階確認すべし。
   * @returns {void}
   * @spec    RF-11 / API-09 / 議事録 P5-04（二段階確認は呼出元で実施）
   */
  function resetToSeed() {
    Object.values(KEY).forEach(k => localStorage.removeItem(k));
    // _getAll が seed から再構築する
    Object.values(KEY).forEach(k => _getAll(k));
    writeAuditLog("RESET", "WARN", "(system)", "初期データに戻しました");
  }

  /* =====================================================================
   * 10. 貸出連携
   * ===================================================================== */

  /**
   * handleLoanEvent
   * 概要 : 外部システムからの貸出イベントを受領する。
   * @param {Object} event { eventType, userId, bookId, loanId?, dueDate? }
   * @returns {ServiceResult}
   * @spec    RF-13 / LN01 / API-10
   */
  function handleLoanEvent(event) {
    if (!event || !event.eventType) {
      return { success: false, messageCode: "E01", message: "イベント形式が不正です。" };
    }
    try {
      return _withLock([KEY.LOANS, KEY.RESERVATIONS, KEY.AUDIT, KEY.SEQ], () => {
        const now = _nowISO();
        if (event.eventType === "LOAN_START") {
          const loans = _getAll(KEY.LOANS);
          loans.push({
            loanId:   event.loanId || _nextSeq("loan"),
            userId:   String(event.userId), bookId: String(event.bookId),
            status:   "ACTIVE",
            lentAt:   now,
            dueDate:  event.dueDate || ""
          });
          _setAll(KEY.LOANS, loans);
          writeAuditLog("LOAN_START", "INFO", event.userId, `貸出開始 bookId=${event.bookId}`);
          return { success: true, messageCode: "I00", message: "貸出を記録しました。" };
        }
        if (event.eventType === "RETURN") {
          const loans = _getAll(KEY.LOANS);
          const idx = loans.findIndex(l =>
            String(l.loanId) === String(event.loanId) ||
            (String(l.bookId) === String(event.bookId) && l.status === "ACTIVE"));
          if (idx >= 0) {
            loans[idx].status = "RETURNED";
            loans[idx].returnedAt = now;
            _setAll(KEY.LOANS, loans);
            writeAuditLog("RETURN", "INFO", event.userId, `返却 bookId=${event.bookId}`);
            return { success: true, messageCode: "I00", message: "返却を記録しました。" };
          }
          return { success: false, messageCode: "W17", message: "対象の貸出が見つかりません。" };
        }
        return { success: false, messageCode: "E01", message: "未対応のイベント種別です。" };
      });
    } catch (e) {
      if (window.Logger) Logger.error("ExcelAdapter.handleLoanEvent", e.message);
      return { success: false, messageCode: "E10", message: "貸出連携に失敗しました。" };
    }
  }

  /**
   * findBookById（v3.0.3 / B-9 新設）
   * 概要 : books ストアから bookId で1件取得する。
   *        Service.getBookById() から呼ばれる。
   *
   * @param {string|number} bookId
   * @returns {Object|null}
   * @spec    RF-04 / SR02 / B-9
   */
  function findBookById(bookId) {
    try {
      const list = _getAll("books");
      return list.find(b => String(b.bookId) === String(bookId)) || null;
    } catch (_) {
      return null;
    }
  }

  /* =====================================================================
   * 11. 公開 API
   * ===================================================================== */
  return Object.freeze({
    findUser,
    getActiveReservations, getReservationCount,
    searchBooks,
    reserveBook, cancelReservation,
    getMyPageData, getNotifications, markNotificationRead,
    listFavorites, addFavorite, removeFavorite,
    exportAll, importAll, resetToSeed,
    handleLoanEvent,
    writeAuditLog,
    findBookById             // v3.0.3 / B-9 新設
  });
})();

window.ExcelAdapter = ExcelAdapter;

/* =============================================================================
 * v3.0.3 追加（A-7）: ブラウザ単体動作モードは「デモ専用」であることを起動時に明示する。
 * localStorage は利用者が容易に改ざんできるため、本番運用には server/ モードを使用すること。
 * =============================================================================
 */
(function notifyDemoMode() {
  "use strict";
  function check() {
    var dbType = (window.ConfigManager && typeof ConfigManager.get === "function")
      ? ConfigManager.get("dbType") : null;
    if (dbType !== "Excel") return;
    if (window.Logger && typeof Logger.info === "function") {
      Logger.info("ExcelAdapter",
        "Excel/localStorage モードで動作中。デモ・教育用途専用です。" +
        " 本番運用には server/ モード（Express + better-sqlite3）を使用してください。");
    } else if (typeof console !== "undefined") {
      console.info("[ExcelAdapter] localStorage デモモード。本番運用には server/ モードが必要です。");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(check, 200); });
  } else {
    setTimeout(check, 200);
  }
})();
