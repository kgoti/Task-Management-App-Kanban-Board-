import React, { useState } from "react";
import AuthPage from "./components/AuthPage";
import KanbanBoard from "./components/KanbanBoard";
import "./App.css";

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

function App() {
  const [user, setUser] = useState(getSavedUser);
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  if (!user || !token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <KanbanBoard
      user={user}
      token={token}
      onLogout={handleLogout}
    />
  );
}

export default App;