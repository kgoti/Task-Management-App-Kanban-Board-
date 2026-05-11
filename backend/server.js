// ============================================================
// server.js — Entry point for the backend
//
// This file does four things:
//   1. Loads environment variables from .env
//   2. Connects to MongoDB
//   3. Sets up Express middleware (cors, json parsing)
//   4. Mounts the route files and starts listening
// ============================================================

const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
require("dotenv").config(); // loads MONGO_URI, JWT_SECRET, PORT from .env

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
// cors() allows the React frontend (localhost:3000) to talk to
// this backend (localhost:5000) without browser blocking it
app.use(cors());

// express.json() parses incoming request bodies as JSON
// Without this, req.body would be undefined
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
// All auth routes (register, login) live under /api/auth
app.use("/api/auth", authRoutes);

// All task routes (get, create, update, delete) live under /api/tasks
app.use("/api/tasks", taskRoutes);

// ── Health check ────────────────────────────────────────────
// A simple GET / so you can test the server is running
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running!" });
});

// ── Connect to MongoDB then start the server ────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // stop the process if DB connection fails
  });
