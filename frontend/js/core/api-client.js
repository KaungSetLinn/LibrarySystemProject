/*
 * READABLE-CODE REVIEW NOTE
 * 対象ファイル: frontend/js/core/api-client.js
 * 責務: フロントエンド共通基盤。設定、ルーティング、サービス境界、ログ、UI共通処理を担当する。
 * 保守メモ: 画面層とデータソース層を結合しすぎないこと。非同期 API を導入する場合は Service 契約を先に揃える。
 */
/*
 * =============================================================================
 * ファイル名 : app/js/core/api-client.js
 * 概要       : サーバーモード用 fetch wrapper（v3.0.3 / A-5 対応）。
 *              CSRF トークンの取得・付与・自動リトライを共通化する。
 *
 *              使用方法:
 *                ApiClient.get("/api/v1/users/1/dashboard")
 *                ApiClient.post("/api/v1/reservations", { bookId: 12 })
 *                ApiClient.delete("/api/v1/reservations/5")
 *
 *              ブラウザ単体動作モードでは、ApiClient は使用されない（DataSource 経由）。
 *              dbType=SQLite かつ server/ モードを利用する場合のみ有効。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v4.0  §8.2 共通応答形式 / §12 セキュリティ仕様
 *   - 改訂対象        A-5（CSRF トークン連携の未実装）
 *
 * 改訂履歴:
 *   v3.0.3  2026-05-05  Y.Toyoda  新規作成（A-5 対応）
 *
 * @author  Y.Toyoda
 * @version v3.0.3
 * =============================================================================
 */
"use strict";

const ApiClient = (() => {
  const API_BASE = "/api/v1";
  const CSRF_ENDPOINT = API_BASE + "/csrf-token";

  // メモリ保持の CSRF トークン（永続化しない）
  let _csrfToken = null;
  let _fetching = null;

  /**
   * _log
   * 概要 : Logger があれば使い、なければ console。
   */
  function _log(level, where, msg) {
    if (window.Logger && typeof Logger[level] === "function") {
      Logger[level](where, msg);
    } else if (typeof console !== "undefined") {
      console[level === "warn" ? "warn" : (level === "error" ? "error" : "log")](
        "[" + where + "] " + msg);
    }
  }

  /**
   * _fetchToken
   * 概要 : /api/v1/csrf-token から CSRF トークンを取得して保持する。
   *        並行呼び出しは Promise を共有して二重発行を防ぐ。
   *
   * @returns {Promise<string|null>}
   * @spec    A-5
   */
  function _fetchToken() {
    if (_csrfToken) return Promise.resolve(_csrfToken);
    if (_fetching)  return _fetching;

    _fetching = fetch(CSRF_ENDPOINT, {
      method: "GET",
      credentials: "same-origin",
      headers: { "Accept": "application/json" }
    })
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (j && j.data && j.data.csrfToken) {
          _csrfToken = j.data.csrfToken;
          _log("info", "ApiClient._fetchToken", "CSRF token acquired");
        } else {
          _log("warn", "ApiClient._fetchToken", "CSRF token endpoint returned no token");
        }
        _fetching = null;
        return _csrfToken;
      })
      .catch(err => {
        _fetching = null;
        _log("warn", "ApiClient._fetchToken", "CSRF fetch failed: " + err.message);
        return null;
      });
    return _fetching;
  }

  /**
   * _request
   * 概要 : 共通リクエスト処理。POST/PUT/DELETE 時は X-CSRF-Token を付与する。
   *        403/419 時はトークンを破棄して1回だけリトライする。
   *
   * @param {string} method
   * @param {string} url
   * @param {Object} [body]
   * @param {Object} [opts]
   * @returns {Promise<Object>} 四層構造応答 { result, messageCode, message, data }
   * @spec    外部仕様 §8.2.2
   */
  async function _request(method, url, body, opts) {
    const needsCsrf = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
    if (needsCsrf) {
      const tok = await _fetchToken();
      if (tok) headers["X-CSRF-Token"] = tok;
    }
    const init = {
      method,
      credentials: "same-origin",
      headers
    };
    if (body !== undefined && body !== null) {
      init.body = JSON.stringify(body);
    }

    let res;
    try {
      res = await fetch(url, init);
    } catch (netErr) {
      _log("error", "ApiClient._request", method + " " + url + " network error: " + netErr.message);
      return {
        result: "error", messageCode: "E10",
        message: "ネットワークエラーが発生しました。", data: null
      };
    }

    // CSRF 失効と思われる場合は1回だけ再試行
    if ((res.status === 403 || res.status === 419) && needsCsrf && !(opts && opts._retried)) {
      _csrfToken = null;
      _log("warn", "ApiClient._request", "retrying after CSRF refresh");
      return _request(method, url, body, Object.assign({}, opts, { _retried: true }));
    }

    let json;
    try {
      json = await res.json();
    } catch (_) {
      json = {
        result: res.ok ? "success" : "error",
        messageCode: res.ok ? "I00" : "E10",
        message: res.ok ? "OK" : ("HTTP " + res.status),
        data: null
      };
    }
    return json;
  }

  return Object.freeze({
    /** GET */
    get(url)              { return _request("GET",    url, null); },
    /** POST */
    post(url, body)       { return _request("POST",   url, body || {}); },
    /** PUT */
    put(url, body)        { return _request("PUT",    url, body || {}); },
    /** DELETE */
    delete(url)           { return _request("DELETE", url, null); },
    /** 直接トークン取得（テスト用） */
    fetchCsrfToken()      { return _fetchToken(); },
    /** 現在保持中のトークンを取得（テスト用） */
    _peekToken()          { return _csrfToken; },
    /** トークン強制破棄（テスト用） */
    _clearToken()         { _csrfToken = null; },
    /** ベースURL */
    BASE: API_BASE
  });
})();

window.ApiClient = ApiClient;
