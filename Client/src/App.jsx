import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Check server session (Google OAuth)
    fetch("http://localhost:5000/auth/check", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthed(Boolean(data?.authenticated));
      })
      .catch(() => setIsAuthed(false))
      .finally(() => setAuthChecked(true));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protect dashboard: only show if logged in */}
        <Route
          path="/dashboard"
          element={
            authChecked && isAuthed ? (
              <Dashboard />
            ) : authChecked ? (
              <Navigate to="/login" />
            ) : null
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
