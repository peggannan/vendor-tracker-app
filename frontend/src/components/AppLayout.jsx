// src/components/AppLayout.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../api/api";
import { useNotifications } from "../context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faBoxesStacked, faReceipt,
  faUsers, faChartBar, faGear, faMoon,
  faSun, faRightFromBracket, faBell,
  faUserCircle, faPlus, faArrowRight, faTrash, faTriangleExclamation, faBell as faBellSolid
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import { formatNotificationDateTime } from "../utils/notifications";

const navItems = [
  { to: "/dashboard", label: "Home", icon: faHouse },
  { to: "/products", label: "Stock", icon: faBoxesStacked },
  { to: "/transactions", label: "Transactions", icon: faReceipt },
  { to: "/customers", label: "Customers", icon: faUsers },
  { to: "/reports", label: "Reports", icon: faChartBar },
];

const bottomItems = [
  { to: "/notifications", label: "Notifications", icon: faBell },
  { to: "/user-profile", label: "Profile", icon: faUserCircle },
  { to: "/settings", label: "Settings", icon: faGear },
];

export default function AppLayout({ children }) {
  const { user, clearAuth } = useAuth();
  const { dark, toggle } = useTheme();
  const {
    unreadCount,
    notifications,
    markAsRead,
    removeNotification,
  } = useNotifications() ?? {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {Array.isArray(notifications) && notifications.some((notification) => !notification.read) && (
        <div className="fixed top-20 right-4 left-4 z-[60] flex flex-col gap-3 pointer-events-none lg:left-auto lg:w-96">
          {notifications.filter((notification) => !notification.read).slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`pointer-events-auto rounded-2xl border bg-white dark:bg-gray-800 shadow-2xl p-4 ${notification.type === "low_stock" ? "border-red-200 dark:border-red-900/60" : "border-brand-200 dark:border-brand-900/60"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full ${notification.type === "low_stock" ? "bg-red-100 dark:bg-red-900" : "bg-brand-100"} flex items-center justify-center flex-shrink-0`}>
                  <FontAwesomeIcon
                    icon={notification.type === "low_stock" ? faTriangleExclamation : faBellSolid}
                    className={`${notification.type === "low_stock" ? "text-red-500" : "text-brand-600"} text-sm`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{notification.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.message}</p>
                  <p className="text-[11px] text-gray-400 mt-2">{formatNotificationDateTime(notification.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeNotification?.(notification.id)}
                  className="text-gray-300 hover:text-gray-500"
                  aria-label="Dismiss notification"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  markAsRead?.(notification.id);
                  navigate(notification.link || "/notifications");
                }}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 text-white text-xs font-semibold py-2"
              >
                Open
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── only visible on lg+ */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-20">

        {/* Logo + shop name */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
          <div>
            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">
              Shelfline
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight truncate max-w-[140px]">
              {user?.shopName ?? user?.name ?? "My Shop"}
            </p>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <FontAwesomeIcon
                    icon={icon}
                    className={`w-4 ${isActive ? "text-brand-600" : "text-gray-400"}`}
                  />
                  {label}
                  {/* Active indicator */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-3 mb-2 mt-4">
            Account
          </p>
          {bottomItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <FontAwesomeIcon
                    icon={icon}
                    className={`w-4 ${isActive ? "text-brand-600" : "text-gray-400"}`}
                  />
                  {label}
                  {label === "Notifications" && unreadCount > 0 && (
                    <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick action button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => navigate("/record-sale")}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} />
            Record Sale
          </button>
        </div>

        {/* User profile + theme toggle + logout */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3 flex flex-col gap-2">
          {/* Theme toggle */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {dark ? "Dark Mode" : "Light Mode"}
            </span>
            <button
              onClick={toggle}
              className={`w-10 h-5 rounded-full transition-colors relative ${dark ? "bg-brand-600" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${dark ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          {/* User info + logout */}
          <div
            onClick={() => navigate("/user-profile")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl text-sm font-medium w-full"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      {/* On desktop: push content right by sidebar width */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {children}
      </main>

    </div>
  );
}