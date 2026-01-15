import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const challengesApi = {
  fetchChallenges: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/challenges`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  fetchMyChallenges: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/challenges/my-challenges`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  createChallenge: async (challengeData) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${BASE_URL}/challenges`, challengeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  joinChallenge: async (challengeId) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${BASE_URL}/challenges/${challengeId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return challengeId;
  },

  leaveChallenge: async (challengeId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${BASE_URL}/challenges/${challengeId}/leave`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return challengeId;
  },
};
