# 共通用語集（Glossary）v3.0

> 作成者: Y.Toyoda / 更新日: 2026-05-04
> 本用語集は v3.0 における **唯一の真実（SSOT）**。全ファイル・全仕様書はここを参照する。

| 用語 | 定義 |
|------|------|
| 利用者 | 本システムを利用する学生・教職員。「ユーザー」「学生」「会員」「メンバー」は v3.0 で「利用者」に統一。 |
| 予約 | 貸出可能な書籍に対し、利用者が貸出枠を確保する行為。`reservations` テーブルで管理。 |
| 貸出 | 予約済または直接貸出可能な書籍を利用者が借りる行為。`loans` テーブルで管理。 |
| 返却 | 貸出中の書籍を利用者が返却する行為。`loans.status` を `RETURNED` に更新。 |
| キャンセル | 予約済の書籍について、利用者が予約を取り消す行為。`reservations.status=CANCELED`。 |
| ホールド | 予約状態の別称。本仕様書では「予約」に統一し、ホールドは使用しない。 |
| お気に入り | 利用者が後で読みたい書籍をマークする機能。`favorites` テーブル。 |
| 通知 | 予約完了/貸出可能/返却期限等を利用者に伝える機能。`notifications` テーブル。 |
| API | Application Programming Interface。本システムでは HTTP/JSON ベース REST API。 |
| エンドポイント | API の URL パス。本システムでは `/api/v1/` プレフィックスを採用。 |
| 四層構造 | 本システムの API レスポンス共通形式。`{result, messageCode, message, data}` の4フィールド。 |
| messageCode | メッセージ識別コード。`/^[IWE][0-9]{2}$/` パターン。I=Info, W=Warning, E=Error。 |
| トランザクション | DBの一連の処理を不可分単位で実行する仕組み。本システムは BEGIN IMMEDIATE 採用。 |
| ハイブリッド構成 | dbType=Excel（localStorage 経由）／dbType=SQLite（server/ 経由）の二態運用構成。 |
| 論理削除 | DELETE文ではなく `deletedAt` 列に削除日時を入れる削除方式。`reservations / loans / users` で採用。 |
| AUTOINCREMENT | SQLite の整数主キー自動採番。削除済みID再利用を防ぐため明示採用（ADR-008）。 |
| WCAG 2.1 AA | Web Content Accessibility Guidelines 2.1 AA レベル。本システムが目標とするアクセシビリティ準拠水準。 |
| OWASP Top 10 | Open Web Application Security Project が定める Web 脆弱性 Top 10。本システムのセキュリティ対策基準。 |
| ADR | Architecture Decision Record。重要意思決定の記録。本システムでは ADR-001〜018 を巻末付録に記載。 |
| SSOT | Single Source of Truth。設定や用語の「唯一の真実」となる場所。本 v3.0 では設定 SSOT は `library-system-config.txt`。 |
| BroadcastChannel | ブラウザの Web API。同じ origin の複数タブ間で双方向メッセージングを行う。v3.0 で並行性制御に使用。 |
| Toast | 画面隅に一定時間表示される短い通知 UI。v3.0 で `alert()` の代替として導入。 |
| Empty State | データが空のときに表示される案内 UI（アイコン+説明+CTA）。v3.0 で標準化。 |
