import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  habits: [],
  loading: false,
  error: null,
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setHabits: (state, action) => {
      state.habits = action.payload;
    },
    addHabit: (state, action) => {
      state.habits.push(action.payload);
    },
    updateHabit: (state, action) => {
      const index = state.habits.findIndex(h => h._id === action.payload._id);
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
    },
    deleteHabit: (state, action) => {
      state.habits = state.habits.filter(h => h._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setHabits, addHabit, updateHabit, deleteHabit, setLoading, setError } = habitsSlice.actions;
export default habitsSlice.reducer;
