// ============================================================
// App.js — Root component
//
// Decides which screen to show:
//   - If user is logged in  → show the Kanban board
//   - If user is logged out → show the Auth page (login/register)
//
// Auth state is stored in localStorage so the user stays
// logged in even after closing and reopening the browser.
// ============================================================

import React, { useState } from "react";
import AuthPage   from "./components/AuthPage";
import KanbanBoard from "./components/KanbanBoard";
import "./App.css";

function App() {
  // Try to load saved user and token from localStorage
  // If nothing is saved, default to null (logged out)
  const [user, setUser]   = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  // Called by AuthPage after a successful login or register
  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    // Save to localStorage so login persists on page refresh
    localStorage.setItem("user",  JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  // Called when user clicks "Log Out"
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // If no user is logged in, show the Auth page
  if (!user || !token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Otherwise show the Kanban board
  return (
    <KanbanBoard
      user={user}
      token={token}
      onLogout={handleLogout}
    />
  );
}

export default App;
