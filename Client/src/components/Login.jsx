import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000"; // backend URL

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // normal login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  // Google Sign-in handler
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.btn}>
          Login
        </button>
      </form>

      <div style={styles.divider}>OR</div>

      {/* Google Login Button */}
      <button onClick={handleGoogleLogin} style={styles.googleBtn}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: 20, marginRight: 8, color: "black" }}
        />
        Sign in with Google
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "80px auto",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 10,
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  btn: {
    padding: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  googleBtn: {
    color:"black",
    marginTop: 10,
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
  },
  divider: {
    margin: "15px 0",
    color: "#888",
  },
};
