'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HabitTracker from "./HabitTracker";
import Challenges from "./Challenges";
import Leaderboard from "./Leaderboard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("habits");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!isClient || !token) {
    if (isClient) router.push("/login");
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
