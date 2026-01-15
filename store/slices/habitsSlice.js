import { createSlice } from "@reduxjs/toolkit";

const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHabits: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addHabit: (state, action) => {
      state.items.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateHabit: (state, action) => {
      const index = state.items.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    removeHabit: (state, action) => {
      state.items = state.items.filter((h) => h.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    updateHabitCompletion: (state, action) => {
      const { habitId } = action.payload;
      const habit = state.items.find((h) => h.id === habitId);
      if (habit) {
        habit.completed = true;
      }
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
  setHabits,
  addHabit,
  updateHabit,
  removeHabit,
  updateHabitCompletion,
  setError,
  clearError,
} = habitsSlice.actions;
export default habitsSlice.reducer;
