/*
 * =============================================================================
 * ファイル名 : js/datasource/sqlite-stub-adapter.js
 * 概要       : SQLiteStubAdapter（RP01 SQLiteRepository のスタブ実装）。
 *              ご要望「SQLite を使用するところはスタブにしてください」に対応する。
 *              API 形状（メソッド名・引数・戻り値）を ExcelAdapter と完全一致
 *              させ、Service 層・画面層に変更を加えずに切り替え可能。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 RP01 SQLiteRepository
 *   - 内部仕様書 CF03 createRepository（dbType による切替）
 *   - DB仕様書   §10 トランザクション仕様（将来 BEGIN IMMEDIATE 実装）
 *   - 要求仕様書 §11 将来拡張（SQLite 正式化）
 *   - テスト仕様 TC-COM-02（Excel↔SQLite 切替）
 *
 * 設計方針:
 *   1. 公開メソッドの「名前・引数・戻り値の形状」を ExcelAdapter と完全一致
 *      させる（DataSource.IREPOSITORY_CONTRACT を満たす）。
 *   2. 現段階では実体を ExcelAdapter に委譲する（テストデータの一貫性のため）。
 *      将来 sqlite.js / better-sqlite3 / WebAssembly SQLite 等へ置換する際は、
 *      このファイル内の関数本体だけを書き換えればよい。
 *   3. 動作中の DB 種別が利用者にも開発者にも分かるよう、書込系の応答メッセージ
 *      に「（SQLite スタブ経由）」のサフィックスを付与する（_tag）。
 *   4. ExcelAdapter が読み込まれていない環境でも致命停止しないよう、
 *      参照前に存在チェックを行う（防御的プログラミング）。
 *
 * 将来差し替え時の TODO:
 *   - 実 SQLite 接続層（IndexedDB ラッパー or WASM）を別モジュールに作成。
 *   - ここでは「DB 接続 → SQL 発行 → 結果整形」に書き換える。
 *   - 戻り値形状は本ファイルの公開関数と一致させる（呼出元無改修を保証）。
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

const SQLiteStubAdapter = (() => {

  /**
   * _excel
   * 概要 : 委譲先 ExcelAdapter を取得する（読込順の事故対策）。
   *        ExcelAdapter 未定義時は致命停止せず、null を返す。
   */
  function _excel() {
    if (window.ExcelAdapter) return window.ExcelAdapter;
    if (console && console.warn) {
      console.warn("[SQLiteStubAdapter] ExcelAdapter 未読込です。" +
                   "呼出順を確認してください（excel-adapter.js → sqlite-stub-adapter.js）。");
    }
    return null;
  }

  /**
   * _tag
   * 概要 : 文字列メッセージを持つ応答に「（SQLite スタブ経由）」を付与する。
   *        重複付与を避けるため、すでに付いている場合は何もしない。
   *
   * これにより、画面に表示されるメッセージから利用者が「いま SQLite モードで
   * 動いている」ことを直感的に確認できる（TC-COM-02 切替確認に有用）。
   */
  function _tag(result) {
    if (result && typeof result === "object" && typeof result.message === "string") {
      if (!result.message.includes("SQLite スタブ経由")) {
        result.message = result.message + "（SQLite スタブ経由）";
      }
    }
    return result;
  }

  /* =====================================================================
   * 公開 API（IRepository 契約。ExcelAdapter と完全に同じ形状）
   *
   * 読取系   : 委譲のみ（ノータグ）
   * 書込系   : 委譲後、_tag で「SQLite スタブ経由」を付与
   * 失敗時   : ExcelAdapter 未読込ならエラー応答を返し、UI を壊さない
   * ===================================================================== */
  return {

    // ----- 認証 / 利用者 -----

    /** RF-01 / AU01：利用者照合（Excel 委譲） */
    findUser(userId, userName) {
      const a = _excel();
      return a ? a.findUser(userId, userName) : null;
    },

    // ----- 予約状況 -----

    /** RF-03 / RV01：有効予約一覧 */
    getActiveReservations(userId) {
      const a = _excel();
      return a ? a.getActiveReservations(userId) : [];
    },
    /** RF-03 / RV01：有効予約件数 */
    getReservationCount(userId) {
      const a = _excel();
      return a ? a.getReservationCount(userId) : 0;
    },

    // ----- 検索 -----

    /** RF-05/06 / SR02：書籍検索（actionState 付き BookViewModel[]） */
    searchBooks(criteria) {
      const a = _excel();
      return a ? a.searchBooks(criteria) : [];
    },

    // ----- 予約・取消（書込系：成功メッセージにスタブタグを付与） -----

    /** RF-07 / RV03：予約登録 */
    reserveBook(userId, bookId) {
      const a = _excel();
      if (!a) {
        return { success: false, messageCode: "E10",
                 message: "SQLite スタブ実体が利用できません。" };
      }
      return _tag(a.reserveBook(userId, bookId));
    },
    /** RF-08 / RV02：予約取消 */
    cancelReservation(userId, reservationId) {
      const a = _excel();
      if (!a) {
        return { success: false, messageCode: "E10",
                 message: "SQLite スタブ実体が利用できません。" };
      }
      return _tag(a.cancelReservation(userId, reservationId));
    },

    // ----- マイページ / 通知 / お気に入り -----

    /** RF-10 / MP01：マイページ集約 */
    getMyPageData(userId) {
      const a = _excel();
      return a ? a.getMyPageData(userId) : {
        currentReservations: [], history: [], favorites: [], notifications: [],
        summary: { reservationCount: 0, historyCount: 0,
                   favoritesCount: 0, unreadNotifCount: 0 }
      };
    },
    /** RF-09：通知一覧 */
    getNotifications(userId) {
      const a = _excel();
      return a ? a.getNotifications(userId) : [];
    },
    /** RF-09：通知既読化 */
    markNotificationRead(userId, notificationId) {
      const a = _excel();
      return a ? a.markNotificationRead(userId, notificationId) : false;
    },
    /** RF-10：お気に入り追加 */
    addFavorite(userId, bookId) {
      const a = _excel();
      return a ? a.addFavorite(userId, bookId) : false;
    },
    /** RF-10：お気に入り削除 */
    removeFavorite(userId, bookId) {
      const a = _excel();
      return a ? a.removeFavorite(userId, bookId) : false;
    },

    // ----- ブリッジ -----

    /** RF-11 / API-08：全データ JSON 出力 */
    exportAll() {
      const a = _excel();
      return a ? a.exportAll() : "{}";
    },
    /** RF-11 / API-07：JSON 取込 */
    importAll(jsonStr) {
      const a = _excel();
      if (!a) {
        return { success: false, messageCode: "E10",
                 message: "SQLite スタブ実体が利用できません。" };
      }
      return _tag(a.importAll(jsonStr));
    },
    /** RF-11 / API-09：シードに初期化 */
    resetToSeed() {
      const a = _excel();
      if (a) a.resetToSeed();
    },

    // ----- 貸出連携 -----

    /** RF-13 / LN01 / API-10：貸出イベント受領 */
    handleLoanEvent(event) {
      const a = _excel();
      if (!a) {
        return { success: false, messageCode: "E10",
                 message: "SQLite スタブ実体が利用できません。" };
      }
      return _tag(a.handleLoanEvent(event));
    },

    // ----- 監査ログ -----

    /** RF-12 / LG01：監査ログ書込 */
    writeAuditLog(eventType, level, userId, message, detail) {
      const a = _excel();
      if (a) a.writeAuditLog(eventType, level, userId, message, detail);
    }
  };
})();

// 後続スクリプトから参照できるよう window に公開する。
window.SQLiteStubAdapter = SQLiteStubAdapter;
