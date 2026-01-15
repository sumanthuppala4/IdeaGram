import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const leaderboardApi = {
  fetchLeaderboard: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/leaderboard/global`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  fetchMyStats: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/leaderboard/my-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
