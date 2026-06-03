// src/pages/TransactionDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSalesHistory } from "../api/api";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faBox, faCreditCard, faHashtag, faCircleCheck, faCircleXmark, faClock } from "@fortawesome/free-solid-svg-icons";

function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-green-50 text-green-600 border border-green-200",
    Rejected: "bg-red-50 text-red-500 border border-red-200",
    Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  };
  const icons = {
    Approved: faCircleCheck,
    Rejected: faCircleXmark,
    Pending: faClock,
  };
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${styles[status] ?? styles.Pending}`}>
      <FontAwesomeIcon icon={icons[status] ?? faClock} />
      {status}
    </span>
  );
}

function PaymentBadge({ method }) {
  const styles = {
    "MOBILE MONEY": "bg-purple-50 text-purple-600",
    CARD: "bg-blue-50 text-blue-600",
    CASH: "bg-green-50 text-green-600",
    CREDIT: "bg-orange-50 text-orange-600",
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${styles[method] ?? "bg-gray-100 text-gray-500"}`}>
      {method}
    </span>
  );
}

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalesHistory()
      .then(({ data }) => {
        const sales = data.sales ?? data.results ?? data ?? [];
        const found = sales.find((s) => s.id == id);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
      <p className="text-gray-400">Transaction not found</p>
      <button
        onClick={() => navigate("/transactions")}
        className="text-brand-600 font-semibold text-sm"
      >
        Back to Transactions
      </button>
    </div>
  );

  const rows = [
    { icon: faHashtag, label: "Transaction ID", value: `TX-${sale.id}` },
    { icon: faCalendar, label: "Date", value: sale.created_at?.slice(0, 10) },
    { icon: faBox, label: "Product", value: sale.product_name },
    { icon: faUser, label: "Customer", value: sale.customer_name ?? "—" },
    { icon: faUser, label: "Recorded By", value: sale.staff_name ?? "—" },
    { icon: faHashtag, label: "Quantity", value: `${sale.quantity} units` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto">
      <PageHeader title="Transaction Details" />

      <div className="px-4 pt-4">

        {/* Amount hero */}
        <div className="bg-brand-600 rounded-2xl p-5 mb-4 text-center">
          <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Total Amount</p>
          <p className="text-white font-black text-4xl mb-3">₵{sale.total}</p>
          <div className="flex items-center justify-center gap-2">
            <PaymentBadge method={sale.payment_method ?? "CASH"} />
            <StatusBadge status={sale.status ?? "Approved"} />
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Transaction Details</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {rows.map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={icon} className="text-brand-600 text-xs" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line items */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Bill Summary</p>
          </div>
          <div className="px-4 py-3 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {sale.product_name} × {sale.quantity}
              </span>
              <span className="text-gray-800 dark:text-gray-100 font-medium">₵{sale.total}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-gray-100 dark:border-gray-700 pt-2 mt-1">
              <span className="text-gray-800 dark:text-gray-100">Total Charged</span>
              <span className="text-brand-600">₵{sale.total}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/transactions")}
          className="w-full py-3.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-2xl"
        >
          Back to Transactions
        </button>
      </div>

      <Navbar />
    </div>
  );
}