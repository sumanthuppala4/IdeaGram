import { useEffect, useState } from "react";
import CreateIdea from "../components/CreateIdea";
import axios from "axios";
import IdeaList from "./IdealList";

const BASE_URL = "http://localhost:5000/api";

export default function Dashboard({ username }) {
  const token = localStorage.getItem("token");
  const [ideas, setIdeas] = useState([]);

  // Fetch all ideas
  const fetchIdeas = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ideas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdeas(res.data);
    } catch (err) {
      console.error("Failed to fetch ideas", err);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div>
      <h2>Welcome, {username}</h2>
      <CreateIdea token={token} onIdeaCreated={fetchIdeas} />
      <IdeaList ideas={ideas} token={token} refreshIdeas={fetchIdeas} />
    </div>
  );
}
