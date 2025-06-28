import React, { useState, useEffect } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // Theme, used for possible theme toggling in future
  const [theme] = useState("light");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setMsgType("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg(data.message || "Login successful!");
        setMsgType("success");
      } else {
        setMsg(data.message || "Login failed. Please check your credentials.");
        setMsgType("error");
      }
    } catch (err) {
      setMsg("Network error. Please try again later.");
      setMsgType("error");
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <h2>Sign in</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className={`login-message${msg ? " visible" : ""} ${msgType}`}>
          {msg}
        </div>
      </div>
    </div>
  );
}

export default App;
