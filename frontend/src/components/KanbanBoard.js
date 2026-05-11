// ============================================================
// KanbanBoard.js — Main board with 3 columns
//
// Fetches all tasks from the backend on load.
// Passes tasks filtered by status to each KanbanColumn.
// Handles creating, updating (status drag), and deleting tasks.
// ============================================================

import React, { useState, useEffect } from "react";
import KanbanColumn from "./KanbanColumn";
import TaskModal    from "./TaskModal";

const API = "/api/tasks";

// The three columns — their id matches the "status" field in MongoDB
const COLUMNS = [
  { id: "todo",       label: "To Do",       emoji: "📋" },
  { id: "inprogress", label: "In Progress",  emoji: "⚙️"  },
  { id: "done",       label: "Done",         emoji: "✅" },
];

// Props:
//   user     — { id, name, email }
//   token    — JWT string
//   onLogout — function from App.js
function KanbanBoard({ user, token, onLogout }) {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null = creating new

  // ── Fetch all tasks on mount ──────────────────────────────
  useEffect(() => {
    fetchTasks();
  }, []);

  // Helper: build the Authorization header for every request
  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization:  `Bearer ${token}`,
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res  = await fetch(API, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTasks(data);
    } catch (err) {
      setError(err.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  };

  // ── Create a new task ─────────────────────────────────────
  const createTask = async (taskData) => {
    try {
      const res  = await fetch(API, {
        method:  "POST",
        headers: authHeader(),
        body:    JSON.stringify(taskData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Add the new task to state without re-fetching everything
      setTasks((prev) => [data, ...prev]);
    } catch (err) {
      alert("Error creating task: " + err.message);
    }
  };

  // ── Update a task (any field) ─────────────────────────────
  const updateTask = async (taskId, updates) => {
    try {
      const res  = await fetch(`${API}/${taskId}`, {
        method:  "PUT",
        headers: authHeader(),
        body:    JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Replace the old task in state with the updated one
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data : t))
      );
    } catch (err) {
      alert("Error updating task: " + err.message);
    }
  };

  // ── Delete a task ─────────────────────────────────────────
  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task permanently?")) return;
    try {
      const res = await fetch(`${API}/${taskId}`, {
        method:  "DELETE",
        headers: authHeader(),
      });
      if (!res.ok) throw new Error("Delete failed.");
      // Remove the task from state
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert("Error deleting task: " + err.message);
    }
  };

  // ── Move task to a different column ───────────────────────
  // Called when the user clicks the arrow buttons on a task card
  const moveTask = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  // ── Open modal for editing ────────────────────────────────
  const openEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  // ── Handle modal save ─────────────────────────────────────
  const handleModalSave = (taskData) => {
    if (editingTask) {
      updateTask(editingTask._id, taskData);
    } else {
      createTask(taskData);
    }
    setShowModal(false);
    setEditingTask(null);
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="board-wrapper">

      {/* ── Top navigation bar ── */}
      <header className="board-header">
        <div className="board-header-left">
          <span className="board-logo">✅ TaskFlow</span>
          <span className="board-welcome">Welcome, {user.name}!</span>
        </div>
        <div className="board-header-right">
          <button
            className="btn-primary"
            onClick={() => { setEditingTask(null); setShowModal(true); }}
          >
            + New Task
          </button>
          <button className="btn-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="board-main">

        {loading && <p className="board-loading">Loading your tasks...</p>}
        {error   && <p className="board-error">⚠️ {error}</p>}

        {!loading && !error && (
          <div className="board-columns">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={tasks.filter((t) => t.status === col.id)}
                allColumns={COLUMNS}
                onEdit={openEdit}
                onDelete={deleteTask}
                onMove={moveTask}
              />
            ))}
          </div>
        )}

      </main>

      {/* ── Task create/edit modal ── */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleModalSave}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}

    </div>
  );
}

export default KanbanBoard;
