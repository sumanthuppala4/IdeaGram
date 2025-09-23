import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export default function CreateIdea({ token, onIdeaCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/ideas`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onIdeaCreated(res.data);
      setTitle("");
      setDescription("");
    } catch (err) {
      alert("Failed to create idea");
    }
  };

  return (
    <div>
      <h3>Create Idea</h3>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
