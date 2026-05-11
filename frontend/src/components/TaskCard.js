// ============================================================
// TaskCard.js — A single task card inside a column
//
// Shows: title, description, priority badge, due date,
//        move buttons (← →), edit button, delete button
// ============================================================

import React from "react";

// Maps priority values to colour classes defined in App.css
const PRIORITY_STYLES = {
  low:    { label: "Low",    cls: "priority-low"    },
  medium: { label: "Medium", cls: "priority-medium" },
  high:   { label: "High",   cls: "priority-high"   },
};

// Format "2025-04-29T00:00:00.000Z" → "29 Apr 2025"
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
};

// Check if a due date is in the past
const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

function TaskCard({ task, currentColumn, allColumns, onEdit, onDelete, onMove }) {
  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

  // Get the columns to the left and right of the current one
  const currentIndex  = allColumns.findIndex((c) => c.id === currentColumn.id);
  const prevColumn    = allColumns[currentIndex - 1] || null;
  const nextColumn    = allColumns[currentIndex + 1] || null;

  return (
    <div className="task-card">

      {/* ── Top row: priority + move buttons ── */}
      <div className="task-card-top">
        <span className={`priority-badge ${priority.cls}`}>
          {priority.label}
        </span>
        <div className="task-move-btns">
          {/* Move left — only shown if there is a column to the left */}
          {prevColumn && (
            <button
              className="move-btn"
              title={`Move to ${prevColumn.label}`}
              onClick={() => onMove(task._id, prevColumn.id)}
            >
              ←
            </button>
          )}
          {/* Move right — only shown if there is a column to the right */}
          {nextColumn && (
            <button
              className="move-btn"
              title={`Move to ${nextColumn.label}`}
              onClick={() => onMove(task._id, nextColumn.id)}
            >
              →
            </button>
          )}
        </div>
      </div>

      {/* ── Title ── */}
      <h3 className="task-title">{task.title}</h3>

      {/* ── Description (only shown if not empty) ── */}
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {/* ── Due date ── */}
      {task.dueDate && (
        <p className={`task-due ${isOverdue(task.dueDate) ? "overdue" : ""}`}>
          📅 {isOverdue(task.dueDate) ? "Overdue: " : "Due: "}
          {formatDate(task.dueDate)}
        </p>
      )}

      {/* ── Bottom row: edit + delete buttons ── */}
      <div className="task-card-bottom">
        <button className="task-edit-btn"   onClick={() => onEdit(task)}>
          ✏️ Edit
        </button>
        <button className="task-delete-btn" onClick={() => onDelete(task._id)}>
          🗑 Delete
        </button>
      </div>

    </div>
  );
}

export default TaskCard;
