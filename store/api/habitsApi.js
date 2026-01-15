import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const habitsApi = {
  fetchHabits: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/habits/today/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  createHabit: async ({ name, description }) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/habits`,
      { name, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  updateHabit: async ({ id, name, description }) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${BASE_URL}/habits/${id}`,
      { name, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  deleteHabit: async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${BASE_URL}/habits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  },

  completeHabit: async ({ id, date }) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/habits/${id}/complete`,
      { date },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { id, ...res.data };
  },
};
