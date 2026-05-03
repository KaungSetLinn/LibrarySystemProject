# 📚 図書予約システム (Library Reservation System)

## 🛠 技術スタック
- **フロントエンド:** HTML, CSS, JavaScript
- **バックエンド:** Node.js, Express.js
- **ORM:** Sequelize
- **データベース:** SQLite

## 📁 プロジェクト構成
```
LibrarySystemProject/
├── frontend/
└── library-backend/
```

## 🚀 はじめに

### 前提条件
- [Node.js](https://nodejs.org/) がインストールされていること

### セットアップ手順

1. リポジトリをクローンする
```bash
   git clone https://github.com/KaungSetLinn/LibrarySystemProject.git
   cd LibrarySystemProject
```

2. 依存パッケージをインストールする
```bash
   cd library-backend
   npm install
```

3. データベースを初期化する（マイグレーションとシードデータの投入）
```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
```

4. 開発サーバーを起動する
```bash
   npm run dev
```
   以下のように表示されれば成功です：
```
   ✅ Database connected
   Server running on port 3000
```

5. アプリにアクセスする
   - ブラウザで **http://localhost:3000** を開いてください