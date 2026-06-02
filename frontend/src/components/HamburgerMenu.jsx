// src/components/HamburgerMenu.jsx
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function HamburgerMenu({ isOpen, onClose }) {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    clearAuth();
    onClose();
  };

  if (!isOpen) return null;

  const links = [
    {to: "/user-profile", label: "My Profile"},
    { to: "/customers", label: "Customers" },
    { to: "/transactions", label: "Transactions" },
    { to: "/reports", label: "Reports" },
    { to: "/settings", label: "Settings" },
  ];

  return (
  <div className="fixed inset-0 z-50 flex">
    {/* Drawer - LEFT side */}
    <div className="w-72 bg-white dark:bg-gray-900 h-full flex flex-col p-6 shadow-xl">

      {/* Close button */}
      <button
        onClick={onClose}
        className="self-end mb-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      {/* Profile */}
      <div
        onClick={() => { navigate("/user-profile"); onClose(); }}
        className="flex items-center gap-3 mb-8 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
          {user?.name?.[0] ?? "U"}
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">{user?.name ?? "User"}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 py-3 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 py-3 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 font-medium mt-4"
      >
        Logout
      </button>
    </div>

    {/* Overlay - RIGHT side, closes menu on tap */}
    <div className="flex-1 bg-black/40" onClick={onClose} />
  </div>
);
}