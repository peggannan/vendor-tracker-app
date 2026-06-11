import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getInventory, getSalesHistory } from "../api/api";
import {
  buildNotifications,
  loadNotificationState,
  saveNotificationState,
} from "../utils/notifications";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notificationState, setNotificationState] = useState(() => loadNotificationState());
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const persistState = useCallback((nextState) => {
    saveNotificationState(nextState);
    setNotificationState(nextState);
  }, []);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: inventoryData }, { data: salesData }] = await Promise.all([
        getInventory(),
        getSalesHistory().catch(() => ({ data: { sales: [] } })),
      ]);

      const nextNotifications = buildNotifications(
        inventoryData.products ?? [],
        salesData.sales ?? [],
        loadNotificationState(),
      );

      setNotifications(nextNotifications);
    } catch (error) {
      console.error("Failed to load notifications", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    const handleFocus = () => refreshNotifications();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshNotifications]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((current) => current.map((notification) => (
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    )));

    setNotificationState((currentState) => {
      const nextState = {
        ...currentState,
        [notificationId]: {
          ...(currentState[notificationId] ?? {}),
          read: true,
          deleted: false,
          createdAt: currentState[notificationId]?.createdAt,
        },
      };
      saveNotificationState(nextState);
      return nextState;
    });
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications((current) => current.filter((notification) => notification.id !== notificationId));

    setNotificationState((currentState) => {
      const existing = currentState[notificationId] ?? {};
      const nextState = {
        ...currentState,
        [notificationId]: {
          ...existing,
          read: true,
          deleted: true,
          createdAt: existing.createdAt,
        },
      };
      saveNotificationState(nextState);
      return nextState;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));

    setNotificationState((currentState) => {
      const nextState = Object.fromEntries(
        Object.entries(currentState).map(([id, value]) => [id, { ...value, read: true }]),
      );
      saveNotificationState(nextState);
      return nextState;
    });
  }, []);

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    notificationState,
    refreshNotifications,
    markAsRead,
    removeNotification,
    markAllAsRead,
    persistState,
  }), [
    loading,
    markAllAsRead,
    markAsRead,
    notificationState,
    notifications,
    persistState,
    refreshNotifications,
    removeNotification,
    unreadCount,
  ]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => useContext(NotificationContext);
