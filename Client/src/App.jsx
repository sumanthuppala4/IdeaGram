import { useState } from "react";



import "./styles.css";
import Dashboard from "./components/Dashboard";
import UserSignUp from "./components/UserSignUp";

function App() {
  const [user, setUser] = useState(
    localStorage.getItem("token") ? "User" : null
  );

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  if (!user) {
    return (
      <div className="fb-container">
        {/* Left side: Intro / logo */}

        <div className="fb-left">
          <h1>Idea Sharing App</h1>

          <p>Share ideas with the world and like others' ideas!</p>
        </div>

        {/* Right side: Login + Signup */}

        <div className="fb-right">
          <div className="fb-card">
            <UserSignUp />
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <Dashboard username={user} />
    </div>
  );
}

export default App;
