// ============================================================
// AuthPage.js — Login and Register screen
//
// Shows a card with two tabs: Login and Register.
// On success it calls onLogin(user, token) from App.js.
// ============================================================

import React, { useState } from "react";

// API base URL — because of "proxy" in package.json,
// we only need the path, not the full http://localhost:5000
const API = "/api/auth";

// Props:
//   onLogin — function from App.js, called with (user, token)
function AuthPage({ onLogin }) {
  const [tab, setTab]           = useState("login"); // "login" or "register"
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Build the request body based on which tab is active
    const body = tab === "register"
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(`${API}/${tab}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show the error message from the backend
        setError(data.message || "Something went wrong.");
        return;
      }

      // Success — pass user and token up to App.js
      onLogin(data.user, data.token);

    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Logo / title */}
        <div className="auth-logo">
          <span className="auth-logo-icon">✅</span>
          <h1 className="auth-logo-text">TaskFlow</h1>
        </div>
        <p className="auth-subtitle">Organise your work with a Kanban board</p>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => { setTab("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Name field — only shown on Register tab */}
          {tab === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Kartik Goti"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder={tab === "register" ? "At least 6 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Error message */}
          {error && <p className="auth-error">⚠️ {error}</p>}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : tab === "login" ? "Log In" : "Create Account"}
          </button>

        </form>

        {/* Switch tab hint */}
        <p className="auth-switch">
          {tab === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            className="auth-switch-btn"
            onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
          >
            {tab === "login" ? "Register here" : "Log in here"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default AuthPage;
