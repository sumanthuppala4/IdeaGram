import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    isConnected: false,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    disconnect: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
      state.isConnected = false;
    },
  },
});

export const { setSocket, setConnected, disconnect } = socketSlice.actions;
export default socketSlice.reducer;
