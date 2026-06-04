// src/pages/Notifications.jsx
import { useEffect, useState } from "react";
import { getInventory } from "../api/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import EmptyState from "../components/EmptyState";

export default function Notifications() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getInventory()
      .then(({ data }) => {
        const lowStock = data.products
          .filter((p) => p.low_stock || p.stock <= 5)
          .map((p) => ({
            id: p.id,
            type: "low_stock",
            title: "Low Stock Alert",
            message: `${p.name} has only ${p.stock} units left.`,
            action: () => navigate("/products"),
            time: "Just now",
          }));
        setAlerts(lowStock);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const iconFor = (type) => {
    if (type === "low_stock") return (
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
    );
    return (
      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" fill="none" stroke="#6c47ff" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <PageHeader title="Notifications" />

      <div className="px-4 pt-4">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
        ) : alerts.length === 0 ? (
          <EmptyState type="notifications" />
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={alert.action}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-start gap-3 text-left w-full"
              >
                {iconFor(alert.type)}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{alert.message}</p>
                </div>
                <span className="text-xs text-gray-300 flex-shrink-0">{alert.time}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}