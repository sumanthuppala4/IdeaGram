import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setChallenges,
  setMyChallenges,
  setError,
} from "../store/slices/challengesSlice";
import { addNotification } from "../store/slices/notificationsSlice";
import { validateChallenge } from "../utils/validation";
import { challengesApi } from "../store/api/challengesApi";

function Challenges() {
  const dispatch = useDispatch();
  const { all: activeChallenges, my: myChallenges, loading } = useSelector(
    (state) => state.challenges
  );
  const { socket } = useSelector((state) => state.socket);

  console.log({socket})

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [formErrors, setFormErrors] = useState({});

  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    targetHabits: 1,
    pointsPerDay: 10,
  });

  const loadChallenges = async () => {
    dispatch(setLoading(true));
    try {
      if (activeTab === "all") {
        const data = await challengesApi.fetchChallenges();
        dispatch(setChallenges(data));
      } else {
        const data = await challengesApi.fetchMyChallenges();
        dispatch(setMyChallenges(data));
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch challenges";
      dispatch(setError(errorMessage));
      dispatch(
        addNotification({
          id: Date.now(),
          type: "error",
          message: errorMessage,
          timestamp: new Date(),
        })
      );
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [activeTab, dispatch]);

  

  // Listen for real-time challenge updates
  useEffect(() => {
    if (!socket) return;

    const handleParticipantJoined = () => {
      console.log("Participant joined challenge, reloading challenges...");
      loadChallenges();
    };

    socket.on("challenge:participant-joined", handleParticipantJoined);

    return () => {
      socket.off("challenge:participant-joined", handleParticipantJoined);
    };
  }, [socket, activeTab, dispatch]);

  const handleCreateChallenge = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateChallenge(newChallenge);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    dispatch(setLoading(true));

    try {
      await challengesApi.createChallenge(newChallenge);

      dispatch(
        addNotification({
          id: Date.now(),
          type: "success",
          message: "Challenge created successfully!",
          timestamp: new Date(),
        })
      );

      setNewChallenge({
        name: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        targetHabits: 1,
        pointsPerDay: 10,
      });
      setShowCreateForm(false);
      loadChallenges();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create challenge. Please try again.";
      dispatch(setError(errorMessage));
      dispatch(
        addNotification({
          id: Date.now(),
          type: "error",
          message: errorMessage,
          timestamp: new Date(),
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    dispatch(setLoading(true));
    try {
      await challengesApi.joinChallenge(challengeId);

      // Emit socket event
      if (socket) {
        socket.emit("challenge:joined", { challengeId });
        socket.emit("challenge:subscribe", challengeId);
      }

      dispatch(
        addNotification({
          id: Date.now(),
          type: "success",
          message: "Successfully joined challenge!",
          timestamp: new Date(),
        })
      );

      loadChallenges();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to join challenge. Please try again.";
      dispatch(setError(errorMessage));
      
      if (errorMessage.includes("already joined")) {
        dispatch(
          addNotification({
            id: Date.now(),
            type: "error",
            message: "You've already joined this challenge!",
            timestamp: new Date(),
          })
        );
      } else {
        dispatch(
          addNotification({
            id: Date.now(),
            type: "error",
            message: errorMessage,
            timestamp: new Date(),
          })
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (field, value) => {
    setNewChallenge({ ...newChallenge, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: null });
    }
  };

  const challengesToShow = activeTab === "all" ? activeChallenges : myChallenges;

  return (
    <div className="challenges" style={{border:"1px solid red"}}>
      <div className="challenges-header">
        <h2>Challenges</h2>
        <div className="challenges-tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => {
              setActiveTab("all");
              loadChallenges();
            }}
          >
            All Challenges
          </button>
          <button
            className={activeTab === "my" ? "active" : ""}
            onClick={() => {
              setActiveTab("my");
              loadChallenges();
            }}
          >
            My Challenges
          </button>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setFormErrors({});
          }}
          disabled={loading}
        >
          {showCreateForm ? "Cancel" : "+ Create Challenge"}
        </button>
      </div>

      {showCreateForm && (
        <form className="create-challenge-form" onSubmit={handleCreateChallenge}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Challenge Name"
              value={newChallenge.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={formErrors.name ? "form-input-error" : ""}
              required
            />
            {formErrors.name && (
              <span className="form-error">{formErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <textarea
              placeholder="Description"
              value={newChallenge.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={formErrors.description ? "form-input-error" : ""}
            />
            {formErrors.description && (
              <span className="form-error">{formErrors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={newChallenge.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={formErrors.startDate ? "form-input-error" : ""}
                required
              />
              {formErrors.startDate && (
                <span className="form-error">{formErrors.startDate}</span>
              )}
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={newChallenge.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={formErrors.endDate ? "form-input-error" : ""}
                required
              />
              {formErrors.endDate && (
                <span className="form-error">{formErrors.endDate}</span>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span> Creating...
              </>
            ) : (
              "Create Challenge"
            )}
          </button>
        </form>
      )}

      {loading ? (
        <div className="empty-state">
          <span className="loading-spinner"></span> Loading challenges...
        </div>
      ) : challengesToShow.length === 0 ? (
        <p className="empty-state">
          {activeTab === "all"
            ? "No active challenges. Create one to get started!"
            : "You haven't joined any challenges yet."}
        </p>
      ) : (
        <div className="challenges-list">
          {challengesToShow.map((challenge) => (
            <div key={challenge.id} className="challenge-card">
              <div className="challenge-info">
                <h3>{challenge.name}</h3>
                {challenge.description && <p>{challenge.description}</p>}
                <div className="challenge-meta">
                  <span>👤 {challenge.creatorName}</span>
                  <span>👥 {challenge.participantCount} participants</span>
                  <span>
                    📅 {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                    {new Date(challenge.endDate).toLocaleDateString()}
                  </span>
                  {challenge.myPoints !== undefined && (
                    <span className="my-points">⭐ {challenge.myPoints} points</span>
                  )}
                </div>
              </div>
              <div className="challenge-actions">
                {activeTab === "all" ? (
                  <button
                    className="btn-join"
                    onClick={() => handleJoinChallenge(challenge.id)}
                  >
                    Join Challenge
                  </button>
                ) : (
                  <button
                    className="btn-view"
                    onClick={() => {
                      window.location.hash = `#leaderboard-${challenge.id}`;
                    }}
                  >
                    View Leaderboard
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Challenges;
