import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export default function UserSignUp({setUser}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/users/login`, {
        username,
        password,
      });
      const data = res.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.username);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async () => {
    console.log("Registering user...");
    try {
      const res = await axios.post(`${BASE_URL}/users/register`, {
        username,
        password,
      });
      const data = res.data;
      console.log("Registration response:", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.username);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Registration failed");
    }
  };

  const handleSignUp = () => {
    if (mode === "login") {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div className="signup-container">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>
        {mode === "login" ? "Login" : "Register"}
      </button>

      {mode === "login" ? (
        <>
          Don't have an account?{" "}
          <button
            className="register-link"
            onClick={() => {
              setMode("register");
              setUsername("");
              setPassword("");
            }}
          >
            Register
          </button>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <button
            className="register-link"
            onClick={() => {
              setMode("login");
              setUsername("");
              setPassword("");
            }}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
}
