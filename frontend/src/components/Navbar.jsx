// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBoxesStacked, faReceipt, faUsers } from "@fortawesome/free-solid-svg-icons";

const tabs = [
  { to: "/dashboard", label: "Home", icon: faHouse },
  { to: "/products", label: "Stock", icon: faBoxesStacked },
  { to: "/transactions", label: "Transactions", icon: faReceipt },
  { to: "/customers", label: "Customers", icon: faUsers },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-around py-3 z-10 max-w-lg mx-auto">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 ${isActive ? "text-brand-600" : "text-gray-400"}`
          }
        >
          {({ isActive }) => (
            <>
              <FontAwesomeIcon icon={icon} className={`text-lg ${isActive ? "text-brand-600" : "text-gray-400"}`} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-brand-600" : "text-gray-400"}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}