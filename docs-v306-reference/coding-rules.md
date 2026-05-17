# コーディング規約 v3.0.1

> 作成者: Y.Toyoda / 更新日: 2026-05-04
> 全コード（app/ + server/）は本規約に従う。違反は v3.0.1 以降のレビューで指摘対象。

## 規約一覧

| ID | 種別 | 概要 |
|----|------|------|
| LL-01 | 設計 | SSOT を最初から明文化する |
| LL-02 | 実装 | 状態変更系メソッドは正規化関数を経由 |
| LL-03 | 実装 | 採番器は MAX(id) を起動時に必ず同期 |
| LL-04 | 運用 | 5仕様書とコードのバージョンは同時更新 |
| LL-05 | 文書 | 用語は最初から SSOT 化 |
| LL-06 | 設計 | localStorage は SSOT にしない |
| LL-07 | 文書 | 仕様の核心定義は独立章に置く |
| LL-08 | 実装 | 全関数に JSDoc + 仕様書トレーサビリティ |
| **LL-09** | **実装** | **`form.reset()` 使用時の必須セット**（v3.0.1 新設） |

---

## LL-09 詳細：`form.reset()` 使用時の必須セット

### 背景
v3.0 で **BUG-19〜BUG-23** が連続発生。すべての原因は同一：
> `form.reset()` は `<input value>` の **HTML 既定値**に戻すため、
> JS で動的に埋めた値（`detectBrowser()` 結果、`ConfigManager.get()` 結果等）は
> 一律で消える。再描画関数を呼ばない限り**二度と表示されない**。

### 必須遵守事項
`form.reset()` を呼び出す箇所では、以下を**ペアで**実行する：

#### 1. JS で動的に埋めた input の再描画関数を呼ぶ
```javascript
form.reset();
if (typeof fillBrowserFields === "function") fillBrowserFields();
```

#### 2. `<select>` の初期表示値を明示的に再代入する
```javascript
form.reset();
const sortSel = document.getElementById("sort");
if (sortSel) sortSel.value = "bookId";   // 既定値を明示
```

#### 3. 設定サマリ等の `<span>` も再描画する
```javascript
form.reset();
refreshSummary();   // <span data-config-summary> を再描画
```

#### 4. アクセシビリティのため、クリア完了を `aria-live` 経由で通知する
```javascript
form.reset();
if (typeof showMessage === "function") {
  showMessage("info", "入力をクリアしました。");
}
```

### 代替方針
`form.reset()` を使わず、**個別の `value = ""` でクリア**する方針も可。
（`screen-mypage._onReset` がこの方針を採用）

```javascript
// 代替例：必要なフィールドだけ手動でクリア
document.getElementById("userId").value   = "";
document.getElementById("userName").value = "";
// dbTypeSelect、ブラウザ名は意図的に触らない
```

### コードレビュー時のチェックリスト

`form.reset()` を含む PR では以下を必ず確認：

- [ ] フォーム内に `data-*` 属性経由で動的に埋める input があるか？ → 再描画ペア必須
- [ ] フォーム内に `<select>` があるか？ → 既定値の明示再代入必須
- [ ] reset 後の状態がユーザー期待と一致するか？
- [ ] aria-live 通知を出しているか？
- [ ] sessionStorage / localStorage の関連キーを併せてクリアすべきか確認したか？

### 違反時の対処
レビューで違反が見つかった場合、**そのままマージせず修正を依頼**する。
本規約は v3.0.1 以降の必須項目。

---

## 適用済み修正一覧（v3.0 → v3.0.1）

| BUG-ID | 対象ファイル | 修正内容 |
|--------|-------------|---------|
| BUG-19 | `app/js/screens/screen-login.js` | `form.reset()` 後に `fillBrowserFields()` 再呼出 |
| BUG-20 | `app/js/screens/screen-login.js` | `form.reset()` 後に `dbTypeSelect.value = ConfigManager.get("dbType")` |
| BUG-21 | `app/js/screens/screen-advanced-search.js` | `form.reset()` 後に `sort` セレクトの既定値再代入 |
| BUG-22 | `app/js/screens/screen-login.js` | `refreshSummary()` 再呼出（規約徹底のため明示） |
| BUG-23 | `app/js/screens/screen-login.js` / `screen-advanced-search.js` | `showMessage("info", ...)` で a11y 通知 |

---

## LL-10 エラー握り潰し禁止規約（v3.0.3 / C-14）

### 目的
利用者向け通知と開発用ログを分離し、致命的エラーや設定異常の予兆を見落とさない。

### 規則
1. **空 catch ブロック禁止**: `catch (e) {}` のような握り潰しは禁止。最低でも `logger.warn()` または `console.warn()` を必ず呼ぶ。
2. **2系統ログ必須**:
   - 利用者向け: `showMessage("error", "短く分かりやすい説明")`
   - 開発用: `Logger.error("FuncName", e.message + " | stack=" + e.stack)`
3. **致命的エラーの基準**:
   - DB接続失敗・設定ファイル致命的不整合 → `process.exit(1)` または利用者にリロード要求
   - 業務ルール違反（重複・上限等） → 通常エラー（messageCode で返却）
4. **監査記録**: 認証・予約・取消は成功/失敗いずれも `audit_log` に必ず記録する。
5. **テスト**: 異常系のテストケースを最低1件追加し、ログ出力が記録されることを確認する。

### 違反例（NG）
```javascript
try { db.prepare("...").run(...); } catch (e) {}   // ❌ 握り潰し
```

### 推奨例（OK）
```javascript
try {
  db.prepare("...").run(...);
} catch (e) {
  Logger.error("reserve", "DB write failed: " + e.message);
  return err(res, "E10", "登録に失敗しました。しばらく待ってから再度お試しください。", 500);
}
```
