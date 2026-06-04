// src/pages/Settings.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../api/api";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Settings() {
  const { user, clearAuth } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [threshold, setThreshold] = useState(5);

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <Header title="Settings" />

      <div className="px-4 pt-4">

        {/* Profile card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
            {user?.name?.[0] ?? "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Account */}
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-1">Account</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm divide-y divide-gray-50 dark:divide-gray-700 mb-5">
          {[
            "Edit Name & Email",
            "Change Password",
          ].map((label) => (
            <button
              key={label}
              onClick={() => alert("TODO: connect to backend")}
              className="w-full text-left px-4 py-3.5 text-sm text-gray-700 dark:text-gray-200 flex items-center justify-between"
            >
              {label}
              <span className="text-gray-300">›</span>
            </button>
          ))}
        </div>

        {/* Staff */}
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-1">Staff</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm divide-y divide-gray-50 dark:divide-gray-700 mb-5">
          {[
            "Add Staff Member",
            "Remove Staff Member",
          ].map((label) => (
            <button
              key={label}
              onClick={() => alert("TODO: connect to backend")}
              className="w-full text-left px-4 py-3.5 text-sm text-gray-700 dark:text-gray-200 flex items-center justify-between"
            >
              {label}
              <span className="text-gray-300">›</span>
            </button>
          ))}
        </div>

        {/* Preferences */}
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-1">Preferences</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm divide-y divide-gray-50 dark:divide-gray-700 mb-5">

          {/* Dark mode toggle */}
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">Dark Mode</p>
              <p className="text-xs text-gray-400">{dark ? "Currently on" : "Currently off"}</p>
            </div>
            <button
              onClick={() => {
                toggle();
                // force the class update immediately
                document.documentElement.classList.toggle("dark");
              }}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative flex-shrink-0 ${dark ? "bg-brand-600" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${dark ? "left-7" : "left-1"}`}
              />
            </button>
          </div>

          {/* Low stock threshold */}
          <div className="px-4 py-3.5">
            <p className="text-sm text-gray-700 dark:text-gray-200 font-medium mb-1">Low Stock Alert</p>
            <p className="text-xs text-gray-400 mb-2">Alert when stock falls below this number</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-20 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
              <span className="text-sm text-gray-400">units</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 border border-red-200 text-red-500 font-semibold rounded-full"
        >
          Logout
        </button>
      </div>

      <Navbar />
    </div>
  );
}