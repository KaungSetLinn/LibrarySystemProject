# 提出物チェックリスト v3.0

> 作成者: Y.Toyoda / 提出予定日: 2026-05-12

## 提出物一覧

| ID | 成果物 | 形式 | 存在確認 | 内容確認 |
|----|-------|------|----------|----------|
| D-01 | 要求仕様書 v3.0 最終版 | .docx | ☐ | ☐ |
| D-02 | 外部仕様書 v3.0 最終版 | .docx | ☐ | ☐ |
| D-03 | 内部仕様書 v3.0 最終版 | .docx | ☐ | ☐ |
| D-04 | DB仕様書 v3.0 最終版 | .docx | ☐ | ☐ |
| D-05 | テスト仕様書 v3.0 最終版 | .docx | ☐ | ☐ |
| D-06 | テストチェックリスト v3.0 | .xlsx | ☐ | ☐ |
| D-07 | Web アプリ v3.0 最終版（app/ + server/） | .zip | ☐ | ☐ |
| D-08 | 6ペルソナ仕様書レビュー議事録 | .docx | ☐ | ☐ |
| D-09 | バグ調査報告書（v2.x→v3.0） | .txt | ☐ | ☐ |
| D-10 | 6ペルソナコードレビュー議事録 | .txt | ☐ | ☐ |

## 内容確認チェック

### コード品質
- ☐ 全関数に JSDoc 完全形（@param @returns @throws @spec @example）
- ☐ 全ファイルにヘッダコメント（@author Y.Toyoda / @version v3.0 / 改訂履歴）
- ☐ 全関数にトレーサビリティコメント（仕様書ID @spec タグ）
- ☐ console.log の散在なし（共通 Logger 経由）
- ☐ innerHTML 直接使用なし（escapeHTML 経由 or textContent）

### バグ修正確認
- ☐ BUG-01 (txt未読込) 修正済み
- ☐ BUG-02 (localStorage 上書き) 修正済み
- ☐ BUG-V2.0 (通知既読化) 修正済み + 回帰テスト常設
- ☐ BUG-V2.1-01 (ID 重複) 修正済み + 回帰テスト常設
- ☐ 18 バグ全件 v3.0 で反映完了

### 動作確認
- ☐ app/index.html をブラウザで開いて起動成功
- ☐ ログイン (1 / 佐藤翔太) 成功
- ☐ 書籍検索 → 予約 → キャンセル の一連動作
- ☐ 通知一覧 → クリック既読化 → バッジ即時更新
- ☐ マイページ → JSON 出力 / 取込 / 初期化（二段階確認）
- ☐ DB 切替 (Excel / SQLite スタブ) 動作
- ☐ server/ 起動 (`npm install && npm run init-db && npm start`)
- ☐ http://localhost:3000/api/v1/auth/login が四層構造応答

### 合否判定基準（テスト仕様書 §6 / ADR-017）
- ☐ Critical 不具合 = 0 件
- ☐ Major 不具合 ≤ 3 件
- ☐ Minor 不具合 ≤ 10 件
- ☐ TC 合格率 ≥ 95%
- ☐ axe-core A11y スコア ≥ 95

### ドキュメント
- ☐ README.md（起動手順 + dbType SSOT 説明）
- ☐ CHANGELOG.md（v3.0 変更点）
- ☐ docs/architecture.md
- ☐ docs/known-issues.md
- ☐ docs/lessons-learned.md
- ☐ docs/glossary.md
- ☐ docs/adr/ ADR-001〜018

### ZIP パッケージング
- ☐ UTF-8 フラグ付き ZIP（日本語ファイル名文字化けなし）
- ☐ Windows 標準エクスプローラで解凍可能
- ☐ macOS Finder で解凍可能
- ☐ Linux unzip で解凍可能
