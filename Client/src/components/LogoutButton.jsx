import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout route
      await axios.post(
        "http://localhost:5000/api/auth/logout", // full backend URL
        {},
        { withCredentials: true } // include session cookie
      );

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Error logging out, please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 16px",
        backgroundColor: "#e53935",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Logout
    </button>
  );
}
