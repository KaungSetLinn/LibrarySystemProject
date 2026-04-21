# 書籍検索 API

## エンドポイント

```
GET /api/books/search
```

---

## クエリパラメータ

| パラメータ   | 型     | 一致方式 | 必須 | 説明                              |
|-------------|--------|---------|------|-----------------------------------|
| `title`     | string | 部分一致 | 任意 | 書籍タイトルで絞り込む             |
| `author`    | string | 部分一致 | 任意 | 著者名で絞り込む                   |
| `category`  | string | 部分一致 | 任意 | カテゴリで絞り込む                 |
| `sort`      | string | —       | 任意 | ソートキー（デフォルト: `bookId`） |
| `page`      | number | —       | 任意 | ページ番号・0始まり（デフォルト: `0`） |

> テキスト系パラメータは前後の空白が除去され、空文字の場合は無視されます。複数パラメータを指定した場合はAND条件で検索されます。

---

## 固定仕様

- `can_reserve: true` かつ `is_disabled: false` の書籍のみ返却されます。
- 検索結果は常に `book_id ASC` 順で並びます。
- 1ページあたりの件数は **10件** 固定です。

---

## レスポンス

### 成功 — `200 OK`

```json
{
  "count": 42,
  "page": 0,
  "pageSize": 10,
  "totalPages": 5,
  "books": [
    {
      "bookId": 1,
      "title": "Introduction to Algorithms",
      "author": "Thomas H. Cormen",
      "category": "Computer Science",
      "status": "予約可能",
      "dueDate": null
    },
    {
      "bookId": 2,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "category": "Software Engineering",
      "status": "貸出中",
      "dueDate": "2025-05-01"
    }
  ]
}
```

### レスポンスフィールド

| フィールド    | 型      | 説明                                  |
|-------------|---------|---------------------------------------|
| `count`     | number  | 検索条件に一致した書籍の総件数         |
| `page`      | number  | 現在のページ番号（0始まり）            |
| `pageSize`  | number  | 1ページあたりの件数（10件固定）        |
| `totalPages`| number  | 総ページ数                             |
| `books`     | array   | 現在のページの書籍オブジェクトの一覧   |

### 書籍オブジェクトのフィールド

| フィールド  | 型              | 説明                                        |
|-----------|-----------------|---------------------------------------------|
| `bookId`  | number          | 書籍の一意識別子                             |
| `title`   | string          | 書籍タイトル                                 |
| `author`  | string          | 著者名                                       |
| `category`| string          | カテゴリ                                     |
| `status`  | string (enum)   | 貸出状況（下記参照）                          |
| `dueDate` | string \| null  | 返却期限日（`status` が `貸出中` の場合のみ設定） |

### ステータス値

| 値       | 説明                     |
|---------|--------------------------|
| `予約可能` | 予約・貸出が可能な状態    |
| `貸出中`  | 現在貸し出し中            |
| `予約中`  | 予約済み（未貸出）        |

ステータスの優先順位: **貸出中 > 予約中 > 予約可能**

---

### エラー — `500 Internal Server Error`

```json
{
  "error": "エラーメッセージ"
}
```

---

## リクエスト例

**タイトルで検索（部分一致）:**
```
GET /api/books/search?title=clean
```

**著者とカテゴリで検索:**
```
GET /api/books/search?author=Martin&category=Software+Engineering
```

**ページを指定して取得:**
```
GET /api/books/search?title=algorithm&page=2
```