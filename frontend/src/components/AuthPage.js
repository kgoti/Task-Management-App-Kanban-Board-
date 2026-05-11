import React, { useState } from "react";

// ✅ Use environment variable for deployed app
// Fallback to localhost for development
const API =
  process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api/auth`
    : "http://localhost:5000/api/auth";

function AuthPage({ onLogin }) {
  const [tab, setTab]           = useState("login");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = tab === "register"
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(`${API}/${tab}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

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

        <div className="auth-logo">
          <span className="auth-logo-icon">✅</span>
          <h1 className="auth-logo-text">TaskFlow</h1>
        </div>
        <p className="auth-subtitle">Organise your work with a Kanban board</p>

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

        <form className="auth-form" onSubmit={handleSubmit}>

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

          {error && <p className="auth-error">⚠️ {error}</p>}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : tab === "login" ? "Log In" : "Create Account"}
          </button>

        </form>

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