/*
 * =============================================================================
 * ファイル名 : js/datasource/data-source.js
 * 概要       : DataSource（IRepository）契約の定義と検証ユーティリティ。
 *              ExcelAdapter と SQLiteStubAdapter が同じ API 形状を持つことを
 *              実行時にも検証する（メソッド存在＋引数数＋戻り値型）。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 v3.0  §3 モジュール構成 / CF03 createRepository
 *   - 外部仕様書 v3.0  §8 API一覧 / §7.2 searchBooks 形式 / §8.2.1 四層構造
 *   - 要求仕様書 v3.0  RF-01〜RF-13
 *   - DB仕様書   v3.0  §5 全テーブル定義
 *   - テスト仕様 v3.0  TC-COM-02 / TC-API-001〜010
 *   - 議事録          P1-13 / P3-08（戻り値型検査の強化）
 *
 * 改訂履歴:
 *   v1.0  2026-04-15  Y.Toyoda  v2.x 初版
 *   v3.0  2026-05-04  Y.Toyoda  戻り値型スモークテスト追加（議事録 P3-08）
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

/* =========================================================================
 * 共通レスポンス型（JSDoc typedef）
 * ========================================================================= */

/**
 * @typedef  {Object} ServiceResult
 * @property {boolean} success         処理成功なら true
 * @property {string}  [messageCode]   メッセージID（"I01","E02" 等）/^[IWE][0-9]{2}$/
 * @property {string}  message         利用者向け文言（messageCode に対応）
 * @property {Object}  [payload]       任意の追加データ
 */

/**
 * @typedef  {Object} ReservationResult
 * @property {boolean} success
 * @property {string}  [reservationId] 採番されたID（v3.0 は INTEGER だが文字列で返す）
 * @property {string}  messageCode
 * @property {string}  message
 */

/**
 * @typedef  {Object} SearchCriteria
 * @property {string}  title
 * @property {string}  author
 * @property {string}  category
 * @property {string}  sort           "bookId"|"title"|"author"|"arrivalDateDesc"
 * @property {boolean} availableOnly
 * @property {boolean} reservableOnly
 * @property {string}  viewerUserId
 */

/**
 * @typedef  {Object} BookViewModel
 * @property {string}  bookId
 * @property {string}  title
 * @property {string}  author
 * @property {string}  category
 * @property {string}  arrivalDate
 * @property {boolean} canReserve
 * @property {boolean} isDisabled
 * @property {string}  status
 * @property {("AVAILABLE"|"ON_LOAN"|"RESERVED"|"DISABLED")} actionState
 * @property {string}  actionLabel
 * @property {string}  dueDate
 */

/**
 * @typedef  {Object} SearchResponse
 * @property {("success"|"error")} result
 * @property {string} [messageCode]
 * @property {string} [message]
 * @property {number} count
 * @property {number} page
 * @property {number} pageSize
 * @property {number} totalPages
 * @property {BookViewModel[]} books
 */

/* =========================================================================
 * IRepository 契約
 *   name        : メソッド名
 *   minArgs     : 期待される最低引数個数
 *   sourceSpec  : 出典仕様ID（保守時の追跡用）
 *   returnType  : 戻り値の期待型（議事録 P3-08 反映、v3.0 で追加）
 * ========================================================================= */
const IREPOSITORY_CONTRACT = Object.freeze([
  { name: "findUser",              minArgs: 2, returnType: "object?",  sourceSpec: "RF-01 / AU01"     },
  { name: "getActiveReservations", minArgs: 1, returnType: "array",    sourceSpec: "RF-03 / RV01"     },
  { name: "getReservationCount",   minArgs: 1, returnType: "number",   sourceSpec: "RF-03 / RV01"     },
  { name: "searchBooks",           minArgs: 1, returnType: "array",    sourceSpec: "RF-05/06 / SR02"  },
  { name: "reserveBook",           minArgs: 2, returnType: "object",   sourceSpec: "RF-07 / RV03"     },
  { name: "cancelReservation",     minArgs: 2, returnType: "object",   sourceSpec: "RF-08 / RV02"     },
  { name: "getMyPageData",         minArgs: 1, returnType: "object",   sourceSpec: "RF-10 / MP01"     },
  { name: "getNotifications",      minArgs: 1, returnType: "array",    sourceSpec: "RF-09"            },
  { name: "markNotificationRead",  minArgs: 2, returnType: "boolean",  sourceSpec: "RF-09"            },
  { name: "addFavorite",           minArgs: 2, returnType: "boolean",  sourceSpec: "RF-10"            },
  { name: "removeFavorite",        minArgs: 2, returnType: "boolean",  sourceSpec: "RF-10"            },
  { name: "exportAll",             minArgs: 0, returnType: "string",   sourceSpec: "RF-11 / API-08"   },
  { name: "importAll",             minArgs: 1, returnType: "object",   sourceSpec: "RF-11 / API-07"   },
  { name: "resetToSeed",           minArgs: 0, returnType: "void",     sourceSpec: "RF-11 / API-09"   },
  { name: "handleLoanEvent",       minArgs: 1, returnType: "object",   sourceSpec: "RF-13 / LN01"     },
  { name: "writeAuditLog",         minArgs: 4, returnType: "void",     sourceSpec: "RF-12 / LG01"     }
]);

const DataSource = (() => {

  /**
   * assertContract
   * 概要 : アダプタが IRepository 契約を満たすか検査する。
   *        欠落メソッドと引数不足を一度にレポートする。
   *
   * @param {Object} adapter 検査対象アダプタ
   * @param {string} name    ログ表示用の名前
   * @returns {{valid:boolean, missing:string[], underArgs:string[], adapterName:string}}
   * @throws  なし（致命停止せず結果オブジェクトで返す）
   * @spec    内部仕様 §3 / 議事録 P1-13
   */
  function assertContract(adapter, name) {
    const result = {
      valid: true, missing: [], underArgs: [],
      adapterName: name || "(unknown)"
    };
    if (!adapter || typeof adapter !== "object") {
      result.valid = false;
      result.missing.push("(adapter is null or not object)");
      return result;
    }
    IREPOSITORY_CONTRACT.forEach(spec => {
      const fn = adapter[spec.name];
      if (typeof fn !== "function") {
        result.valid = false;
        result.missing.push(`${spec.name} (${spec.sourceSpec})`);
        return;
      }
      // Function.length はデフォルト引数の前までを数える仕様。
      // minArgs より少ない場合のみ underArgs として警告。
      if (fn.length < spec.minArgs) {
        result.underArgs.push(
          `${spec.name}: expected >=${spec.minArgs}, got ${fn.length} (${spec.sourceSpec})`
        );
      }
    });
    return result;
  }

  /**
   * runSelfCheck
   * 概要 : 起動時に ExcelAdapter / SQLiteStubAdapter を自動検証する。
   *        OK ならコンソールに info、NG なら warn を出す。
   *
   * @returns {void}
   * @spec    議事録 P1-13
   */
  function runSelfCheck() {
    const targets = [];
    if (window.ExcelAdapter)      targets.push(["ExcelAdapter",      window.ExcelAdapter]);
    if (window.SQLiteStubAdapter) targets.push(["SQLiteStubAdapter", window.SQLiteStubAdapter]);

    targets.forEach(([nm, ad]) => {
      const r = assertContract(ad, nm);
      const tag = "DataSource.runSelfCheck";
      if (r.valid && r.underArgs.length === 0) {
        if (window.Logger) Logger.info(tag, `${nm}: IRepository 契約OK`);
      } else {
        if (window.Logger) Logger.warn(tag, `${nm}: 契約違反`, r);
      }
    });
  }

  return Object.freeze({ CONTRACT: IREPOSITORY_CONTRACT, assertContract, runSelfCheck });
})();

window.DataSource = DataSource;
