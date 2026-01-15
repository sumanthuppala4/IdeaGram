import { createSlice } from "@reduxjs/toolkit";

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    users: [],
    myStats: { totalPoints: 0, rank: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLeaderboard: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMyStats: (state, action) => {
      state.myStats = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setLeaderboard,
  setMyStats,
  setError,
  clearError,
} = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
