// src/components/EmptyState.jsx
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen, faReceipt, faUsers,
  faBell, faChartBar, faPlus
} from "@fortawesome/free-solid-svg-icons";

const CONFIGS = {
  products: {
    icon: faBoxOpen,
    title: "No products yet",
    desc: "Add your first product to start tracking your stock and sales.",
    action: "Add Product",
    to: null, // handled by onAction
  },
  transactions: {
    icon: faReceipt,
    title: "No transactions yet",
    desc: "Record your first sale to see your transaction history here.",
    action: "Record Sale",
    to: "/record-sale",
  },
  customers: {
    icon: faUsers,
    title: "No customers yet",
    desc: "Add your first customer to start tracking buyer relationships.",
    action: "Add Customer",
    to: "/customers/new",
  },
  notifications: {
    icon: faBell,
    title: "All clear!",
    desc: "You have no notifications right now. We'll alert you when something needs attention.",
    action: null,
  },
  reports: {
    icon: faChartBar,
    title: "No data yet",
    desc: "Start recording sales to see your reports and analytics here.",
    action: "Record Sale",
    to: "/record-sale",
  },
  search: {
    icon: faBoxOpen,
    title: "No results found",
    desc: "Try a different search term or clear your filters.",
    action: null,
  },
};

export default function EmptyState({ type = "products", onAction, message }) {
  const navigate = useNavigate();
  const config = CONFIGS[type] ?? CONFIGS.products;

  const handleAction = () => {
    if (onAction) { onAction(); return; }
    if (config.to) navigate(config.to);
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4">
        <FontAwesomeIcon
          icon={config.icon}
          className="text-brand-400 text-3xl"
        />
      </div>

      {/* Text */}
      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">
        {config.title}
      </h3>
      <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs leading-relaxed">
        {message ?? config.desc}
      </p>

      {/* Action button */}
      {config.action && (
        <button
          onClick={handleAction}
          className="mt-6 flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          {config.action}
        </button>
      )}
    </div>
  );
}