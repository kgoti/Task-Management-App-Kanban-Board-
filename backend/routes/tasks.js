// ============================================================
// routes/tasks.js — Task CRUD Routes (all protected)
//
// All routes here require a valid JWT token.
// The "protect" middleware verifies the token and sets req.userId.
//
// GET    /api/tasks           → get all tasks for logged-in user
// POST   /api/tasks           → create a new task
// PUT    /api/tasks/:id       → update a task (title, status, priority etc.)
// DELETE /api/tasks/:id       → delete a task
// ============================================================

const express = require("express");
const Task    = require("../models/Task");
const protect = require("../middleware/auth");

const router = express.Router();

// Apply "protect" middleware to ALL routes in this file
// This means every route below requires a valid JWT token
router.use(protect);

// ── GET /api/tasks ──────────────────────────────────────────
// Returns all tasks belonging to the logged-in user
// Sorted newest first (createdAt: -1)
router.get("/", async (req, res) => {
  try {
    // req.userId was set by the protect middleware
    // We filter tasks so users only see THEIR OWN tasks
    const tasks = await Task.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch tasks." });
  }
});

// ── POST /api/tasks ─────────────────────────────────────────
// Creates a new task for the logged-in user
router.post("/", async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required." });
  }

  try {
    const task = await Task.create({
      title,
      description: description || "",
      status:      status      || "todo",
      priority:    priority    || "medium",
      dueDate:     dueDate     || null,
      owner:       req.userId,   // link this task to the logged-in user
    });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Could not create task." });
  }
});

// ── PUT /api/tasks/:id ──────────────────────────────────────
// Updates any field of a task
// :id is the MongoDB _id of the task
router.put("/:id", async (req, res) => {
  try {
    // Find the task by ID AND make sure it belongs to the logged-in user
    // This prevents user A from editing user B's tasks
    const task = await Task.findOne({ _id: req.params.id, owner: req.userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Update only the fields that were sent in the request body
    const { title, description, status, priority, dueDate } = req.body;
    if (title       !== undefined) task.title       = title;
    if (description !== undefined) task.description = description;
    if (status      !== undefined) task.status      = status;
    if (priority    !== undefined) task.priority    = priority;
    if (dueDate     !== undefined) task.dueDate     = dueDate;

    const updatedTask = await task.save(); // triggers Mongoose validation
    res.json(updatedTask);

  } catch (err) {
    res.status(500).json({ message: "Could not update task." });
  }
});

// ── DELETE /api/tasks/:id ───────────────────────────────────
// Permanently deletes a task
router.delete("/:id", async (req, res) => {
  try {
    // Again — only allow deletion if the task belongs to the logged-in user
    const task = await Task.findOneAndDelete({
      _id:   req.params.id,
      owner: req.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });

  } catch (err) {
    res.status(500).json({ message: "Could not delete task." });
  }
});

module.exports = router;
