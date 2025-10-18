import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/check", { withCredentials: true })
      .then((res) => {
        setAuth(res.data.authenticated);
      })
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;

  return children;
}
