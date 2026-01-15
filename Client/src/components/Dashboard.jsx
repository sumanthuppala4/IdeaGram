import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HabitTracker from "./HabitTracker";
import Challenges from "./Challenges";
import Leaderboard from "./Leaderboard";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("habits");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Habit Challenge Platform</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <nav className="dashboard-nav">
        <button
          className={activeTab === "habits" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("habits")}
        >
          📋 My Habits
        </button>
        <button
          className={activeTab === "challenges" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("challenges")}
        >
          🏆 Challenges
        </button>
        <button
          className={activeTab === "leaderboard" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("leaderboard")}
        >
          🏅 Leaderboard
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === "habits" && <HabitTracker />}
        {activeTab === "challenges" && <Challenges />}
        {activeTab === "leaderboard" && <Leaderboard />}
      </div>
    </div>
  );
}

export default Dashboard;
