# ADR 一覧（Architecture Decision Records）v3.0

> 作成者: Y.Toyoda / 更新日: 2026-05-04
> 本プロジェクトの重要意思決定の記録。Status: Proposed / Accepted / Rejected / Superseded。

| ADR ID | タイトル | 決定内容 | Status | 決定日 |
|--------|---------|---------|--------|--------|
| ADR-001 | 技術スタック選定 | Node.js 20.x + Express 4.x + Sequelize 6.x + better-sqlite3（構成案B） | Accepted | 2026-04-25 |
| ADR-002 | ストレージ二態運用 | ハイブリッド構成（dbType=Excel / dbType=SQLite）採用 | Accepted | 2026-04-25 |
| ADR-003 | API レスポンス形式 | 四層構造 `{result, messageCode, message, data}` を全API共通 | Accepted | 2026-04-25 |
| ADR-004 | 全ID 型統一 | 全テーブルのPKを INTEGER PRIMARY KEY AUTOINCREMENT に統一 | Accepted | 2026-05-02 |
| ADR-005 | 設定 SSOT | `library-system-config.txt` を SSOT に固定（v3.0 で BUG-01 修正の核） | Accepted | 2026-05-04 |
| ADR-006 | 認証方式 | express-session + connect-sqlite3（JWT 不採用） | Accepted | 2026-05-04 |
| ADR-007 | 論理削除採用範囲 | reservations/loans/users=論理削除、notifications/favorites=物理削除 | Accepted | 2026-05-04 |
| ADR-008 | AUTOINCREMENT 採用理由 | ID 再利用防止（監査要件）。rowid alias は不採用 | Accepted | 2026-05-04 |
| ADR-009 | FK 動作 | 全FK ON DELETE RESTRICT / ON UPDATE CASCADE 統一 | Accepted | 2026-05-04 |
| ADR-010 | WAL モード | SQLite journal_mode=WAL、synchronous=NORMAL を初期化必須 | Accepted | 2026-05-04 |
| ADR-011 | REST化方針 | v3.0 は動詞型/RESTful 型併記、v3.1 で RESTful 本格移行 | Accepted | 2026-05-04 |
| ADR-012 | WCAG 2.1 AA 準拠 | アクセシビリティ目標水準として AA を採用 | Accepted | 2026-05-04 |
| ADR-013 | OWASP Top 10 対策 | 全項目への対応をマトリクス化 | Accepted | 2026-05-04 |
| ADR-014 | ロギング基盤 | winston + daily-rotate-file、JSON 形式、retention 30日 | Accepted | 2026-05-04 |
| ADR-015 | 正本責任分担 | API契約=豊田、Repository実装=カゥン氏、DBスキーマ=共同 | Accepted | 2026-05-04 |
| ADR-016 | 用語統一 | 「利用者」「予約」「貸出」「返却」「キャンセル」を共通用語集で固定 | Accepted | 2026-05-04 |
| ADR-017 | 合否判定基準 | Critical=0、Major≤3、Minor≤10、A11y スコア≥95、合格率≥95% | Accepted | 2026-05-04 |
| ADR-018 | 回帰テスト常設化 | BUG-V2.0(通知既読化)、BUG-V2.1-01(ID重複)の再発防止TCを常設 | Accepted | 2026-05-04 |

## v3.0 で追加された ADR-005 詳細（最重要）

### Context
v2.x で `library-system-config.txt` の `dbType=Excel` が無視される致命バグが発生。
表面1件の裏に3つの独立欠陥（txt 未読込、localStorage 上書き、SSOT 未定義）が連動。

### Decision
設定の優先順位を以下のように明文化し、コードに表現する：
1. `library-system-config.txt`（★ SSOT）
2. `library-system-config.js`（file:// 用 fallback）
3. `LIBRARY_CONFIG_FALLBACK`（ハードコード安全網）
4. `localStorage.lib-config-overrides`（デバッグ専用、既定無効）

`localStorage.lib-config`（旧キー）は v3.0 で廃止し、起動時に自動削除する。

### Consequences
- (+) 利用者が txt を編集すれば確実に設定が反映される
- (+) localStorage の残留データによる事故を根絶
- (+) 後任者が SSOT を即座に理解できる
- (-) ConfigManager.init() が async になり、呼出側で必ず await 必須
