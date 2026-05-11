// ============================================================
// models/Task.js — Mongoose schema for a Task
//
// Each task belongs to a user (via the "owner" field).
// Status can be one of three values matching our Kanban columns.
// Priority is optional but shown in the UI.
// ============================================================

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    // The three Kanban columns
    status: {
      type: String,
      enum: ["todo", "inprogress", "done"], // only these values are allowed
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    // Reference to the User who owns this task
    // mongoose.Schema.Types.ObjectId is how MongoDB stores references to other documents
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",      // "ref" tells Mongoose this points to the User model
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Task", taskSchema);
