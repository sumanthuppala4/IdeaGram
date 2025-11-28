import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api";

function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${BASE_URL}/ideas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setIdeas(res.data))
      .catch((err) => { console.log(err);; });
  }, [navigate, token]);

  const handleAddIdea = async () => {
    if (!newIdea.trim()) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/ideas`,
        { description: newIdea },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIdeas([...ideas, { ...res.data, liked: false }]);
      setNewIdea("");
    } catch (err) {
      console.error("Error adding idea:", err);
    }
  };

  const handleToggleLike = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/ideas/toggle-like`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(res, "toggle like response");

      setIdeas(
        ideas.map((idea) =>
          idea.id === id
            ? {
              ...idea,
              likesCount: res.data.likes,
              liked: res.data.liked,
            }
            : idea
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Ideas Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="add-idea">
        <input
          type="text"
          placeholder="Share your idea..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
        />
        <button onClick={handleAddIdea}>Post</button>
      </div>

      <div className="ideas-list">
        {ideas.length === 0 ? (
          <p>No ideas yet. Be the first to share!</p>
        ) : (
          ideas.map((idea) => (
            <div key={idea.id} className="idea-card">
              <p>Idea By :{idea.author}</p>
              <p>{idea.description}</p>
              <div className="idea-actions">
                <button
                  className={`like-btn ${idea.liked ? "liked" : ""}`}
                  onClick={() => handleToggleLike(idea.id)}
                >
                  {idea.liked ? "❤️" : "🤍"}
                </button>
                &nbsp; {idea.likesCount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
