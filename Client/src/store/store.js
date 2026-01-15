import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./slices/habitsSlice";
import challengesReducer from "./slices/challengesSlice";
import leaderboardReducer from "./slices/leaderboardSlice";
import notificationsReducer from "./slices/notificationsSlice";
import socketReducer from "./slices/socketSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    challenges: challengesReducer,
    leaderboard: leaderboardReducer,
    notifications: notificationsReducer,
    socket: socketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
