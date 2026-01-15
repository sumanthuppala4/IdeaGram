import React from "react";
import { useSelector } from "react-redux";

function ConnectionStatus() {
  const isConnected = useSelector((state) => state.socket.isConnected);

  return (
    <div className={`connection-status ${isConnected ? "connected" : "disconnected"}`}>
      {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
    </div>
  );
}

export default ConnectionStatus;
