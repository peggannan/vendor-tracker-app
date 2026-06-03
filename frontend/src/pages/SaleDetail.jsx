// src/pages/SaleDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSalesHistory } from "../api/api";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalesHistory()
      .then(({ data }) => {
        const found = data.sales.find((s) => s.id == id);
        setSale(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  if (!sale) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-400">Sale not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto">
      <Header title="Sale Details" />

      <div className="px-4 pt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          {/* Icon */}
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-4">
            <svg width="28" height="28" fill="none" stroke="#16a34a" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {sale.product_name}
          </h2>

          <div className="flex flex-col gap-0">
            {[
              { label: "Sale ID", value: `#${sale.id}` },
              { label: "Product", value: sale.product_name },
              { label: "Quantity", value: `${sale.quantity} units` },
              { label: "Total Amount", value: `₵${sale.total}`, highlight: true },
              { label: "Date", value: sale.created_at?.slice(0, 10) },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <span className="text-sm text-gray-400">{label}</span>
                <span className={`text-sm font-semibold ${highlight ? "text-brand-600" : "text-gray-800 dark:text-gray-100"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("/transactions")}
          className="w-full mt-4 py-3.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full"
        >
          Back to Transactions
        </button>
      </div>

      <Navbar />
    </div>
  );
}