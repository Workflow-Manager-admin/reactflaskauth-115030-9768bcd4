import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main App component for Login/Register with modern light theme.
 */
function App() {
  // Theme
  const [theme] = useState("light");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // For toggling between Login & Register
  const [mode, setMode] = useState("login"); // "login" or "register"
  // Message state
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  // Handle form submission for login or register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    setLoading(true);

    const endpoint = mode === "login" ? "/api/login" : "/api/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      // Defensive: handle non-JSON response
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (res.ok && data.success) {
        setMsg(data.message || (mode === "login" ? "Login successful!" : "Registration successful! You can now log in."));
        setMsgType("success");
        if (mode === "register") {
          // Automatically switch to login after short delay
          setTimeout(() => {
            setMode("login");
            setMsg("");
            setMsgType("");
            setEmail("");
            setPassword("");
          }, 1800);
        }
      } else {
        setMsg(
          data.message ||
            (mode === "login"
              ? "Login failed. Please check your credentials."
              : "Registration failed. Try a different email.")
        );
        setMsgType("error");
      }
    } catch (err) {
      setMsg("Network error. Please try again later.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle between Login and Register screen
  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setMsg("");
    setMsgType("");
    setPassword("");
    // Only clear email for switching to login after register
    if (mode === "register") setEmail("");
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
        </div>
        <form
          className="login-form"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
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
            minLength={6}
            placeholder={
              mode === "register"
                ? "Create a password (min 6 chars)"
                : "Enter your password"
            }
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Registering..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
        </form>
        <div className={`login-message${msg ? " visible" : ""} ${msgType}`}>
          {msg}
        </div>
        <div style={{ textAlign: "center", marginTop: "0.8rem", color: "var(--color-secondary)", fontSize: "1rem" }}>
          {mode === "login" ? (
            <>
              <span>New here?&nbsp;</span>
              <button
                type="button"
                style={{
                  background: "none",
                  color: "var(--color-primary)",
                  textDecoration: "underline",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: 0,
                  fontWeight: "600"
                }}
                onClick={switchMode}
                tabIndex={0}
              >
                Create account
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?&nbsp;</span>
              <button
                type="button"
                style={{
                  background: "none",
                  color: "var(--color-primary)",
                  textDecoration: "underline",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: 0,
                  fontWeight: "600"
                }}
                onClick={switchMode}
                tabIndex={0}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
