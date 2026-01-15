import { createSlice } from "@reduxjs/toolkit";

const challengesSlice = createSlice({
  name: "challenges",
  initialState: {
    all: [],
    my: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setChallenges: (state, action) => {
      state.all = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMyChallenges: (state, action) => {
      state.my = action.payload;
      state.loading = false;
      state.error = null;
    },
    addChallenge: (state, action) => {
      state.all.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateChallenge: (state, action) => {
      const index = state.all.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.all[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeChallenge: (state, action) => {
      state.all = state.all.filter((c) => c.id !== action.payload);
      state.my = state.my.filter((c) => c.id !== action.payload);
      state.loading = false;
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
  setChallenges,
  setMyChallenges,
  addChallenge,
  updateChallenge,
  removeChallenge,
  setError,
  clearError,
} = challengesSlice.actions;
export default challengesSlice.reducer;
