import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  challenges: [],
  loading: false,
  error: null,
};

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setChallenges: (state, action) => {
      state.challenges = action.payload;
    },
    addChallenge: (state, action) => {
      state.challenges.push(action.payload);
    },
    updateChallenge: (state, action) => {
      const index = state.challenges.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.challenges[index] = action.payload;
      }
    },
    deleteChallenge: (state, action) => {
      state.challenges = state.challenges.filter(c => c._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setChallenges, addChallenge, updateChallenge, deleteChallenge, setLoading, setError } = challengesSlice.actions;
export default challengesSlice.reducer;
