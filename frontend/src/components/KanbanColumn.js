// ============================================================
// KanbanColumn.js — A single column (To Do / In Progress / Done)
//
// Receives:
//   column     — { id, label, emoji }
//   tasks      — array of tasks with status matching this column
//   allColumns — all 3 columns (used to build move buttons)
//   onEdit     — opens the edit modal
//   onDelete   — deletes the task
//   onMove     — moves task to a different column
// ============================================================

import React from "react";
import TaskCard from "./TaskCard";

function KanbanColumn({ column, tasks, allColumns, onEdit, onDelete, onMove }) {
  return (
    <div className="kanban-column">

      {/* Column header */}
      <div className="column-header">
        <span className="column-emoji">{column.emoji}</span>
        <h2 className="column-title">{column.label}</h2>
        {/* Badge showing task count */}
        <span className="column-count">{tasks.length}</span>
      </div>

      {/* Task cards */}
      <div className="column-cards">
        {tasks.length === 0 ? (
          <p className="column-empty">No tasks here yet.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              currentColumn={column}
              allColumns={allColumns}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        )}
      </div>

    </div>
  );
}

export default KanbanColumn;
