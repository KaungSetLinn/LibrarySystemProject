/*
 * =============================================================================
 * ファイル名 : js/core/messages.js
 * 概要       : メッセージマスタ。messageCode と表示文言の対応を一元管理する。
 *              v2.x では文言とコードが画面ごとに散在していたが、v3.0 で集約。
 *
 * 仕様書トレーサビリティ:
 *   - 外部仕様書 v3.0  §4.2 メッセージマスタ / §8.2.1 messageCode 体系
 *   - 内部仕様書 v3.0  §1.5 共通用語集
 *   - テスト仕様 v3.0  TC-API-010 メッセージマスタ整合
 *   - 議事録          P2-16 / D-03（用語統一）/ BUG調査 D-03
 *
 * messageCode 体系（外部仕様 §8.2.1）:
 *   /^[IWE][0-9]{2}$/
 *   I = Info（成功・通知）
 *   W = Warning（業務ルール違反、認証失敗等、リトライ可能）
 *   E = Error（致命的エラー、システム不整合）
 *
 * 改訂履歴:
 *   v3.0  2026-05-04  Y.Toyoda  新規作成（議事録 D-03 反映）
 *
 * @author  Y.Toyoda
 * @version v3.0
 * =============================================================================
 */
"use strict";

/**
 * メッセージマスタ。
 * すべての画面・サービス・アダプタは本マスタを唯一の真実とする。
 * 文言を変更する場合はここのみを編集する（散在防止）。
 *
 * @type {Readonly<Object<string,{level:string, text:string, spec:string}>>}
 */
const MESSAGES = Object.freeze({
  // ----- Info（I00〜I09） -----
  I00: { level: "info",  text: "処理が完了しました。",                 spec: "外部§4.2" },
  I01: { level: "info",  text: "ログインしました。",                   spec: "RF-01"     },
  I02: { level: "info",  text: "予約を登録しました。",                 spec: "RF-07"     },
  I03: { level: "info",  text: "予約をキャンセルしました。",           spec: "RF-08"     },
  I04: { level: "info",  text: "通知を既読にしました。",               spec: "RF-09"     },
  I05: { level: "info",  text: "お気に入りに追加しました。",           spec: "RF-10"     },
  I06: { level: "info",  text: "お気に入りから削除しました。",         spec: "RF-10"     },
  I07: { level: "info",  text: "データを取込みました。",               spec: "RF-11"     },
  I08: { level: "info",  text: "データを出力しました。",               spec: "RF-11"     },
  I09: { level: "info",  text: "初期データに戻しました。",             spec: "RF-11"     },

  // ----- Warning（W01〜W19） -----
  W01: { level: "warn",  text: "利用者IDまたは利用者名が一致しません。",          spec: "RF-01"  },
  W02: { level: "warn",  text: "セッションが切れました。再度ログインしてください。", spec: "RF-02"  },
  W03: { level: "warn",  text: "他者のリソースにはアクセスできません。",         spec: "RF-02"  },
  W04: { level: "warn",  text: "検索条件を1つ以上入力してください。",            spec: "RF-05"  },
  W11: { level: "warn",  text: "この書籍はすでに予約済です。",                    spec: "RF-07"  },
  W12: { level: "warn",  text: "予約上限に達しています（3冊）。",                spec: "RF-07"  },
  W13: { level: "warn",  text: "この書籍は利用停止中のため予約できません。",   spec: "RF-07"  },
  W14: { level: "warn",  text: "キャンセル可能な予約ではありません。",            spec: "RF-08"  },
  W15: { level: "warn",  text: "貸出中のため予約できません。",                    spec: "RF-07"  },
  W16: { level: "warn",  text: "検索条件を 1 つ以上入力してください。",           spec: "RF-05"  },
  W17: { level: "warn",  text: "対象が見つかりません。",                          spec: "RF-08"  },
  W18: { level: "warn",  text: "処理が競合しました。再度お試しください。",        spec: "BUG-07" },
  W19: { level: "warn",  text: "既にお気に入りに登録されています。",              spec: "RF-10 / 外部§8.4.12" },

  // ----- Error（E01〜E19） -----
  E01: { level: "error", text: "入力に誤りがあります。",                          spec: "外部§8.2" },
  E02: { level: "error", text: "DB接続に失敗しました。",                          spec: "外部§17"  },
  E03: { level: "error", text: "通信タイムアウトです。再試行してください。",     spec: "外部§16.1" },
  E09: { level: "error", text: "セッションが切れています。再ログインしてください。", spec: "RF-02" },
  E10: { level: "error", text: "データソースが利用できません。",                  spec: "RF-11" },
  E11: { level: "error", text: "他の操作と競合しました。少し待って再試行してください。", spec: "BUG-07" },
  E12: { level: "error", text: "監査ログ書込に失敗しました。",                    spec: "BUG-03" },
  E13: { level: "error", text: "データが破損している可能性があります。",          spec: "RF-12" }
});

/**
 * getMessage
 * 概要 : messageCode から文言を取得する。
 *        未定義コード時は警告ログを出し、フォールバック文言を返す。
 *
 * @param {string} code messageCode（例: "I02"）
 * @returns {{level:string, text:string, spec:string}}
 *
 * @example
 *   const m = getMessage("I02");
 *   showMessage(m.level, m.text);
 *
 * @spec   外部仕様 §4.2 / 議事録 D-03
 */
function getMessage(code) {
  if (MESSAGES[code]) return MESSAGES[code];
  console.warn(`[Messages] 未定義 messageCode: ${code}`);
  return { level: "info", text: "(未定義メッセージ: " + code + ")", spec: "?" };
}

/**
 * formatMessage
 * 概要 : messageCode + 任意の追加文字列を結合した表示用文言を返す。
 *
 * @param {string} code messageCode
 * @param {string} [suffix] 追加文言（書籍タイトル等）
 * @returns {string} 表示用文言
 *
 * @example
 *   formatMessage("I02", "「データベース設計入門」");
 *   // → "予約を登録しました。 「データベース設計入門」"
 */
function formatMessage(code, suffix) {
  const m = getMessage(code);
  return suffix ? `${m.text} ${suffix}` : m.text;
}

window.MESSAGES = MESSAGES;
window.getMessage = getMessage;
window.formatMessage = formatMessage;
