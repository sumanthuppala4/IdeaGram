import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../store/slices/notificationsSlice";

function NotificationToast() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-toast ${notification.type}`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => dispatch(removeNotification(notification.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationToast;
