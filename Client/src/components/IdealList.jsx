import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export default function IdeaList({ ideas, token, refreshIdeas }) {
  const handleLike = async (id) => {
    try {
      await axios.put(`${BASE_URL}/ideas/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshIdeas();
    } catch (err) {
      alert("Failed to like idea");
    }
  };

  return (
    <div>
      <h3>All Ideas</h3>
      {ideas.map(idea => (
        <div key={idea.id} style={{ border: "1px solid gray", padding: "5px", margin: "5px" }}>
          <h4>{idea.title}</h4>
          <p>{idea.description}</p>
          <p>Author: {idea.author} | Likes: {idea.likesCount}</p>
          <button onClick={() => handleLike(idea.id)}>Like</button>
        </div>
      ))}
    </div>
  );
}
