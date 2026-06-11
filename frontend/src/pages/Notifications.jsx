// src/pages/Notifications.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import EmptyState from "../components/EmptyState";
import { useNotifications } from "../context/NotificationContext";
import { formatNotificationDateTime } from "../utils/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckCircle,
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export default function Notifications() {
  const {
    notifications,
    loading,
    markAsRead,
    removeNotification,
    markAllAsRead,
    refreshNotifications,
    unreadCount,
  } = useNotifications() ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    refreshNotifications?.();
  }, [refreshNotifications]);

  const iconFor = (type) => {
    if (type === "low_stock") return (
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-sm" />
      </div>
    );
    return (
      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
        <FontAwesomeIcon icon={faBell} className="text-brand-600 text-sm" />
      </div>
    );
  };

  const visibleNotifications = notifications ?? [];
  const handleOpen = (notification) => {
    markAsRead?.(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <PageHeader title="Notifications" />

      <div className="px-4 pt-4">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
        ) : visibleNotifications.length === 0 ? (
          <EmptyState type="notifications" />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "All notifications are read"}
              </p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead?.()}
                  className="text-xs font-semibold text-brand-600"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {visibleNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-start gap-3 text-left w-full border ${notification.read ? "border-transparent" : "border-brand-200 dark:border-brand-900/50"}`}
              >
                {iconFor(notification.type)}
                <button
                  type="button"
                  onClick={() => handleOpen(notification)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300 px-2 py-0.5 text-[10px] font-bold">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{notification.message}</p>
                  <p className="text-[11px] text-gray-400 mt-2">{formatNotificationDateTime(notification.createdAt)}</p>
                </button>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead?.(notification.id)}
                      className="text-xs font-semibold text-brand-600"
                    >
                      Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeNotification?.(notification.id)}
                    className="text-xs font-semibold text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}