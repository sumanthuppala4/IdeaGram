import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: action.payload.id || Date.now(),
        type: action.payload.type || "info",
        message: action.payload.message,
        timestamp: action.payload.timestamp || new Date(),
      };
      state.items.push(notification);
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
