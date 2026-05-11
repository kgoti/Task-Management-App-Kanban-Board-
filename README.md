# ✅ TaskFlow — Kanban Task Manager

A full-stack Kanban board with user authentication.
Built with **React** (frontend) + **Node.js / Express** (backend) + **MongoDB** (database).

## Features
- Register and log in with JWT authentication
- Create, edit, and delete tasks
- Move tasks between To Do, In Progress, and Done columns
- Set priority (Low / Medium / High) and due date per task
- Overdue tasks highlighted in red
- Data saved in MongoDB — persists after page refresh

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, plain CSS                 |
| Backend  | Node.js, Express                    |
| Database | MongoDB with Mongoose               |
| Auth     | JWT (jsonwebtoken) + bcryptjs       |

---

## Folder Structure

```
task-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js          ← JWT protection middleware
│   ├── models/
│   │   ├── User.js          ← Mongoose user schema
│   │   └── Task.js          ← Mongoose task schema
│   ├── routes/
│   │   ├── auth.js          ← POST /api/auth/register and /login
│   │   └── tasks.js         ← GET / POST / PUT / DELETE /api/tasks
│   ├── .env                 ← secrets (not pushed to GitHub)
│   ├── .gitignore
│   ├── package.json
│   └── server.js            ← entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.js      ← login / register screen
│   │   │   ├── KanbanBoard.js   ← main board, fetches tasks
│   │   │   ├── KanbanColumn.js  ← single column (To Do etc.)
│   │   │   ├── TaskCard.js      ← single task card
│   │   │   └── TaskModal.js     ← create / edit modal
│   │   ├── App.js           ← root, controls auth state
│   │   ├── App.css          ← all styles
│   │   ├── index.js         ← React entry point
│   │   └── index.css        ← global reset
│   └── package.json
│
└── README.md
```

---

## How to Run

You need **two terminals open at the same time** — one for the backend, one for the frontend.

### Prerequisites
- Node.js installed
- MongoDB installed locally OR a free MongoDB Atlas account

---

### Option A — MongoDB installed locally (simplest)
If you have MongoDB installed, it runs on `mongodb://localhost:27017` by default.
The `.env` file is already configured for this. Skip to Step 1.

### Option B — MongoDB Atlas (free cloud database)
1. Go to https://www.mongodb.com/atlas and create a free account
2. Create a free cluster
3. Click "Connect" → "Connect your application" → copy the connection string
4. Open `backend/.env` and replace `MONGO_URI=mongodb://localhost:27017/taskmanager`
   with your Atlas connection string

---

### Step 1 — Start the backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Connected to MongoDB successfully
Server is running on http://localhost:5000
```

---

### Step 2 — Start the frontend (new terminal)

```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000**

---

### Step 3 — Use the app
1. Click "Register here" and create an account
2. You will be logged in automatically
3. Click "+ New Task" to create your first task
4. Use the ← → arrows on each card to move tasks between columns
5. Click "✏️ Edit" to change title, priority, or due date
6. Click "Log Out" to test login again

---

## API Endpoints

| Method | Endpoint                 | Auth? | Description              |
|--------|--------------------------|-------|--------------------------|
| POST   | /api/auth/register       | No    | Create new account       |
| POST   | /api/auth/login          | No    | Log in, receive JWT      |
| GET    | /api/tasks               | Yes   | Get all my tasks         |
| POST   | /api/tasks               | Yes   | Create a task            |
| PUT    | /api/tasks/:id           | Yes   | Update a task            |
| DELETE | /api/tasks/:id           | Yes   | Delete a task            |

---

## How to Push to GitHub

```bash
# From the root task-manager/ folder:
git init
git add .
git commit -m "Initial commit: TaskFlow Kanban App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-manager.git
git push -u origin main
```

The `.gitignore` in the backend already excludes `.env` and `node_modules`,
so your secrets and heavy folders will not be uploaded.
