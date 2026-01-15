import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setSocket, setConnected } from "../store/slices/socketSlice";
import { updateHabitCompletion } from "../store/slices/habitsSlice";
import { addNotification } from "../store/slices/notificationsSlice";

function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const socket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket", "polling"], // allow both transports for compatibility to avoid CORS issues
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log({ socket },"socket");
      dispatch(setSocket(socket));
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      dispatch(setConnected(false));
    });

    // Listen for real-time habit completions
    socket.on("habit:completed", (data) => {
      dispatch(updateHabitCompletion({ habitId: data.habitId }));
      dispatch(
        addNotification({
          id: Date.now(),
          type: "success",
          message: `${data.username} completed a habit and earned ${data.points} points!`,
          timestamp: new Date(),
        })
      );
    });

    // Listen for leaderboard updates
    socket.on("leaderboard:updated", () => {
      dispatch(
        addNotification({
          id: Date.now(),
          type: "info",
          message: "Leaderboard updated!",
          timestamp: new Date(),
        })
      );
    });

    // Listen for challenge participant joins
    socket.on("challenge:participant-joined", (data) => {
      dispatch(
        addNotification({
          id: Date.now(),
          type: "info",
          message: `${data.username} joined a challenge!`,
          timestamp: new Date(),
        })
      );
    });

    return () => {
      socket.disconnect();
      dispatch(setSocket(null));
      dispatch(setConnected(false));
    };
  }, [token, dispatch]);

  return children;
}

export default SocketProvider;
