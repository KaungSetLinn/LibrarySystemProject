# 図書予約システム v3.0.6 本番版

> 作成者: **Y.Toyoda**
> バージョン: **v3.0.6**
> 発行日: **2026-05-11**

## 🔥 v3.0.6 主要変更点（v4.0a-rev3 反映）
- **favorites CRUD 実装完了**：API-11 GET / API-12 POST（201 Created）/ API-13 DELETE
- **通知既読化 API-14 実装完了**：POST /users/:userId/notifications/:notificationId/read（冪等）
- **messageCode W19 追加**：「既にお気に入りに登録されています。」
- **favorites テーブル**：UNIQUE(user_id, book_id) + idx_favorites_user 追加
- **3 層アダプタすべて対応**：ApiAdapter / SQLiteAdapter (sql.js) / ExcelAdapter 全て同一仕様
- **テスト 73/73 PASS**（10 スイート、新規 2 スイート 16 ケース追加）

---

v2.x から全面書き換え。**dbType=Excel が無視されるバグ（BUG-01）を完全修正**し、
6ペルソナ徹底コードレビュー（113件）を反映した最終版です。

v3.0.6 ではさらにカゥン氏提示の favorites CRUD と通知既読化を本実装化し、
Excel / SQLite (sql.js) / SQLite (better-sqlite3 server) の三モードすべてで同一仕様動作を保証します。

---

## 📂 ディレクトリ構成

```
library-reservation-system-v3/
├── app/                       ★ ブラウザ単体動作モード（v2.x と同じ体験）
│   ├── index.html             SPA エントリ
│   ├── library-system-config.txt    ★ SSOT 設定（dbType 等）
│   ├── library-system-config.js     file:// 用 fallback
│   ├── css/
│   │   ├── style.css          v2.x 同等のリッチUI
│   │   └── v3-additions.css   Toast / Empty State / 二重リング focus
│   └── js/
│       ├── library-config.js  最後の安全網 FALLBACK
│       ├── library-seed.js    シード書籍データ
│       ├── core/              Logger / Messages / ConfigManager / Service / UI共通 / Router
│       ├── datasource/        DataSource契約 / ExcelAdapter / SQLiteStubAdapter
│       ├── screens/           6画面（login / reservation-status / advanced-search / search-results / notification / mypage）
│       └── app.js             SPA起動エントリ
└── server/                    ★ Express サーバーモード（dbType=SQLite 用）
    ├── package.json
    ├── src/
    │   ├── server.js          Express 起動
    │   ├── controllers/       四層構造応答
    │   ├── middleware/        auth / error
    │   ├── routes/            /api/v1/*
    │   └── utils/             logger / db / response / config-loader
    └── scripts/init-db.js     SQLite 初期化 + seed
```

---

## 🚀 起動方法

### モード①：ブラウザ単体（v2.x と同じ。サーバー不要）

1. `app/library-system-config.txt` を確認（既定: `dbType=Excel`）
2. `app/index.html` をブラウザで開く

### モード②：Express サーバー（dbType=SQLite 用）

```bash
cd server
npm install
npm run init-db    # SQLite 初期化 + seed 投入
npm start          # http://localhost:3000
```

ブラウザで `http://localhost:3000/` にアクセス。

---

## 🐛 v2.x からのバグ修正

| BUG-ID | 内容 | 修正 |
|--------|------|------|
| **BUG-01** | `library-system-config.txt` の `dbType=Excel` が無視される | ConfigManager.init() を async 化し txt を fetch、SSOT 経路化 |
| **BUG-02** | localStorage の SQLite 値が txt 設定を上書きする | localStorage 永続化を廃止、起動時に旧キー自動削除 |
| **BUG-03** | 監査ログが localStorage 容量上限で静かに失敗 | FIFO 削除（5000件）+ 失敗カウンタ通知 |
| **BUG-05** | 採番カウンタの初期化フローで ID 重複再発リスク | `_scanMaxId` を `_nextSeq` 内で必須実行 |
| **BUG-07** | 複数タブ同時操作で予約状態が壊れる | BroadcastChannel + storage event |
| **BUG-09** | セッション期限切れチェックなし | 30分超で自動ログアウト |
| **BUG-10** | `alert()` フォールバックで UX 劣化 | Toast コンポーネント新設 |
| **BUG-13** | ページャ Prev/Next 端で disabled されない | 端で disabled 制御 |
| **BUG-14** | 通知既読化の即時UI反映が遅い | 即時 DOM クラス切替 + バッジ再計算 |
| **BUG-15** | 検索結果のソートがブレる | bookId を第二キーに安定ソート |
| **BUG-V2.0** | 通知既読化が反映されない（v2.x 既知） | `_normalizeNotification` + 再取得保証 |
| **BUG-V2.1-01** | ID 重複（v2.1 既知） | `_scanMaxId` 必須化（再発防止） |

---

## 🎯 dbType の SSOT（最重要）

**設定の正解は `app/library-system-config.txt` のみ。**

| 優先順位 | ソース | 用途 |
|---------|--------|------|
| 1 (高) | `library-system-config.txt` | **★ SSOT ★** 編集はここのみ |
| 2 | `library-system-config.js` | file:// 環境の fallback（txt と同内容を保つ） |
| 3 | `LIBRARY_CONFIG_FALLBACK` | ハードコード安全網 |
| 4 (低) | `localStorage.lib-config-overrides` | デバッグ専用（既定無効） |

ログイン画面の「データソース切替」は **一時切替のみ**（永続化しません）。
恒久的に変更する場合は txt を編集してください。

---

## 🧪 テストアカウント（seed）

| 利用者ID | 利用者名 | ロール |
|---------|----------|--------|
| 1 | 佐藤翔太 | STUDENT |
| 2 | 田中花子 | STUDENT |
| 3 | 山田教授 | FACULTY |

---

## 📚 関連ドキュメント

- `docs/architecture.md` — アーキテクチャ図
- `docs/known-issues.md` — 既知バグと回避策
- `docs/lessons-learned.md` — v2.x → v3.0 の教訓
- `docs/adr/` — ADR-001〜018 個別ファイル
- `CHANGELOG.md` — 変更履歴
- `bug_investigation.txt` — バグ調査報告書（1回目納品）
- `code_review_minutes.txt` — 6ペルソナレビュー議事録（1回目納品）

---

© 2026 Y.Toyoda


---

## 🔖 仕様書 v4.0 最終版との整合（v3.0.3）

本パッケージ（v3.0.3）は、図書予約システム仕様書 v4.0 最終版と完全整合します。

| 仕様書（v4.0） | 主な対応箇所（v3.0.3 コード） |
|---|---|
| 要求仕様書 §5.2 設定SSOT | `app/library-system-config.txt` / `app/js/core/config-manager.js` |
| 外部仕様書 §8.2 共通応答形式 | `server/src/utils/response.js` |
| 外部仕様書 §10.7 LL-09 規約 | `app/js/screens/screen-login.js` / `screen-advanced-search.js` |
| 内部仕様書 §3.1 CF01 起動シーケンス | `app/js/core/config-manager.js`（async fetch + fallback + 旧キー削除） |
| DB仕様書 §13.2 dbType SSOT | `app/library-system-config.txt`（localStorage 永続化なし） |
| テスト仕様書 §5.6 / TC-REG-01・02 | `test/test-form-reset.js` / `test/test-config-manager.js` |

**実装ロジックは v3.0.1 から無変更**（BUG-01〜BUG-23 修正・LL-09 規約・dbType SSOT を継承）。
v3.0.3 では版数表記とドキュメントのみ仕様書 v4.0 と同期しました。


---

## 🆕 v3.0.3 改訂サマリ（2026-05-05）

「図書予約システム v3.0.1 ソフトウェア設計書（コードレビュー付き）」の指摘15件をすべて反映。

### 🔴 Critical（3件）すべて対応
- **S-1**: SQLite スタブモード警告を起動時 console + 画面右下バッジで明示
- **S-2**: `index.html` のインライン `<style>` `<script>` を外部ファイル化（CSP 整合）
- **S-3**: 予約APIをトランザクション化、書籍状態（is_disabled）チェック、監査ログ、部分一意INDEX `uq_reservations_active` を追加

### 🟠 High（5件）すべて対応
- **A-4**: サーバ側 API 追加（`books/search` / `users/:id/dashboard` / `users/:id/mypage` / `users/:id/notifications` / `books/:id` / `health`）
- **A-5**: フロント `app/js/core/api-client.js` 新設。CSRF トークン自動取得・付与・401/419 時の自動リトライ
- **A-6**: 「簡易認証モード」と明示。`users.password_hash` 列追加、`bcryptjs` 構造のみ準備（EX-01）
- **A-7**: ブラウザ単体モード = デモ専用 を起動時 console.info ＋ 文書で明示
- **A-8**: localStorage タブ間排他制限を文書化、v3.1 で Web Locks API 移行を計画

### 🟡 Medium（4件）すべて対応
- **B-9**: `Service.getBookById()` 新設、`screen-reservation-status.js` の `_findBook()` を Service 経由化
- **B-10**: `server/src/utils/db.js` の DB パスを `__dirname` 基準の絶対パスに変更
- **B-11**: `init-db.js` のクリーンアップ拡張（`library.db` + WAL/SHM、`sessions.sqlite` + WAL/SHM の計6ファイル）
- **B-12**: CHANGELOG.md の過剰表現（「innerHTML全廃」「ESMベース」等）を実態に合わせて訂正

### 🟢 Low（3件）すべて対応
- **C-13**: ExcelAdapter（1019行）のモジュール分割を v3.1 計画として `risk-register.md` に登録
- **C-14**: `coding-rules.md` に **LL-10 エラー握り潰し禁止規約**を追加
- **C-15**: `library-system-config.{txt,js}` の二重管理を整合性チェック＋v3.1 自動生成計画で対応

### 認証モード明記（重要）
v3.x は **簡易認証モード**（利用者ID＋利用者名のみ）です。教育・デモ用途専用。本番運用には EX-01（bcrypt+salt）への移行が必須です。詳細は `docs/known-issues.md` KL-05 を参照。

### 動作確認（v3.0.3）
- v3.0 起因テスト: 7/7 PASS（test-config-manager.js）
- v3.0.1 由来テスト: 8/8 PASS（test-form-reset.js）
- v3.0.3 新規テスト: 7/7 PASS（test-csrf-client.js / test-reservation-tx.js）
- 全 JS ファイル `node --check` PASS



---

## 🆕 v3.0.4 改訂サマリ（2026-05-05）

### 🔵 SQLite 本実装化（S-1 解消の最終形）
v3.0.3 までは `dbType=SQLite` 設定時も `SQLiteStubAdapter` が `ExcelAdapter` に
委譲するだけだったが、v3.0.4 で**実際に SQLite を動かす2方式を実装**：

#### 方式①: ブラウザ側 sql.js（WASM SQLite）— 第一選択肢
- `app/js/datasource/sqlite-adapter.js` 新設
- 起動時に `https://cdnjs.cloudflare.com/.../sql-wasm.js` を動的ロード
- `IndexedDB` に DB バイナリを永続化（リロード後もデータ保持）
- 9テーブル + 全 INDEX + 部分一意 INDEX `uq_reservations_active` を実装
- `BEGIN IMMEDIATE` トランザクション・PRAGMA `foreign_keys=ON` 等、本物の SQLite 機能をすべて利用可能
- オフラインでも動作（CDN ロード成功後はキャッシュで動作）

#### 方式②: server/ 連携（HTTP 委譲）— 第二選択肢
- `app/js/datasource/api-adapter.js` 新設
- `/api/v1/health` への ping で server/ の起動を疎通確認
- 利用可能なら全 API リクエストを `ApiClient`（CSRF 自動付与）経由で委譲
- 本物の `better-sqlite3` を server 側で利用

#### フォールバック戦略
`RepositoryFactory.create()` の優先順：
1. **SQLiteAdapter** が `isReady()=true` → 採用（sql.js 本実装）
2. **ApiAdapter** が `isAvailable()=true` → 採用（server/ HTTP 委譲）
3. **SQLiteStubAdapter**（旧版互換）
4. **ExcelAdapter**（最終フォールバック）

→ どの環境でも必ず動作。スタブモードバッジは①/②が成功した場合は表示されない。

### 📱 スマホ表示乱れ一括修正
基準端末: **iPhone SE 第3世代（375×667）+ Android 一般（360×800）**

`app/css/v3.0.4-mobile.css` 新設（382行）。以下を一括見直し：

| 画面 | 修正内容 |
|---|---|
| ヘッダナビ | ロゴのみ表示・「図書予約システム」テキスト省略・ユーザー名 ellipsis・PCナビ完全非表示 |
| ログイン | サイドパネル非表示時の余白調整、フォーム最大幅、クリア/ログインボタン横並び固定 |
| 予約状況 | テーブル横スクロール禁止 → カード化、取消ボタンは行末で全幅48px |
| 検索結果 | ページャー折り返し、ボタン最低 38×38px、ステータスバッジ縮小 |
| マイページ | タブ横スクロール対応、JSON ボタン縦並び全幅、危険操作（reset）の赤強調 |
| 全体共通 | タッチ領域 44×44px 確保（WCAG）、iOS 自動ズーム防止（input 16px）、横スクロール禁止 |
| ボトムナビ | スマホ専用ナビ追加（予約/検索/通知/マイ）、`bottom-nav` で画面下固定 |
| 360px 端末 | Android 向け追加微調整（フォント・パディング縮小） |

### Added（新規）
- `app/js/datasource/sqlite-adapter.js`（sql.js 本実装、IndexedDB 永続化）
- `app/js/datasource/api-adapter.js`（HTTP 委譲、CSRF 自動付与経由）
- `app/css/v3.0.4-mobile.css`（スマホ表示乱れ一括修正、382行）
- `test/test-sqlite-adapter.js`（v3.0.4 新規、8/8 PASS）
- ボトムナビ HTML（`<nav class="bottom-nav" data-bottom-nav>`）

### Changed（変更）
- `app/js/core/repository-factory.js`: 優先順 sql.js → server → Stub → Excel
- `app/js/datasource/sqlite-stub-adapter.js`: SQLiteAdapter ready/ApiAdapter available 時はバッジ非表示
- `app/js/header-sync.js`: ボトムナビ表示制御＆アクティブ強調を追加
- `app/index.html`: 新規アダプタ読込、ボトムナビ追加、`viewport-fit=cover`、`theme-color` メタタグ
- `server/package.json`: version 3.0.4

### 検証結果
- v3.0 起因テスト: 7/7 PASS
- v3.0.1 由来テスト: 8/8 PASS
- v3.0.3 既存テスト: 16/16 PASS（CSRF 7 + 予約TX 9）
- v3.0.4 新規テスト: 8/8 PASS（SQLite 本実装）
- **合計: 39/39 PASS（100%）**
- 全 JS ファイル `node --check` PASS（38/38）

---

## 🆕 v3.0.5 本番版 改訂サマリー（2026-05-10）

v3.0.4 をベースに、**カゥン氏指摘・DB 担当指摘・横断整合**を完全反映した本番品質版。

### 🔵 主な変更点
1. **API-06 エンドポイントパス修正**（DB 担当指摘）
   - 旧: `DELETE /api/v1/reservations/:id`
   - 新: `DELETE /api/v1/users/:userId/reservations/:reservationId`
   - パス上の `:userId` とセッション userId の一致確認を追加（不一致時 403 W03）
   - 外部仕様 v4.0a-rev2 §8.4.5 と完全整合
2. **API レスポンス 4 層構造の最終整合**（カゥン氏指摘）
   - `{ result, messageCode, message, data }` を全 API で統一済
   - `response.js` の `ok()/err()` ヘルパが正本（変更なしで完備）
3. **messageCode マスタの拡充**（横断整合）
   - controllers/auth で使用していた W04 / W13 / W18 を `messages.js` に追加
   - 全 15 コード（I00〜I03 / W01〜W04 / W11〜W14 / W17 / W18 / E01）が定義済
4. **クライアント側 ApiAdapter の追従**
   - `app/js/datasource/api-adapter.js` の `cancelReservation` を新パスに更新
5. **新規回帰テスト 3 種を追加**
   - `test-api06-path.js`（API-06 パス・W03 分岐検証、7/7 PASS）
   - `test-message-code-integrity.js`（messageCode 整合検証、5/5 PASS）
   - `test-integration-server.js`（Express + 新パス E2E、6/6 PASS）

### ✅ テスト結果（v3.0.5 / 全 8 スイート 57/57 PASS / 100%）

| # | テスト | 件数 | 結果 |
|---|--------|------|------|
| 1 | test-config-manager.js | 7 | ✅ PASS |
| 2 | test-form-reset.js | 8 | ✅ PASS |
| 3 | test-csrf-client.js | 7 | ✅ PASS |
| 4 | test-reservation-tx.js（SQLite サーバ S-3）| 9 | ✅ PASS |
| 5 | test-sqlite-adapter.js（ブラウザ sql.js）| 8 | ✅ PASS |
| 6 | **test-api06-path.js（v3.0.5 新規）** | 7 | ✅ PASS |
| 7 | **test-message-code-integrity.js（v3.0.5 新規）** | 5 | ✅ PASS |
| 8 | **test-integration-server.js（v3.0.5 新規・E2E）** | 6 | ✅ PASS |
| | **合計** | **57** | **100%** |

加えて全 JS ファイル `node --check` 41/41 OK。

### 🚀 起動方法

#### Excel モード（ブラウザのみ）
```bash
cd library-reservation-system-v3.0.5-final/app
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
# library-system-config.txt の dbType=Excel が SSOT
```

#### SQLite モード（sql.js / ブラウザ）
```bash
# 同上。library-system-config.txt で dbType=SQLite に変更
# sql.js が CDN から WASM をロードし、IndexedDB に永続化
```

#### SQLite サーバモード（Express + better-sqlite3）
```bash
cd library-reservation-system-v3.0.5-final/server
npm install
npm run init-db       # seed: 3 users, 6 books（1 disabled）
npm start             # http://localhost:3000
```

### 🔁 v3.0.4 からの差分ファイル

| ファイル | 変更内容 |
|---------|---------|
| `server/src/routes/index.js` | DELETE ルートを新パスに変更 |
| `server/src/controllers/index.js` | cancel に :userId 一致確認を追加 |
| `server/package.json` | version 3.0.4 → 3.0.5 |
| `app/js/datasource/api-adapter.js` | cancelReservation を新パス呼出に変更 |
| `app/js/core/messages.js` | W04 / W13 / W18 を追加 |
| `test/test-api06-path.js` | **新規**（7 ケース） |
| `test/test-message-code-integrity.js` | **新規**（5 ケース） |
| `test/test-integration-server.js` | **新規**（6 ケース・E2E） |

仕様書 v4.0a-rev2 と完全整合。Git で本番ブランチに mainline 化可能。
