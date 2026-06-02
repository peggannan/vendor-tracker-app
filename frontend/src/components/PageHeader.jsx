// src/components/PageHeader.jsx
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function PageHeader({ title, action }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b-2 border-brand-500 px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="w-8 h-8 rounded-full bg-brand-50 dark:bg-gray-800 flex items-center justify-center text-brand-600"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
      </button>

      <h1 className="font-bold text-gray-800 dark:text-gray-100 text-base">{title}</h1>

      {/* Optional right side action */}
      <div className="w-8">{action ?? null}</div>
    </div>
  );
}