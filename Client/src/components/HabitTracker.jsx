import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setHabits,
  removeHabit,
  updateHabitCompletion,
  setError,
} from "../store/slices/habitsSlice";
import { addNotification } from "../store/slices/notificationsSlice";
import { validateHabit } from "../utils/validation";
import { habitsApi } from "../store/api/habitsApi";

function HabitTracker() {
  const dispatch = useDispatch();
  const { items: habits, loading } = useSelector((state) => state.habits);
  const { socket } = useSelector((state) => state.socket);

  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDesc, setNewHabitDesc] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadHabits();
  }, [dispatch]);

  const loadHabits = async () => {
    dispatch(setLoading(true));
    try {
      const data = await habitsApi.fetchHabits();
      dispatch(setHabits(data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch habits";
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

  // Listen for real-time habit updates from Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleHabitCompleted = () => {
      loadHabits();
    };

    socket.on("habit:completed", handleHabitCompleted);

    return () => {
      socket.off("habit:completed", handleHabitCompleted);
    };
  }, [socket, dispatch]);

  const handleAddHabit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateHabit(newHabitName, newHabitDesc);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    dispatch(setLoading(true));
    try {
      await habitsApi.createHabit({
        name: newHabitName.trim(),
        description: newHabitDesc.trim(),
      });

      dispatch(
        addNotification({
          id: Date.now(),
          type: "success",
          message: "Habit added successfully!",
          timestamp: new Date(),
        })
      );

      setNewHabitName("");
      setNewHabitDesc("");
      setShowAddForm(false);
      loadHabits();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add habit. Please try again.";
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
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const result = await habitsApi.completeHabit({ id: habitId });

      // Emit socket event for real-time update
      if (socket) {
        socket.emit("habit:completed", {
          habitId,
          points: result.points,
        });
      }

      dispatch(updateHabitCompletion({ habitId }));

      dispatch(
        addNotification({
          id: Date.now(),
          type: "success",
          message: `Habit completed! You earned ${result.points} points!`,
          timestamp: new Date(),
        })
      );

      loadHabits();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to complete habit. Please try again.";
      dispatch(setError(errorMessage));
      
      if (errorMessage.includes("already completed")) {
        dispatch(
          addNotification({
            id: Date.now(),
            type: "error",
            message: "You've already completed this habit today!",
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
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    dispatch(setLoading(true));
    try {
      await habitsApi.deleteHabit(habitId);
      dispatch(removeHabit(habitId));

      dispatch(
        addNotification({
          id: Date.now(),
          type: "success",
          message: "Habit deleted successfully",
          timestamp: new Date(),
        })
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete habit. Please try again.";
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

  const handleInputChange = (field, value) => {
    if (field === "name") {
      setNewHabitName(value);
    } else if (field === "description") {
      setNewHabitDesc(value);
    }

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: null });
    }
  };

  return (
    <div className="habit-tracker">
      <div className="habit-header">
        <h2>Daily Habits</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFormErrors({});
          }}
          disabled={loading}
        >
          {showAddForm ? "Cancel" : "+ Add Habit"}
        </button>
      </div>

      {showAddForm && (
        <form className="add-habit-form" onSubmit={handleAddHabit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Habit name (e.g., Exercise, Read, Meditate)"
              value={newHabitName}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={formErrors.name ? "form-input-error" : ""}
              required
            />
            {formErrors.name && (
              <span className="form-error">{formErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Description (optional)"
              value={newHabitDesc}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={formErrors.description ? "form-input-error" : ""}
            />
            {formErrors.description && (
              <span className="form-error">{formErrors.description}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span> Adding...
              </>
            ) : (
              "Add Habit"
            )}
          </button>
        </form>
      )}

      {loading ? (
        <div className="empty-state">
          <span className="loading-spinner"></span> Loading habits...
        </div>
      ) : habits.length === 0 ? (
        <p className="empty-state">No habits yet. Add your first habit to get started!</p>
      ) : (
        <div className="habits-list">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`habit-card ${habit.completed ? "completed" : ""}`}
            >
              <div className="habit-info">
                <h3>{habit.name}</h3>
                {habit.description && <p>{habit.description}</p>}
              </div>
              <div className="habit-actions">
                {!habit.completed ? (
                  <button
                    className="btn-complete"
                    onClick={() => handleCompleteHabit(habit.id)}
                  >
                    ✓ Complete
                  </button>
                ) : (
                  <span className="completed-badge">✓ Completed Today</span>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteHabit(habit.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HabitTracker;
