# 既知の問題と回避策（Known Issues）v3.0

> 作成者: Y.Toyoda / 更新日: 2026-05-04
> 本ファイルは「過去のハマり」を記録し、後任者の同じ失敗を防ぐためのもの。

## v3.0 で解消済み（参考記録）

### KI-01 dbType=Excel が無視される（v2.x 致命バグ）
- **症状**: `library-system-config.txt` に `dbType=Excel` と書いても、起動すると SQLite を要求する。
- **原因**: txt ファイルを読み込むコードが存在しなかった + localStorage の SQLite 値が優先されていた。
- **回避策（v2.x）**: ブラウザのコンソールで `localStorage.removeItem("lib-config")` 実行後リロード。
- **v3.0 対応**: `ConfigManager.init()` を async 化、txt を fetch。localStorage 永続化を廃止。

### KI-02 通知既読化が反映されない（BUG-V2.0）
- **症状**: 既読化 API が成功しても画面表示が変わらず、リロードで初めて反映。
- **回避策（v2.0）**: 既読化後にページリロード。
- **v3.0 対応**: `_normalizeNotification` で is_read を boolean 統一、即時 DOM クラス切替。

### KI-03 ID 重複（BUG-V2.1-01）
- **症状**: localStorage クリア後に予約すると、既存IDと衝突する。
- **回避策（v2.1）**: `localStorage.clear()` で全消去後に再起動。
- **v3.0 対応**: `_nextSeq` の先頭で `_scanMaxId` を必ず実行。

## v3.0 時点で残る制限（仕様）

### KL-01 file:// で `library-system-config.txt` の fetch が拒否される環境
- **症状**: HTML をダブルクリックで開いた際、Chrome 等が CORS で fetch を拒否。
- **対応**: `library-system-config.js` を fallback として読込（自動）。
- **推奨**: ローカル Web サーバ経由（`python3 -m http.server` 等）で起動、または `server/` モード使用。

### KL-02 BroadcastChannel 未対応ブラウザ
- **症状**: 古い Safari 等で複数タブ同期が効かない。
- **対応**: 致命停止せず、storage イベントで部分的に同期。

### KL-03 監査ログ容量
- **症状**: localStorage に保存できる監査ログは最大 5000 件。
- **対応**: FIFO 削除で自動圧縮。長期運用時は `mypage > データ管理 > JSON 出力` で外部保存推奨。

### KL-04 SPA hash 遷移
- **症状**: URL に `#/login` 等が付く（History API 不採用）。
- **対応**: file:// でも動かすための仕様。気になる場合は `server/` 起動 + history 化（v3.1 検討）。

---

## v3.0.3 で文書化した既知の制限・リスク

### KL-05 簡易認証モード（A-6）
- **症状**: ログインは利用者ID＋利用者名のみで成立。パスワード照合・アカウントロックアウト・権限ロール詳細制御は未実装。
- **影響**: 利用者IDと氏名さえ知られれば、第三者がログイン可能。
- **対応**: v3.x は教育・デモ用途専用。本番運用には EX-01（bcrypt+salt によるID＋パスワード認証）への移行が必須。
- **構造的準備**: `users.password_hash` 列は v3.0.3 で追加済み（NULL許容、未使用）。`bcryptjs` 依存も登録済み。
- **暫定運用**: HTTPS必須、CSRF/SameSite=Strict・rate-limit 等のレイヤで侵入難度を引き上げる。

### KL-06 localStorage の改ざん可能性（A-7）
- **症状**: ブラウザ単体動作モード（dbType=Excel）では、予約・利用者・監査ログがすべて利用者端末の `localStorage` に保存される。
- **影響**: 利用者は DevTools から自由にデータを書換可能。
- **対応**: ブラウザ単体モードは **デモ・教育用途専用**。本番運用には server/ モード（Express + better-sqlite3）が必須。
- **起動時通知**: v3.0.3 で `console.info` による通知を追加（ExcelAdapter 末尾）。

### KL-07 タブ間排他制御の限界（A-8）
- **症状**: ブラウザ単体モードの `_locked` フラグは同一タブ内のみ有効。`BroadcastChannel` は通知用であり、真の分散ロックではない。
- **影響**: 複数タブで同時に同じ書籍を予約すると、両方が成功する可能性がある（同一タブ内の連打は防止可能）。
- **対応**: server/ モードでは DB 側 UNIQUE INDEX `uq_reservations_active`（v3.0.3 追加）で物理的に1件に制限。
- **将来計画 (v3.1)**: Web Locks API または IndexedDB トランザクションへの移行を検討（risk-register.md 参照）。

### KL-08 SQLite モードはブラウザ単体ではスタブ（S-1）
- **症状**: `dbType=SQLite` 設定時、ブラウザ単体動作では `SQLiteStubAdapter` が `ExcelAdapter` に処理を委譲（実体はlocalStorage）。
- **対応**: v3.0.3 で起動時の console.warn と画面右下バッジ表示を追加。
- **本番**: 実 SQLite を使う場合は server/ モード（Express + better-sqlite3）を起動すること。

### KL-09 ExcelAdapter の巨大化（C-13）
- **症状**: `app/js/datasource/excel-adapter.js` が約 1019 行。テーブル横断の複数責務が集中。
- **対応**: v3.0.3 では未着手（リスク回避）。v3.1 で `excel-adapter-users.js / -books.js / -reservations.js / -audit.js / -core.js` への分割を計画。

### KL-10 設定ファイルの二重管理（C-15）
- **症状**: `library-system-config.txt`（SSOT）と `library-system-config.js`（file:// fallback）に同じ値を手動で揃える必要がある。
- **対応**: ConfigManager に整合性チェック警告（読込み時に不一致を検出）あり。v3.1 でビルド時 txt→js 自動生成を計画。
