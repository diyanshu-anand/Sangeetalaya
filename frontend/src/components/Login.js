import React, { useState } from "react";
import "../styles/login.css";

function LoginPanel({ isOpen, onClose }) {

  const [userName, setUserName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {

    // Example validation
    if (userName === "admin" && accessCode === "1234") {
      setError(false);
      alert("Login Successful");
    } else {
      setError(true);
    }

  };

  if (!isOpen) return null;

  return (
    <div className="login-panel">

      <span className="close-btn" onClick={onClose}>
        &times;
      </span>

      <h4>Login</h4>

      <input
        type="text"
        placeholder="Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Access Code"
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {error && (
        <p style={{ color: "red" }}>
          Invalid name or access code
        </p>
      )}

    </div>
  );
}

export default LoginPanel;