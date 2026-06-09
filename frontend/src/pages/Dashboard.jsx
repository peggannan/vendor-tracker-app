// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, getSalesHistory } from "../api/api";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { ListSkeleton, StatSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

// Status badge component
function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-green-50 text-green-600 border border-green-200",
    Rejected: "bg-red-50 text-red-500 border border-red-200",
    Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  };
  const icons = {
    Approved: (
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10 3L5 8.5 2 5.5" />
      </svg>
    ),
    Rejected: (
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9 3L3 9M3 3l6 6" />
      </svg>
    ),
  };
  return (
    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] ?? styles.Pending}`}>
      {icons[status]}
      {status}
    </span>
  );
}

// Payment method badge
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

// Avatar circle
function Avatar({ name }) {
  return (
    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboard(), getSalesHistory()])
      .then(([dashRes, salesRes]) => {
        setStats(dashRes.data);
        setSales([...salesRes.data.sales].reverse().slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location.key]);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <Header />

      <div className="px-4 pt-5">

        

        {/* Page title + Record Sale button */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Overview Dashboard
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Period 1 Jan 2026 – {today}</p>
          </div>
          {/* <button
            onClick={() => navigate("/record-sale")}
            className="flex items-center gap-1.5 bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-full flex-shrink-0"
          >
            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M7 2v10M2 7h10" />
            </svg>
            Record Sale
          </button> */}
        </div>

        {/* 4 Stat Pills */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {loading ? (
            <><StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton /></>
          ) : (
            <>
              {/* Today */}
              <div className="bg-brand-600 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Today</p>
                <p className="text-xl font-bold text-white">₵{stats?.total_revenue ?? 0}</p>
                <p className="text-xs text-white/60 mt-0.5">Daily Total</p>
              </div>

              {/* This Week */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">This Week</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₵{stats?.weekly_revenue ?? 0}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {(stats?.weekly_change ?? 0) >= 0 ? (
                    <>
                      <svg width="10" height="10" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M5 8V2M2 5l3-3 3 3" /></svg>
                      <span className="text-xs text-green-500 font-medium">{stats?.weekly_change ?? 0}%</span>
                    </>
                  ) : (
                    <>
                      <svg width="10" height="10" fill="none" stroke="#dc2626" strokeWidth="2.5"><path d="M5 2v6M2 5l3 3 3-3" /></svg>
                      <span className="text-xs text-red-500 font-medium">{stats?.weekly_change ?? 0}%</span>
                    </>
                  )}
                </div>
              </div>

              {/* Low Stock */}
              <div className={`rounded-2xl p-4 shadow-sm border ${
                stats?.low_stock?.length > 0
                  ? "bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900"
                  : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
              }`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Low Stock</p>
                {stats?.low_stock?.length > 0 ? (
                  <>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
                      {stats.low_stock[0].name}
                    </p>
                    <p className="text-xs text-red-500 font-medium mt-0.5">
                      ⚠ {stats.low_stock[0].stock} left
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold text-green-500">✓</p>
                    <p className="text-xs text-green-500 mt-0.5">All stocked</p>
                  </>
                )}
              </div>

              {/* Total Customers */}
              <div
                onClick={() => navigate("/customers")}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Customers</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.total_customers ?? 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">Unique accounts</p>
              </div>
            </>
          )}
        </div>

        {/* Highlight Top Match banner */}
        {stats?.top_product && (
          <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-4 mb-5 flex items-center justify-between overflow-hidden relative">
            <div className="flex-1">
              <span className="text-[9px] font-bold tracking-widest text-gray-300 uppercase bg-brand-600/60 px-2 py-0.5 rounded-full">
                Highlight Top Match
              </span>
              <p className="text-white font-bold text-base mt-2 mb-1">
                {stats.top_product.name}
              </p>
              <p className="text-xs text-gray-300">
                Most popular choice with{" "}
                <span
                  onClick={() => navigate("/products")}
                  className="text-brand-400 font-semibold underline cursor-pointer"
                >
                  {stats.top_product.units_sold} units sold
                </span>{" "}
                recently!
              </p>
            </div>
            {/* Decorative circle */}
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 flex items-center justify-center ml-3 flex-shrink-0">
              <svg width="28" height="28" fill="none" stroke="#a78bfa" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Transaction History
          </p>
          <button
            onClick={() => navigate("/transactions")}
            className="text-xs text-gray-400 underline font-medium"
          >
            View More
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
        ) : sales.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No transactions yet</p>
        ) : (
          <div className="flex flex-col gap-3">

            {/* refresh dashboard transactions after a sale is created */}
            {sales.map((sale) => (
              <div
                key={sale.id}
                onClick={() => navigate(`/transactions/${sale.id}`)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-[0.98] transition-transform"
              >
                {/* Top row — date + ID */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <rect x="1" y="2" width="12" height="11" rx="1.5" />
                      <path d="M1 5h12M4 1v2M8 1v2" />
                    </svg>
                    <span className="text-xs text-gray-400">
                      {sale.created_at?.slice(0, 10)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">#{product_name}</span>
                </div>

                {/* Middle row — product image + name + amount */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {/* Product image or fallback icon */}
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {sale.product_image ? (
                        <img
                          src={sale.product_image}
                          alt={sale.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="#6c47ff" strokeWidth="1.5">
                          <path d="M9 1L1 5l8 4 8-4-8-4zM1 13l8 4 8-4M1 9l8 4 8-4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white text-sm">
                        {sale.product_name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {sale.customer_name ? `By: ${sale.customer_name}` : "Walk-in"} · x{sale.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                      ₵ {sale.total}
                    </p>
                    <PaymentBadge method={sale.payment_method ?? "CASH"} />
                  </div>
                </div>

                {/* Bottom row — customer name + status */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    By:{" "}
                    <span className="font-semibold text-gray-600 dark:text-gray-200">
                      {sale.customer_name ?? "—"}
                    </span>
                  </p>
                  <StatusBadge status={sale.status ?? "Approved"} />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FAB */}
      <div className="lg:hidden fixed bottom-20 flex flex-col items-end gap-3 z-20" style={{ right: "max(1rem, calc((100vw - 512px) / 2 + 1rem))" }}>
        {fabOpen && (
          <>
            <button
              onClick={() => { navigate("/record-sale"); setFabOpen(false); }}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
            >
              <svg width="18" height="18" fill="none" stroke="#6c47ff" strokeWidth="2">
                <path d="M9 2v14M2 9h14" />
              </svg>
              Record Sale
            </button>
            <button
              onClick={() => { navigate("/products"); setFabOpen(false); }}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
            >
              <svg width="18" height="18" fill="none" stroke="#6c47ff" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              </svg>
              Add Product
            </button>
          </>
        )}
        <button
          onClick={() => setFabOpen((o) => !o)}
          className={`w-14 h-14 rounded-full bg-brand-600 shadow-lg flex items-center justify-center transition-transform duration-200 ${fabOpen ? "rotate-45" : ""}`}
        >
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {fabOpen && (
        <div className="lg:hidden fixed inset-0 z-10" onClick={() => setFabOpen(false)} />
      )}

      <Navbar />
    </div>
  );
}





// // src/pages/Dashboard.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getDashboard, getSalesHistory } from "../api/api";
// import Header from "../components/Header";
// import Navbar from "../components/Navbar";

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fabOpen, setFabOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     Promise.all([getDashboard(), getSalesHistory()])
//       .then(([dashRes, salesRes]) => {
//         setStats(dashRes.data);
//         setSales(salesRes.data.sales.slice(0, 5));
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto">
//       <Header title="App Name" />

//       <div className="px-4 pt-4">

//         {/* Overview Cards */}
//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <button
//               onClick={() => navigate("/transactions")}
//               className="bg-brand-600 rounded-2xl p-4 text-left"
//             >
//               <p className="text-xs text-white/70 mb-1">Today's Sales</p>
//               <p className="text-xl font-bold text-white">
//                 {loading ? "—" : `₵${stats?.total_revenue ?? 0}`}
//               </p>
//               <div className="flex items-center gap-1 mt-1">
//                 {stats?.daily_change >= 0 ? (
//                   <>
//                     <svg width="14" height="14" fill="none" stroke="#86efac" strokeWidth="2">
//                       <path d="M7 11V3M3 7l4-4 4 4" />
//                     </svg>
//                     <span className="text-xs text-green-300">+{stats?.daily_change ?? 0}%</span>
//                   </>
//                 ) : (
//                   <>
//                     <svg width="14" height="14" fill="none" stroke="#fca5a5" strokeWidth="2">
//                       <path d="M7 3v8M3 7l4 4 4-4" />
//                     </svg>
//                     <span className="text-xs text-red-300">{stats?.daily_change ?? 0}%</span>
//                   </>
//                 )}
//               </div>
//             </button>

//             <button
//               onClick={() => navigate("/transactions")}
//               className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-left"
//             >
//               <p className="text-xs text-gray-400 mb-1">This Week</p>
//               <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
//                 {loading ? "—" : `₵${stats?.weekly_revenue ?? 0}`}
//               </p>
//               <div className="flex items-center gap-1 mt-1">
//                 {stats?.weekly_change >= 0 ? (
//                   <>
//                     <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2">
//                       <path d="M7 11V3M3 7l4-4 4 4" />
//                     </svg>
//                     <span className="text-xs text-green-500">+{stats?.weekly_change ?? 0}%</span>
//                   </>
//                 ) : (
//                   <>
//                     <svg width="14" height="14" fill="none" stroke="#dc2626" strokeWidth="2">
//                       <path d="M7 3v8M3 7l4 4 4-4" />
//                     </svg>
//                     <span className="text-xs text-red-500">{stats?.weekly_change ?? 0}%</span>
//                   </>
//                 )}
//               </div>
//             </button>
//           </div>

//         {/* Top Product */}
//         {stats?.top_product && (
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Top Product</p>
//               <p className="font-semibold text-gray-800 dark:text-gray-100">
//                 {stats.top_product.name}
//               </p>
//               <p className="text-xs text-gray-400">
//                 {stats.top_product.units_sold} units sold
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/products")}
//               className="text-xs text-brand-600 font-semibold"
//             >
//               View More
//             </button>
//           </div>
//         )}

//         {/* Low Stock Alerts */}
//         {stats?.low_stock?.length > 0 && (
//           <div className="bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-2xl p-4 mb-4">
//             <p className="text-sm font-semibold text-red-500 mb-2">
//               ⚠ Low Stock Alerts
//             </p>
//             {stats.low_stock.map((item) => (
//               <div key={item.id} className="flex justify-between text-sm py-1">
//                 <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
//                 <span className="text-red-500 font-medium">{item.stock} left</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Transaction History */}
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="font-semibold text-gray-800 dark:text-gray-100">
//             Recent Transactions
//           </h2>
//           <button
//             onClick={() => navigate("/transactions")}
//             className="text-xs text-brand-600 font-semibold"
//           >
//             View all
//           </button>
//         </div>

//         {loading ? (
//           <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
//         ) : sales.length === 0 ? (
//           <p className="text-gray-400 text-sm text-center py-8">
//             No transactions yet
//           </p>
//         ) : (
//           <div className="flex flex-col gap-3">
//             {sales.map((sale) => (
//               <div
//                 key={sale.id}
//                 className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between"
//               >
//                 <div>
//                   <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
//                     {sale.product_name}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     {sale.created_at?.slice(0, 10)}
//                   </p>
//                 </div>
//                 <p className="font-semibold text-gray-800 dark:text-gray-100">
//                   ₵{sale.total}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* FAB Dropdown */}
//       <div className="fixed bottom-20 right-4 flex flex-col items-end gap-3 z-20">
//         {fabOpen && (
//           <>
//             <button
//               onClick={() => { navigate("/record-sale"); setFabOpen(false); }}
//               className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
//             >
//               <svg width="18" height="18" fill="none" stroke="#6c47ff" strokeWidth="2">
//                 <path d="M12 5v14M5 12h14" />
//               </svg>
//               Record Sale
//             </button>

//             <button
//               onClick={() => { navigate("/products"); setFabOpen(false); }}
//               className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
//             >
//               <svg width="18" height="18" fill="none" stroke="#6c47ff" strokeWidth="2">
//                 <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
//               </svg>
//               Add Product
//             </button>
//           </>
//         )}

//         {/* Main FAB */}
//         <button
//           onClick={() => setFabOpen((o) => !o)}
//           className={`w-14 h-14 rounded-full bg-brand-600 shadow-lg flex items-center justify-center transition-transform duration-200 ${fabOpen ? "rotate-45" : ""}`}
//         >
//           <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2.5">
//             <path d="M12 5v14M5 12h14" />
//           </svg>
//         </button>
//       </div>

//       {/* Tap outside to close FAB */}
//       {fabOpen && (
//         <div className="fixed inset-0 z-10" onClick={() => setFabOpen(false)} />
//       )}

//       <Navbar />
//     </div>
//   );
// }