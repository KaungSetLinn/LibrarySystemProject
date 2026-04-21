# 📚 図書予約システム (Library Reservation System)

## 🛠 Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **ORM:** Sequelize
- **Database:** SQLite

## 📁 Project Structure
```
LibrarySystemProject/
├── frontend/
└── library-backend/
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed

### Setup

1. Clone the repo
```bash
   git clone https://github.com/KaungSetLinn/LibrarySystemProject.git
   cd LibrarySystemProject
```

2. Install dependencies
```bash
   cd library-backend
   npm install
```

3. Initialize the database (creates tables + seeds data)
```bash
   npm run init-db
```

4. Start the development server
```bash
   npm run dev
```
   You should see:
```
   ✅ Database connected
   Server running on port 3000
```

5. Access the app
   - Open your browser and go to **http://localhost:3000**