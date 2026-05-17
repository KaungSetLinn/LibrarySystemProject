# アーキテクチャ概要 v3.0

> 作成者: Y.Toyoda / 更新日: 2026-05-04

## 全体構成（モード別）

```
┌────────────────────────────────────────────────────────────┐
│ モード①: ブラウザ単体（dbType=Excel / app/ のみ）          │
│                                                              │
│   Browser ─ index.html (SPA)                                │
│      ↓ Router (hash遷移)                                     │
│   Screen層 (login / reservation-status / search / notify…) │
│      ↓                                                       │
│   Service層 (authenticate / reserveBook / …)                │
│      ↓                                                       │
│   RepositoryFactory ─ ConfigManager.dbType                  │
│      ↓                                                       │
│   ExcelAdapter ─→ localStorage                              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ モード②: Express サーバー（dbType=SQLite / server/ 追加）  │
│                                                              │
│   Browser ─ HTTP (/api/v1/*) ─→ Express ─ helmet/csurf/…  │
│      ↓                                                       │
│   Controller (四層構造応答)                                  │
│      ↓                                                       │
│   Service層                                                  │
│      ↓                                                       │
│   better-sqlite3 ─→ data/library.db (PRAGMA WAL/FK)        │
└────────────────────────────────────────────────────────────┘
```

## 設定解決経路（dbType SSOT）

```
[起動]
  │
  ├─1️⃣ fetch("library-system-config.txt") ────► ★ SSOT ★
  │   └─失敗時──► 2️⃣
  │
  ├─2️⃣ window.LIBRARY_CONFIG_FILE_JS ────────► file:// fallback
  │   └─未読込時──► 3️⃣
  │
  ├─3️⃣ window.LIBRARY_CONFIG_FALLBACK ────────► ハードコード安全網
  │
  └─4️⃣ localStorage.lib-config-overrides ────► デバッグ専用 (任意)
```

## モジュール責務

| 層 | モジュール | 責務 |
|----|-----------|------|
| 起動 | `app.js` | bootApp / async ConfigManager.init / Router 起動 |
| Core | `logger.js` | レベル制御 + マスク |
| Core | `messages.js` | messageCode マスタ |
| Core | `config-manager.js` | ★ dbType SSOT 解決の核 ★ |
| Core | `repository-factory.js` | dbType に応じた Repository 切替 |
| Core | `service.js` | 業務ロジック / セッション管理 |
| Core | `ui-common.js` | Toast / Empty State / aria-* |
| Core | `router.js` | SPA hash ルーティング |
| Data | `excel-adapter.js` | localStorage Repository（_withLock + _scanMaxId） |
| Data | `sqlite-stub-adapter.js` | SQLite スタブ（ExcelAdapter 委譲） |
| Screen | `screen-*.js` | 6画面の view + init + teardown |

## 並行性制御

- 同タブ内：`_withLock` フラグ + try/finally でスナップショットロールバック
- タブ間：`BroadcastChannel("lib-tx")` + `storage` event で commit/rollback ブロードキャスト
- SQLite：`PRAGMA journal_mode=WAL` + `busy_timeout=5000`
