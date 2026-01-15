import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setLeaderboard,
  setMyStats,
  setError,
} from "../store/slices/leaderboardSlice";
import { leaderboardApi } from "../store/api/leaderboardApi";

function Leaderboard() {
  const dispatch = useDispatch();
  const { users: leaderboard, myStats, loading } = useSelector(
    (state) => state.leaderboard
  );
  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    loadLeaderboard();
    loadMyStats();
  }, [dispatch]);

  const loadLeaderboard = async () => {
    dispatch(setLoading(true));
    try {
      const data = await leaderboardApi.fetchLeaderboard();
      dispatch(setLeaderboard(data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch leaderboard";
      dispatch(setError(errorMessage));
    }
  };

  const loadMyStats = async () => {
    try {
      const data = await leaderboardApi.fetchMyStats();
      dispatch(setMyStats(data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch stats";
      dispatch(setError(errorMessage));
    }
  };

  // Listen for real-time leaderboard updates
  useEffect(() => {
    if (!socket) return;

    const handleLeaderboardUpdate = () => {
      loadLeaderboard();
      loadMyStats();
    };

    socket.on("leaderboard:updated", handleLeaderboardUpdate);

    return () => {
      socket.off("leaderboard:updated", handleLeaderboardUpdate);
    };
  }, [socket, dispatch]);

  const getRankEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Global Leaderboard</h2>
        <div className="my-stats-card">
          <div className="stat-item">
            <span className="stat-label">Your Rank</span>
            <span className="stat-value">{getRankEmoji(myStats.rank)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Points</span>
            <span className="stat-value">{myStats.totalPoints}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <span className="loading-spinner"></span> Loading leaderboard...
        </div>
      ) : leaderboard.length === 0 ? (
        <p className="empty-state">No users on the leaderboard yet.</p>
      ) : (
        <div className="leaderboard-list">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.id} className={""}>
                  <td className="rank-cell">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `#${index + 1}`}
                  </td>
                  <td className="username-cell">{user.username}</td>
                  <td className="points-cell">{user.totalPoints || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
