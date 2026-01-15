import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { store } from "./store/store";
import SocketProvider from "./components/SocketProvider";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import NotificationToast from "./components/NotificationToast";
import ConnectionStatus from "./components/ConnectionStatus";
import "./App.css";

function App() {
  // get token from localStorage
  const token = localStorage.getItem("token");

  return (
    <Provider store={store}>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protect dashboard: only show if logged in */}
            <Route
              path="/dashboard"
              element={token ? <Dashboard /> : <Navigate to="/login" />}
            />
          </Routes>
          <NotificationToast />
          <ConnectionStatus />
        </Router>
      </SocketProvider>
    </Provider>
  );
}

export default App;
