import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

export const habitsApi = {
  getAll: () => api.get('/habits'),
  getOne: (id) => api.get(`/habits/${id}`),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.patch(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
  completeHabit: (id, data) => api.post(`/habits/${id}/complete`, data),
};

export const challengesApi = {
  getAll: () => api.get('/challenges'),
  getOne: (id) => api.get(`/challenges/${id}`),
  create: (data) => api.post('/challenges', data),
  update: (id, data) => api.patch(`/challenges/${id}`, data),
  delete: (id) => api.delete(`/challenges/${id}`),
  joinChallenge: (id) => api.post(`/challenges/${id}/join`),
};

export const leaderboardApi = {
  getAll: () => api.get('/leaderboard'),
  getByChallenge: (challengeId) => api.get(`/leaderboard/challenge/${challengeId}`),
};

export default api;
