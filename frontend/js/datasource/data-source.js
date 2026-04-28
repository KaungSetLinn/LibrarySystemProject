/*
 * =============================================================================
 * ファイル名 : js/datasource/data-source.js
 * 概要       : DataSource（IRepository）契約の定義と検証ユーティリティ。
 *              ExcelAdapter と SQLiteStubAdapter が「同じ API 形状」を
 *              持つことを実行時にも検証できるようにする。
 *
 * 仕様書トレーサビリティ:
 *   - 内部仕様書 §3 モジュール構成 / RP01 SQLiteRepository / RP02 ExcelRepository
 *   - 内部仕様書 CF03 createRepository（このインターフェースを返す）
 *   - 要求仕様書 RF-01〜RF-13（インターフェースが各機能要求に対応）
 *   - 外部仕様書 §8 API一覧 / §7.2 searchBooks 形式
 *   - DB仕様書   §5 全テーブル（戻り値の構造を規定）
 *   - テスト仕様 TC-COM-02（Excel↔SQLite 切替時の挙動）
 *
 * 設計のポイント:
 *   - JavaScript には interface 構文が無いため、
 *     「メソッド名」と「期待される最低引数個数」で契約を表現する。
 *   - DataSource.assertContract(adapter) で、欠落メソッド・引数不足を
 *     一度にレポートし、開発者が早期に気づけるようにする。
 *   - 共通レスポンス形状（ServiceResult / SearchResponse 等）は JSDoc
 *     typedef として併記し、IDE補完とテストでの参照を補助する。
 * 作成日 : 2026-04-26
 * =============================================================================
 */
"use strict";

/* =========================================================================
 * 共通レスポンス型（JSDoc typedef）
 *   ※ 実行時の型検査は行わないが、外部仕様 §8 API 共通形状の宣言として
 *     残しておくことで、コードを読む人の認識ズレを減らす目的。
 * ========================================================================= */

/**
 * @typedef {Object} ServiceResult
 * @property {boolean} success         処理成功なら true
 * @property {string}  [messageCode]   メッセージID（"I01","E02","E11" 等）
 * @property {string}  message         利用者向け文言
 * @property {Object}  [payload]       任意の追加データ
 */

/**
 * @typedef {Object} ReservationResult
 * @property {boolean} success
 * @property {string}  [reservationId]
 * @property {string}  messageCode
 * @property {string}  message
 */

/**
 * @typedef {Object} SearchCriteria
 * @property {string}  title
 * @property {string}  author
 * @property {string}  category
 * @property {string}  sort           "bookId"|"title"|"author"|"arrivalDateDesc"
 * @property {boolean} availableOnly
 * @property {boolean} reservableOnly
 * @property {string}  viewerUserId
 */

/**
 * @typedef {Object} BookViewModel
 * @property {string}  bookId
 * @property {string}  title
 * @property {string}  author
 * @property {string}  category
 * @property {string}  arrivalDate
 * @property {boolean} canReserve
 * @property {boolean} isDisabled
 * @property {string}  status         表示専用文言（外部仕様§7.2）
 * @property {("AVAILABLE"|"ON_LOAN"|"RESERVED"|"DISABLED")} actionState 制御用
 * @property {string}  actionLabel    ボタン表示用ラベル
 * @property {string}  dueDate        貸出中なら返却予定日
 */

/**
 * @typedef {Object} SearchResponse
 * @property {("success"|"error")} result
 * @property {string} [messageCode]
 * @property {string} [message]
 * @property {number} count
 * @property {number} page
 * @property {number} pageSize
 * @property {number} totalPages
 * @property {BookViewModel[]} books
 */

/**
 * @typedef {Object} LoanEvent
 * @property {("LOAN_START"|"RETURN")} eventType
 * @property {string} userId
 * @property {string} bookId
 * @property {string} [loanId]
 * @property {string} [dueDate]
 */

/* =========================================================================
 * IRepository 契約
 *   - name    : メソッド名
 *   - minArgs : 期待される最低引数個数
 *   - sourceSpec : 出典仕様ID（保守時の追跡を容易にする）
 *
 * 注意 : Function.length は「デフォルト値より前」の引数個数を返す。
 *        実装側がデフォルト引数や可変長で増やすことは契約違反としない。
 * ========================================================================= */
const IREPOSITORY_CONTRACT = Object.freeze([
  // ----- 認証 / 利用者 -----
  { name: "findUser",              minArgs: 2, sourceSpec: "RF-01 / AU01"     },

  // ----- 予約状況 -----
  { name: "getActiveReservations", minArgs: 1, sourceSpec: "RF-03 / RV01"     },
  { name: "getReservationCount",   minArgs: 1, sourceSpec: "RF-03 / RV01"     },

  // ----- 検索 -----
  { name: "searchBooks",           minArgs: 1, sourceSpec: "RF-05/06 / SR02"  },

  // ----- 予約・取消 -----
  { name: "reserveBook",           minArgs: 2, sourceSpec: "RF-07 / RV03"     },
  { name: "cancelReservation",     minArgs: 2, sourceSpec: "RF-08 / RV02"     },

  // ----- マイページ -----
  { name: "getMyPageData",         minArgs: 1, sourceSpec: "RF-10 / MP01"     },

  // ----- 通知 -----
  { name: "getNotifications",      minArgs: 1, sourceSpec: "RF-09"            },
  { name: "markNotificationRead",  minArgs: 2, sourceSpec: "RF-09"            },

  // ----- お気に入り -----
  { name: "addFavorite",           minArgs: 2, sourceSpec: "RF-10"            },
  { name: "removeFavorite",        minArgs: 2, sourceSpec: "RF-10"            },

  // ----- ブリッジ入出力 -----
  { name: "exportAll",             minArgs: 0, sourceSpec: "RF-11 / API-08"   },
  { name: "importAll",             minArgs: 1, sourceSpec: "RF-11 / API-07"   },
  { name: "resetToSeed",           minArgs: 0, sourceSpec: "RF-11 / API-09"   },

  // ----- 貸出連携 -----
  { name: "handleLoanEvent",       minArgs: 1, sourceSpec: "RF-13 / LN01"     },

  // ----- 監査ログ -----
  // writeAuditLog(eventType, level, userId, message, detail?) の最低 4 引数
  { name: "writeAuditLog",         minArgs: 4, sourceSpec: "RF-12 / LG01"     }
]);

/* =========================================================================
 * 検証ユーティリティ
 * ========================================================================= */
const DataSource = (() => {

  /**
   * assertContract
   * 概要 : 渡されたアダプタが IRepository 契約を満たすか検査する。
   *        欠落しているメソッド名と引数不足を一度にレポートする。
   * 入力 : adapter（任意のオブジェクト）, name（ログ表示用の名前）
   * 出力 : { valid: boolean, missing: string[], underArgs: string[], adapterName: string }
   * 例外 : なし（致命停止させず、結果オブジェクトで返す）
   *
   * 使用例:
   *   const r = DataSource.assertContract(window.ExcelAdapter, "ExcelAdapter");
   *   if (!r.valid) console.warn("契約違反", r);
   */
  function assertContract(adapter, name) {
    const result = { valid: true, missing: [], underArgs: [], adapterName: name || "(unknown)" };
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
      // Function.length はデフォルト引数の前までを数える仕様であることに注意。
      // 「契約 minArgs より少ない場合のみ」underArgs として警告する。
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
   * 概要 : window.ExcelAdapter / window.SQLiteStubAdapter が読み込まれていれば、
   *        両方を契約検証して console に結果を出力する。
   *        起動時の早期検知に使用する（致命停止しない、開発者向けログ）。
   *
   *   - OK の場合 : console.info "ExcelAdapter : OK (IRepository 契約OK)"
   *   - NG の場合 : console.warn "SQLiteStubAdapter : NG", { missing: [...], underArgs: [...] }
   */
  function runSelfCheck() {
    const targets = [];
    if (window.ExcelAdapter)        targets.push(["ExcelAdapter",        window.ExcelAdapter]);
    if (window.SQLiteStubAdapter)   targets.push(["SQLiteStubAdapter",   window.SQLiteStubAdapter]);

    targets.forEach(([nm, ad]) => {
      const r = assertContract(ad, nm);
      if (r.valid && r.underArgs.length === 0) {
        if (console && console.info) console.info(`[DataSource] ${nm} : OK (IRepository 契約OK)`);
      } else {
        if (console && console.warn) console.warn(`[DataSource] ${nm} : NG`, r);
      }
    });
  }

  // 公開 API
  return Object.freeze({
    /** 契約定義（読み取り専用） */
    CONTRACT: IREPOSITORY_CONTRACT,
    /** 単発の契約検証 */
    assertContract,
    /** Excel/SQLite の自動セルフチェック */
    runSelfCheck
  });
})();

// グローバル公開（複数 script から参照できるように）
window.DataSource = DataSource;

// 起動時の自動セルフチェック。
// ExcelAdapter / SQLiteStubAdapter が後続スクリプトで読み込まれてから動かしたいので、
// microtask で 1 段遅らせる（致命停止しない）。
queueMicrotask(() => {
  try { DataSource.runSelfCheck(); } catch (_e) { /* noop */ }
});
