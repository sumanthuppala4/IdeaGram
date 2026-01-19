import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import habitsReducer from './habitsSlice';
import challengesReducer from './challengesSlice';
import leaderboardReducer from './leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitsReducer,
    challenges: challengesReducer,
    leaderboard: leaderboardReducer,
  },
});

export default store;
