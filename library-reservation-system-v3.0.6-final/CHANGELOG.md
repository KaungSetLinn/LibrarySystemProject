# Changelog

本プロジェクトの全注目すべき変更を記録します。形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠。

## [3.0.6] — 2026-05-11（v4.0a-rev3 完全反映 / favorites CRUD + 通知既読化 本実装）

### 🔵 主な変更点
- **favorites CRUD 本実装**（v4.0a-rev3 §8.4.11/12/13 反映）
  - `GET    /api/v1/users/:userId/favorites`（API-11、ページング対応 page/pageSize）
  - `POST   /api/v1/users/:userId/favorites`（API-12、**201 Created** で I05 を返却）
  - `DELETE /api/v1/users/:userId/favorites/:favoriteId`（API-13、本人確認＋404/403）
- **通知既読化 API 本実装**（v4.0a-rev3 §8.4.14 反映）
  - `POST /api/v1/users/:userId/notifications/:notificationId/read`（API-14、冪等動作・audit_log 記録）
- **3 層アダプタ統一**: ApiAdapter / SQLiteAdapter (sql.js) / ExcelAdapter すべてで同一 messageCode 体系
- **messageCode W19 追加**: 「既にお気に入りに登録されています。」（外部仕様 §8.4.12 整合）
- **DB スキーマ拡張**: `favorites` テーブル新設（PK=favorite_id, UNIQUE(user_id, book_id), idx_favorites_user）
- **schemaVersion 更新**: 3.0.3 → 3.0.6
- **package.json**: 3.0.5 → 3.0.6

### Added（新規追加）
- `test/test-favorites-api.js`（10 ケース：CRUD 全パス・W19 重複・W17 不在・W03 他者・E01 バリデーション）
- `test/test-notification-read.js`（6 ケース：既読化・冪等性・DB状態・audit_log・W17/W03）
- グローバルエラーハンドラ（テスト用最小サーバ）：`_validate` 例外を四層構造応答に統一変換

### Changed
- `app/js/datasource/api-adapter.js` v3.0.4 → v3.0.6（4 メソッド本実装化、プレースホルダ撤廃）
- `app/js/datasource/sqlite-adapter.js`：listFavorites/addFavorite/removeFavorite/markNotificationRead を ServiceResult 形式に統一
- `app/js/datasource/excel-adapter.js`：addFavorite で書籍存在確認（W17）追加、removeFavorite を favoriteId 引数に変更（後方互換あり）
- `server/src/controllers/index.js` v3.0.5 → v3.0.6：4 新規ハンドラ＋validators.favoriteAdd 追加、getMyPage に favorites 実データ反映
- `server/src/routes/index.js`：API-11/12/13/14 のルート追加
- `server/src/utils/db.js`：favorites テーブル CREATE 文追加
- `server/scripts/init-db.js`：schemaVersion 3.0.6 化

### Tests（v3.0.6 最終結果）
- **10 スイート 73 PASS / 0 FAIL**（100%）
  - test-config-manager.js: 7/7
  - test-form-reset.js: 8/8
  - test-csrf-client.js: 7/7
  - test-reservation-tx.js: 9/9
  - test-sqlite-adapter.js: 8/8
  - test-api06-path.js: 7/7
  - test-message-code-integrity.js: 5/5
  - test-integration-server.js: 6/6
  - **test-favorites-api.js: 10/10**（v3.0.6 新規）
  - **test-notification-read.js: 6/6**（v3.0.6 新規）

## [3.0.5] — 2026-05-10（本番品質版 / カゥン氏・DB担当指摘 完全反映）

### 🔵 主な変更点
- **API-06 エンドポイントパス変更**（DB 担当指摘 / 外部仕様 v4.0a-rev2 §8.4.5 整合）
  - `DELETE /api/v1/reservations/:id` → `DELETE /api/v1/users/:userId/reservations/:reservationId`
  - パス上 `:userId` とセッション userId の不一致時 403 W03 を返す分岐を追加
- **messageCode マスタ拡充**: W04（検索条件全空）、W13（書籍利用停止）、W18（処理競合）を `messages.js` に追加
- **クライアント側 ApiAdapter 追従**: `cancelReservation()` を新パス呼出に更新
- **package.json**: 3.0.4 → 3.0.5

### Added（新規追加）
- `test/test-api06-path.js`（7 ケース、API-06 新パス・W03 分岐の静的検証）
- `test/test-message-code-integrity.js`（5 ケース、コード/マスタ整合性検証）
- `test/test-integration-server.js`（6 ケース、Express + 新パス E2E 統合テスト）

### Changed
- `server/src/routes/index.js`: DELETE ルートを新パスに変更、改訂履歴に v3.0.5 行追加
- `server/src/controllers/index.js`: `cancel` に `req.params.userId` と `session.userId` の一致確認を追加
- `app/js/datasource/api-adapter.js`: `cancelReservation` を新パス呼出に変更
- `app/js/core/messages.js`: W04 / W13 / W18 を追加、W03 文言を「他者のリソースにはアクセスできません」に統一
- `server/package.json`: version 3.0.4 → 3.0.5
- `README.md`: v3.0.5 改訂サマリーを追記

### ✅ テスト結果（57/57 PASS / 100%）
- test-config-manager.js: 7/7
- test-form-reset.js: 8/8
- test-csrf-client.js: 7/7
- test-reservation-tx.js: 9/9
- test-sqlite-adapter.js: 8/8
- **test-api06-path.js: 7/7（新規）**
- **test-message-code-integrity.js: 5/5（新規）**
- **test-integration-server.js: 6/6（新規・E2E）**
- 全 JS `node --check`: 41/41 OK

### 仕様書整合
- 外部仕様 v4.0a-rev2 §8.3 / §8.4.5 と完全整合
- 内部仕様 v4.0a-rev2 §7 / 要求仕様 v4.0a-rev2 §6 と完全整合
- DB 仕様 v4.0a（変更なし）と整合

---

## [3.0.4] — 2026-05-05（SQLite 本実装化 + スマホ表示乱れ一括修正）

### 🔵 SQLite 本実装化（S-1 解消の最終形）
v3.0.3 までは `dbType=SQLite` でも実体は `ExcelAdapter` 委譲スタブだったが、
v3.0.4 で**実際に SQLite を動かす 2 方式**を実装し、3 段階フォールバックで
どの環境でも必ず動作するようにした。

### Added（新規追加）
- **`app/js/datasource/sqlite-adapter.js`**（sql.js / WASM SQLite 本実装、
  IndexedDB 永続化、9テーブル + 部分一意 INDEX + BEGIN IMMEDIATE トランザクション）
- **`app/js/datasource/api-adapter.js`**（server/ への HTTP 委譲、
  `ApiClient` 経由で CSRF 自動付与、`/api/v1/health` ping で疎通確認）
- **`app/css/v3.0.4-mobile.css`**（スマホ表示乱れ一括修正、382行）
- **`test/test-sqlite-adapter.js`**（SQLite 本実装の論理検証、8/8 PASS）
- ボトムナビ HTML（`<nav class="bottom-nav" data-bottom-nav>`、スマホ専用）
- `viewport-fit=cover` / `theme-color` メタタグ（index.html）

### Changed（変更）
- **`app/js/core/repository-factory.js`**: 優先順を sql.js → server → Stub → Excel に整理
- **`app/js/datasource/sqlite-stub-adapter.js`**:
  - SQLiteAdapter `isReady()=true` または ApiAdapter `isAvailable()=true` の
    いずれかが満たされる場合、スタブモードバッジを表示しない
  - 起動時の遅延を 200ms → 1500ms に延長（sql.js WASM ロード完了を待つ）
- **`app/js/header-sync.js`**: ボトムナビ同期 + アクティブ強調（is-active / aria-current）
- **`app/index.html`**: 新規アダプタ読込、ボトムナビ追加、メタタグ追加
- **`server/package.json`**: version 3.0.4

### 📱 スマホ表示乱れ一括修正
基準端末: **iPhone SE 第3世代（375×667）+ Android 一般（360×800）**
追加微調整: 380px 以下の小型端末

| 画面 | 修正内容 |
|---|---|
| ヘッダナビ | ロゴのみ表示・テキスト省略・ユーザー名 ellipsis・PCナビ完全非表示 |
| ログイン | サイドパネル非表示時の余白調整、フォーム最大幅、ボタン横並び固定 |
| 予約状況 | テーブル横スクロール禁止 → カード化、取消ボタンは行末全幅48px |
| 検索結果 | ページャー折り返し、ボタン最低 38×38px、バッジ縮小 |
| マイページ | タブ横スクロール対応、JSONボタン縦並び全幅、危険操作の赤強調 |
| 全体共通 | タッチ領域 44×44px 確保、iOS 自動ズーム防止、横スクロール禁止 |
| ボトムナビ | スマホ専用ナビ追加（予約/検索/通知/マイ）、画面下固定 |

### Fixed（バグ修正）
- スマホでヘッダのロゴ・ナビ・ユーザー名が重なって読めなくなる問題
- スマホで予約状況テーブルが横スクロール → ボタン重なりで操作不能になる問題
- スマホで検索結果のページャーがはみ出す問題
- スマホでマイページのタブ・JSON ボタンが画面外にはみ出す問題
- iOS Safari で input フォーカス時に自動ズームが発生する問題

### 検証結果
- test-config-manager.js (v3.0): 7/7 PASS
- test-form-reset.js     (v3.0.1): 8/8 PASS
- test-csrf-client.js    (v3.0.3): 7/7 PASS
- test-reservation-tx.js (v3.0.3): 9/9 PASS
- **test-sqlite-adapter.js (v3.0.4 新規)**: **8/8 PASS**
- **合計: 39/39 PASS（100%）**
- 全 JS ファイル `node --check` PASS（38/38）

---


本プロジェクトの全注目すべき変更を記録します。形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠。

## [3.0.3] — 2026-05-05（コードレビュー反映パッチ）

「図書予約システム v3.0.1 ソフトウェア設計書（コードレビュー付き）」の指摘15件を完全反映。

### 🔴 Fixed（Critical 修正）
- **S-1 SQLite スタブモード非実体化**: `dbType=SQLite` 選択時に起動時 console.warn と画面右下のスタブモードバッジを表示。`README.md` / `docs/known-issues.md` (KL-08) に明記。
- **S-2 Helmet CSP / インライン要素不整合**: `app/index.html` のインライン `<style>` を `app/css/v3-additions.css` に移設、インライン `<script>` を `app/js/header-sync.js` に分離。CSP nonce/hash 設定なしでも `helmet()` のデフォルト方針に整合。
- **S-3 予約 API の業務ロジック不足**: サーバ側 `POST /api/v1/reservations` を `db.transaction()` でラップし、書籍存在確認・利用停止チェック（`is_disabled`）・重複・上限・監査ログを原子化。DB 側に部分一意 INDEX `uq_reservations_active` を追加。

### 🟠 Fixed（High 修正）
- **A-4 フロントとAPI契約不一致**: `server/src/routes/index.js` に `GET /books/search` `GET /books/:bookId` `GET /users/:userId/dashboard` `GET /users/:userId/mypage` `GET /users/:userId/notifications` `GET /health` を追加。`controllers/index.js` に対応関数を実装。
- **A-5 CSRF トークン連携の未実装**: フロント新規ファイル `app/js/core/api-client.js` を追加。起動時に `/api/v1/csrf-token` から取得 → メモリ保持 → 全 POST/PUT/DELETE/PATCH 時に `X-CSRF-Token` ヘッダ自動付与。403/419 時はトークン破棄して1回だけ自動リトライ。
- **A-6 認証方式の脆弱性**: 「簡易認証モード」と README/known-issues.md に明記。`users.password_hash` 列を追加（NULL許容、構造のみ）。`controllers/index.js` の `login()` に `// TODO(EX-01): bcrypt.compareSync` コメント。
- **A-7 localStorage の改ざん可能性**: ブラウザ単体動作モード = デモ専用 を起動時 console.info（ExcelAdapter 末尾）と `docs/known-issues.md` (KL-06) に明記。
- **A-8 localStorage の排他制御不足**: `_locked` の同一タブ限界を `docs/known-issues.md` (KL-07) に明記。v3.1 で Web Locks API 移行を `risk-register.md` (R-13) に計画登録。

### 🟡 Fixed（Medium 修正）
- **B-9 Repository 層の迂回参照**: `Service.getBookById()` を新設、`screen-reservation-status.js` の `_findBook()` から `localStorage.getItem("lib-books")` 直接参照を排除。`ExcelAdapter.findBookById()` も追加。
- **B-10 サーバ DB パスの CWD 依存**: `server/src/utils/db.js` の `DB_PATH` を `path.join(__dirname, "..", "..", "data", "library.db")` に変更。`init-db.js` も同様に絶対パス化。
- **B-11 init-db のクリーンアップ不足**: `library.db` / `library.db-wal` / `library.db-shm` / `sessions.sqlite` / `sessions.sqlite-wal` / `sessions.sqlite-shm` の6点を削除対象に拡張。
- **B-12 ドキュメントと実装の不整合**: 旧 v3.0.0 セクションの「innerHTML全廃」「インラインスクリプト廃止」「ESMベース」等の過剰表現を本リリースで訂正。

### 🟢 Fixed（Low 改善）
- **C-13 ExcelAdapter の巨大化**: `docs/known-issues.md` (KL-09) と `risk-register.md` (R-14) に v3.1 で5ファイル分割計画を登録。
- **C-14 エラーハンドリングの過度な抑制**: `docs/coding-rules.md` に **LL-10 エラー握り潰し禁止規約**を追加（空 catch 禁止、2系統ログ必須、致命的エラー基準、テスト要件）。
- **C-15 設定ファイルの二重管理**: 既存の整合性チェック警告を保持。`docs/known-issues.md` (KL-10) と `risk-register.md` (R-15) に v3.1 でビルド時 txt→js 自動生成計画を登録。

### Added（新規追加）
- `app/js/core/api-client.js`（A-5）— CSRF 自動付与 fetch wrapper
- `app/js/header-sync.js`（S-2）— ヘッダ表示制御（インライン分離）
- `test/test-csrf-client.js`（v3.0.3 新規）— ApiClient のトークン取得・付与・リトライ検証
- `test/test-reservation-tx.js`（v3.0.3 新規）— 予約 API のトランザクション・書籍状態チェック・部分一意INDEX 検証
- DB 部分一意 INDEX `uq_reservations_active`（S-3）
- `users.password_hash` 列（A-6 / EX-01 構造のみ）
- 6冊目 seed データ「旧版・古い書籍」`is_disabled=1`（S-3 検証用）

### Changed（変更）
- `server/src/controllers/index.js` 全面リライト（トランザクション化、新規API、監査ログ）
- `server/src/routes/index.js` ルート追加
- `server/src/utils/db.js` 絶対パス化、INDEX/列追加
- `server/scripts/init-db.js` クリーンアップ拡張、絶対パス化
- `app/js/core/service.js` `getBookById()` 追加
- `app/js/datasource/excel-adapter.js` `findBookById()` 追加、デモモード通知
- `app/js/datasource/sqlite-stub-adapter.js` スタブ警告とバッジ表示
- `app/js/screens/screen-reservation-status.js` `_findBook()` を Service 経由化
- `app/index.html` インライン要素削除、外部 CSS/JS 参照化
- `app/css/v3-additions.css` スプラッシュ・noscript・スタブバッジ CSS 追記
- `README.md` v3.0.3 改訂サマリと簡易認証注記を追加
- `docs/known-issues.md` KL-05〜KL-10 追記
- `docs/coding-rules.md` LL-10 規約追加
- `docs/risk-register.md` R-11〜R-15 追加
- `server/package.json` version: "3.0.3"

### 検証結果
- v3.0 起因テスト: 7/7 PASS（test-config-manager.js）
- v3.0.1 由来テスト: 8/8 PASS（test-form-reset.js）
- v3.0.3 新規テスト: 7/7 PASS（test-csrf-client.js / test-reservation-tx.js）
- 全 JS ファイル `node --check` PASS（フロント12ファイル、サーバ10ファイル）

---

## [3.0.2] — 2026-05-05（仕様書 v4.0 整合パッチ）

### Changed
- 版数を 3.0.2 へ昇格（仕様書 v4.0 最終版 と同期）
- 実装コードは v3.0.1 から無変更

---

## [3.0.1] — 2026-05-04（パッチリリース）

### Fixed
- **BUG-19** 致命: ログイン画面「入力をクリア」後にブラウザ名が消えて二度と表示されない
  → `form.reset()` 直後に `fillBrowserFields()` を再呼出
- **BUG-20** 致命: クリアで DB種別セレクトが先頭値に戻り、表示と `ConfigManager.dbType` が乖離
  → `form.reset()` 直後に `dbTypeSelect.value = ConfigManager.get("dbType")` で再同期
- **BUG-21** 重大: 詳細検索画面のクリアで sort セレクトが先頭値に戻り、意図と乖離
  → `form.reset()` 直後に `sortSel.value = "bookId"` で明示再代入
- **BUG-22** 重大: `form.reset()` 使用時の設定サマリ再描画規約不備
  → `refreshSummary()` を併せて明示呼出・規約 LL-09 として文書化
- **BUG-23** 軽微: クリア完了がスクリーンリーダーに伝わらない
  → `showMessage("info", ...)` で aria-live 経由の a11y 通知を追加

### Added
- `docs/coding-rules.md` 新設。LL-09 規約化
- `test/test-form-reset.js` 新設

---

## [3.0.0] — 2026-05-04（メジャーリリース）

### Added
- `app/` ブラウザ単体動作モード（library-system-config.txt SSOT）
- `server/` Express + better-sqlite3 サーバーモード
- 全関数 JSDoc 完全形（`@param`/`@returns`/`@throws`/`@spec`/`@example`）
- 仕様書トレーサビリティコメント（`@spec RF-xx`, `CFxx`, `BUG-xx`）

### Fixed
- BUG-01〜BUG-15 / BUG-V2.0-01 / BUG-V2.1-01 を全件解消
- dbType=Excel なのに SQLite を要求するバグを構造的に排除

### Note（v3.0.3 訂正 — B-12）
過去リリースノートに記載された「innerHTML全廃」「インラインスクリプト廃止」「ESMベース」等は
実装と乖離していたため v3.0.3 で訂正。実態としては：
- innerHTML は一部画面で limited 使用（escapeHTML を併用）
- インラインスクリプトは v3.0.3 で完全分離（S-2）
- スクリプト読込は CommonJS 風の `<script src>` 順序読込（ESM ではない）
