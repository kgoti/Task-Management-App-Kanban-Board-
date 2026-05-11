// ============================================================
// TaskModal.js — Create or Edit a task in a popup modal
//
// If "task" prop is null   → we are creating a new task
// If "task" prop has data  → we are editing an existing task
//
// On save, calls onSave(taskData) which is handled by KanbanBoard.js
// ============================================================

import React, { useState, useEffect } from "react";

function TaskModal({ task, onSave, onClose }) {
  // Pre-fill the form if we are editing an existing task
  const [title, setTitle]             = useState(task?.title       || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus]           = useState(task?.status      || "todo");
  const [priority, setPriority]       = useState(task?.priority    || "medium");
  const [dueDate, setDueDate]         = useState(
    // Convert ISO date string to YYYY-MM-DD format for the date input
    task?.dueDate ? task.dueDate.split("T")[0] : ""
  );
  const [error, setError] = useState("");

  // Close modal when user presses Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    onSave({
      title:       title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate:     dueDate || null,
    });
  };

  return (
    // Clicking the dark backdrop closes the modal
    <div className="modal-backdrop" onClick={onClose}>

      {/* stopPropagation prevents clicks inside the card from closing it */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">
          {task ? "Edit Task" : "Create New Task"}
        </h2>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            className="form-input"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(""); }}
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Optional — add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Status and Priority side by side */}
        <div className="modal-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label className="form-label">Due Date (optional)</label>
          <input
            className="form-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Error message */}
        {error && <p className="auth-error">⚠️ {error}</p>}

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default TaskModal;
