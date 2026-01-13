import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/graphql";

function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getIdeas = () => {
    const getIdeasGraphQL = `
          query  {
            getIdeas {
              _id
              description
              creator {
                username
              }
              likesCount
              likedByUser
            }
          }
        `;

    axios
      .post(
        `${BASE_URL}`,
        {
          query: getIdeasGraphQL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setIdeas(res.data.data.getIdeas))
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getIdeas();
  }, [navigate, token]);

  const handleAddIdea = async () => {
    if (!newIdea.trim()) return;

    const addIdeaGraphQL = `
    mutation {
        createIdea(ideaInput: {description: "${newIdea}"}) 
        {
             _id description creator { username }  
          }
      }`;

    try {
      const res = await axios.post(
        BASE_URL,
        {
          query: addIdeaGraphQL,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIdeas([...ideas, { ...res.data.data.createIdea, likedByUser: false , likesCount: 0 }]);
      setNewIdea("");
    } catch (err) {
      console.error("Error adding idea:", err);
    }
  };

  const handleToggleLike = async (id) => {

    console.log(id)

    const toggleLikeGraphQL = `
    mutation {
        toggleLike(ideaId: "${id}") 
        { success }
      }
    `;

    try {
      await axios.post(
        BASE_URL,
        {
          query: toggleLikeGraphQL,
        },

        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIdeas(
        ideas.map((idea) => {
          if (idea._id !== id) return idea;
          const likesCount = idea.likedByUser
            ? idea.likesCount - 1
            : idea.likesCount + 1;
          const liked = !idea.likedByUser;
          return { ...idea, likesCount, likedByUser: liked };
        })
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
              <p>Idea By :{idea.creator.username}</p>
              <p>{idea.description}</p>
              <div className="idea-actions">
                <button
                  className={`like-btn ${idea.liked ? "liked" : ""}`}
                  onClick={() => handleToggleLike(idea._id)}
                >
                  {idea.likedByUser ? "❤️" : "🤍"}
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
