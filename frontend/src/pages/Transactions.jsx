// // src/pages/SalesHistory.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getSalesHistory } from "../api/api";
// import Header from "../components/Header";
// import Navbar from "../components/Navbar";

// export default function SalesHistory() {
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getSalesHistory()
//       .then(({ data }) => setSales(data.sales))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto">
//       <Header title="Transactions" />

//       <div className="px-4 pt-4">
//         {loading ? (
//           <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
//         ) : sales.length === 0 ? (
//           <p className="text-gray-400 text-sm text-center py-8">No sales recorded yet.</p>
//         ) : (
//           <div className="flex flex-col gap-3">
//             {sales.map((sale) => (
//               <div
//                 key={sale.id}
//                 onClick={() => navigate(`/transactions/${sale.id}`)}
//                 className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
//               >
//                 <div>
//                   <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
//                     {sale.product_name}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     Qty: {sale.quantity} · {sale.created_at?.slice(0, 10)}
//                   </p>
//                 </div>
//                 <p className="font-bold text-gray-800 dark:text-gray-100">
//                   ₵{sale.total}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Navbar />
//     </div>
//   );
// }











// src/pages/SalesHistory.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSalesHistory } from "../api/api";
import PageHeader from "../components/PageHeader";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { ListSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function StatusBadge({ status }) {
  const styles = {
    completed: "bg-green-50 text-green-600 border border-green-200",
    cancelled: "bg-red-50 text-red-500 border border-red-200",
    pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  };
  const icons = {
    completed: (
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9 2.5L4.5 8 2 5.5" />
      </svg>
    ),
    cancelled: (
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M8.5 2.5l-6 6M2.5 2.5l6 6" />
      </svg>
    ),
    pending: (
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 2.5v4l2.5 1.5" />
      </svg>
    ),
  };
  const labelMap = {
    completed: "Completed",
    cancelled: "Cancelled",
    pending: "Pending",
  };
  return (
    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] ?? styles.pending}`}>
      {icons[status] ?? icons.pending}
      {labelMap[status] ?? status}
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
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${styles[method] ?? "bg-gray-100 text-gray-500"}`}>
      {method}
    </span>
  );
}

const STATUS_FILTERS = ["All", "completed", "pending", "cancelled"];
const PAYMENT_FILTERS = ["All", "Cash", "Card", "Mobile Money", "Credit"];
const SORT_OPTIONS = [
  { value: "desc", label: "Newest first" },
  { value: "asc", label: "Oldest first" },
];

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    getSalesHistory()
      .then(({ data }) => setSales(data.sales))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return [...sales]
      .filter((s) => {
        const matchStatus = statusFilter === "All" || s.status === statusFilter;
        const matchPayment = paymentFilter === "All" ||
          s.payment_method?.toLowerCase() === paymentFilter.toLowerCase();
        const matchSearch = search === "" ||
          s.customer_name?.toLowerCase().includes(normalizedSearch) ||
          s.product_name?.toLowerCase().includes(normalizedSearch) ||
          String(s.id).includes(search);
        const matchDate = dateFilter === "" || s.created_at?.slice(0, 10) === dateFilter;
        return matchStatus && matchPayment && matchSearch && matchDate;
      })
      .sort((left, right) => {
        const leftTime = new Date(left.created_at || 0).getTime();
        const rightTime = new Date(right.created_at || 0).getTime();
        return sortOrder === "asc" ? leftTime - rightTime : rightTime - leftTime;
      });
  }, [sales, statusFilter, paymentFilter, search, dateFilter, sortOrder]);

  const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
  const avgBasket = sales.length ? (totalSales / sales.length).toFixed(0) : 0;
  const pendingCount = sales.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <Header />
      <PageHeader title="Transactions" />

      <div className="px-4 pt-4">

        {/* Page title + Record Sale */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <button
            onClick={() => navigate("/record-sale")}
            className="flex items-center gap-1.5 bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-full"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            Record Sale
          </button>
        </div>

        {/* Summary pills */}

        {/* Summary pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {[
            { label: "Total Sales", value: `₵${totalSales.toFixed(0)}` },
            { label: "Average Basket", value: `₵${avgBasket}` },
            { label: "Pending TX", value: pendingCount },
          ].map(({ label, value }) => (
            <div key={label} className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 shadow-sm">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
              <p className="text-base font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 gap-2 mb-4 shadow-sm">
          <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="6" cy="6" r="5" />
            <path d="M13 13l-3-3" />
          </svg>
          <input
            type="text"
            placeholder="Search by customer, bill ID, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>

        {/* Date filter + sort */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Sort by Date
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth="2">
              <path d="M1 3h10M3 6h6M5 9h2" />
            </svg>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter List</span>
          </div>
          {/* Status filters */}
          <div className="flex gap-2 flex-wrap mb-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  statusFilter === f
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                }`}
              >
                {f === "completed" ? "Completed" : f === "cancelled" ? "Cancelled" : f === "pending" ? "Pending" : f}
              </button>
            ))}
          </div>
          {/* Payment filters */}
          <div className="flex gap-2 flex-wrap">
            {PAYMENT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setPaymentFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  paymentFilter === f
                    ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction cards */}
        {loading ? (
          <ListSkeleton count={4} type="transaction" />
        ) : filtered.length === 0 ? (
          <EmptyState type={search || statusFilter !== "All" ? "search" : "transactions"} />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((sale) => (
              <div
                key={sale.id}
                onClick={() => navigate(`/transactions/${sale.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
              >
                {/* Date + Bill ID */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <rect x="1" y="2" width="11" height="10" rx="1.5" />
                      <path d="M1 5h11M3.5 1v2M7.5 1v2" />
                    </svg>
                    <span className="text-xs text-gray-400">{sale.created_at?.slice(0, 10)}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Bill ID: TX-{sale.id}</span>
                </div>

                {/* Avatar + name + amount + payment */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                      {(sale.customer_name ?? sale.product_name)?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                        {sale.customer_name ?? "Customer"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {sale.product_name} (x{sale.quantity})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-gray-100">₵{sale.total}</p>
                    <PaymentBadge method={sale.payment_method ?? "CASH"} />
                  </div>
                </div>

                {/* Line items */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 mb-3 flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{sale.product_name} × {sale.quantity}</span>
                    <span>₵{sale.total}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-200 border-t border-gray-200 dark:border-gray-600 pt-1 mt-0.5">
                    <span>Total Cost Charged</span>
                    <span>₵{sale.total}</span>
                  </div>
                </div>

                {/* Staff + status */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Recorded By:{" "}
                    <span className="font-bold text-gray-600 dark:text-gray-300">
                      {sale.staff_name ?? "—"}
                    </span>
                  </p>
                  <StatusBadge status={sale.status ?? "Approved"} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}