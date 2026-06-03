// src/pages/Customers.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "../api/api";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone, faEnvelope, faTrophy,
  faMagnifyingGlass, faUserPlus, faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";

const LOYALTY_RANKS = [
  { label: "ELITE BRONZE", min: 0, color: "text-amber-600" },
  { label: "SILVER", min: 15, color: "text-gray-400" },
  { label: "GOLD", min: 30, color: "text-yellow-500" },
  { label: "PLATINUM", min: 50, color: "text-blue-500" },
];

function getLoyaltyRank(purchases) {
  return [...LOYALTY_RANKS].reverse().find((r) => purchases >= r.min) ?? LOYALTY_RANKS[0];
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCustomers()
      .then(({ data }) => setCustomers(data.customers))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    search === "" ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const topCustomer = [...customers].sort((a, b) => b.purchases - a.purchases)[0];
  const topRank = topCustomer ? getLoyaltyRank(topCustomer.purchases) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto">
      <Header />
      <PageHeader title="Customers" />

      <div className="px-4 pt-4">

        {/* Page title + Add Buyer */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Customer Relations
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Observe buyer behavior and frequent shoppers
            </p>
          </div>
          <button
            onClick={() => navigate("/customers/new")}
            className="flex items-center gap-1.5 bg-brand-600 text-white text-xs font-bold px-3 py-2.5 rounded-full flex-shrink-0"
          >
            <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
            Add Buyer
          </button>
        </div>

        {/* Frequent buyer highlight */}
        {topCustomer && (
          <div
            onClick={() => navigate(`/customers/${topCustomer.id}`)}
            className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 mb-4 cursor-pointer"
          >
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center mb-3">
              Frequent Buyer Match
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faTrophy} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">
                    {topCustomer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Logged{" "}
                    <span className="text-amber-600 font-bold">
                      {topCustomer.purchases} purchases
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    totaling ₵{topCustomer.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                  Loyalty Rank
                </p>
                <p className={`text-sm font-black ${topRank?.color}`}>
                  {topRank?.label}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 gap-2 mb-4 shadow-sm">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-xs flex-shrink-0" />
          <input
            type="text"
            placeholder="Filter buyers by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>

        {/* Customer list */}
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No customers found</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((c) => {
              const rank = getLoyaltyRank(c.purchases);
              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/customers/${c.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon avatar */}
                    <div className="w-11 h-11 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-600 font-black text-base">
                        {c.name[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                        {c.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-[10px]" />
                        <span className="text-xs text-gray-400">{c.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-[10px]" />
                        <span className="text-xs text-gray-400 truncate">{c.email}</span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                        ₵{c.total.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Total Spent
                      </p>
                      <span className="text-[10px] bg-brand-50 text-brand-600 font-semibold px-2 py-0.5 rounded-full">
                        {c.purchases} purchases
                      </span>
                    </div>
                  </div>

                  {/* Credit owed warning */}
                  {c.credit_owed > 0 && (
                    <div className="mt-3 flex items-center gap-2 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-xl px-3 py-2">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-xs" />
                      <p className="text-xs text-red-500 font-semibold">
                        Credit owed: ₵{c.credit_owed.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}







// // // src/pages/Customers.jsx
// // // NOTE: Backend does not have a /customers endpoint in the agreed contract yet.
// // // This page shows frequent buyers derived from sales data.
// // // Discuss with backend partner to add GET /api/customers when ready.

// // import { useEffect, useState } from "react";
// // import { getSalesHistory } from "../api/api";
// // import Header from "../components/Header";
// // import Navbar from "../components/Navbar";

// // export default function Customers() {
// //   const [customers, setCustomers] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     // Temporary: derive customer insights from sales until backend adds the endpoint
// //     getSalesHistory()
// //       .then(({ data }) => {
// //         // Count purchases per product as a proxy for customer frequency
// //         const map = {};
// //         data.sales.forEach((s) => {
// //           if (!map[s.product_name]) map[s.product_name] = { name: s.product_name, count: 0, total: 0 };
// //           map[s.product_name].count += 1;
// //           map[s.product_name].total += parseFloat(s.total);
// //         });
// //         setCustomers(Object.values(map).sort((a, b) => b.count - a.count));
// //       })
// //       .catch(console.error)
// //       .finally(() => setLoading(false));
// //   }, []);

// //   return (
// //     <div className="min-h-screen bg-gray-50 pb-24 max-w-lg mx-auto">
// //       <Header title="Customers" />

// //       <div className="px-4 pt-4">
// //         <p className="text-xs text-gray-400 mb-4">Top products by frequency (customer endpoint coming soon)</p>

// //         {loading ? (
// //           <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
// //         ) : customers.length === 0 ? (
// //           <p className="text-gray-400 text-sm text-center py-8">No data yet.</p>
// //         ) : (
// //           <div className="flex flex-col gap-3">
// //             {customers.map((c, i) => (
// //               <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
// //                 <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
// //                   {c.name[0]}
// //                 </div>
// //                 <div className="flex-1">
// //                   <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
// //                   <p className="text-xs text-gray-400">{c.count} purchases · ₵{c.total.toFixed(2)} total</p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       <Navbar />
// //     </div>
// //   );
// // }









// // src/pages/Customers.jsx
// import { useEffect, useState } from "react";
// import { getSalesHistory } from "../api/api";
// import Header from "../components/Header";
// import PageHeader from "../components/PageHeader";
// import Navbar from "../components/Navbar";

// const LOYALTY_RANKS = [
//   { label: "ELITE BRONZE", min: 0, color: "text-amber-600", bg: "bg-amber-50" },
//   { label: "SILVER", min: 20, color: "text-gray-500", bg: "bg-gray-100" },
//   { label: "GOLD", min: 40, color: "text-yellow-500", bg: "bg-yellow-50" },
//   { label: "PLATINUM", min: 60, color: "text-blue-500", bg: "bg-blue-50" },
// ];

// function getLoyaltyRank(purchases) {
//   return [...LOYALTY_RANKS].reverse().find((r) => purchases >= r.min) ?? LOYALTY_RANKS[0];
// }

// export default function Customers() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     getSalesHistory()
//       .then(({ data }) => {
//         const map = {};
//         data.sales.forEach((s) => {
//           const key = s.customer_name ?? s.product_name;
//           if (!map[key]) {
//             map[key] = {
//               name: key,
//               phone: s.customer_phone ?? "+233 00 000 0000",
//               email: s.customer_email ?? `${key.split(" ")[0].toLowerCase()}@example.com`,
//               purchases: 0,
//               total: 0,
//             };
//           }
//           map[key].purchases += 1;
//           map[key].total += parseFloat(s.total || 0);
//         });
//         setCustomers(
//           Object.values(map).sort((a, b) => b.purchases - a.purchases)
//         );
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const filtered = customers.filter((c) =>
//     search === "" ||
//     c.name.toLowerCase().includes(search.toLowerCase()) ||
//     c.email.toLowerCase().includes(search.toLowerCase()) ||
//     c.phone.includes(search)
//   );

//   const topCustomer = customers[0];
//   const topRank = topCustomer ? getLoyaltyRank(topCustomer.purchases) : null;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto">
//       <PageHeader title="Customers"/>

//       <div className="px-4 pt-4">

//         {/* Page title */}
//         <div className="flex items-start justify-between mb-4">
//           <div>
//             <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
//               Customer Relations
//             </h1>
//             <p className="text-xs text-gray-400 mt-0.5">
//               Observe buyer behavior and frequent shoppers
//             </p>
//           </div>
//           <button className="flex items-center gap-1.5 bg-brand-600 text-white text-xs font-bold px-3 py-2.5 rounded-full flex-shrink-0">
//             <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5">
//               <path d="M9 1a4 4 0 110 6 4 4 0 010-6zM1 11a8 8 0 0116 0" />
//               <path d="M13 6v4M11 8h4" />
//             </svg>
//             Add Buyer
//           </button>
//         </div>

//         {/* Frequent buyer highlight */}
//         {topCustomer && (
//           <div className="bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-2xl p-4 mb-4">
//             <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center mb-3">
//               Frequent Buyer Match
//             </p>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 {/* Trophy icon */}
//                 <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
//                   <svg width="20" height="20" fill="none" stroke="#d97706" strokeWidth="1.5">
//                     <path d="M8 21H6a2 2 0 01-2-2v-1a2 2 0 012-2h12a2 2 0 012 2v1a2 2 0 01-2 2h-2" />
//                     <path d="M12 16V8" />
//                     <path d="M5 8H3V5h2M19 8h2V5h-2" />
//                     <path d="M5 5a7 7 0 0014 0H5z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-bold text-gray-800 dark:text-gray-100">{topCustomer.name}</p>
//                   <p className="text-xs text-gray-500">
//                     Logged{" "}
//                     <span className="text-amber-600 font-bold">{topCustomer.purchases} purchases</span>
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     totaling ₵{topCustomer.total.toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-[9px] text-gray-400 uppercase tracking-wider">Loyalty Rank</p>
//                 <p className={`text-sm font-black ${topRank?.color}`}>
//                   {topRank?.label}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Search */}
//         <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 gap-2 mb-4 shadow-sm">
//           <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2">
//             <circle cx="6" cy="6" r="5" />
//             <path d="M13 13l-3-3" />
//           </svg>
//           <input
//             type="text"
//             placeholder="Filter buyers by name, cell digits or mail search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="bg-transparent text-xs text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-full"
//           />
//         </div>

//         {/* Customer list */}
//         {loading ? (
//           <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
//         ) : filtered.length === 0 ? (
//           <p className="text-gray-400 text-sm text-center py-8">No customers found</p>
//         ) : (
//           <div className="flex flex-col gap-3">
//             {filtered.map((c, i) => (
//               <div
//                 key={i}
//                 className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-3"
//               >
//                 {/* Avatar */}
//                 <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-base flex-shrink-0">
//                   {c.name[0].toUpperCase()}
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1 min-w-0">
//                   <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{c.name}</p>
//                   <div className="flex items-center gap-1 mt-0.5">
//                     <svg width="10" height="10" fill="none" stroke="#9ca3af" strokeWidth="2">
//                       <path d="M9 1a3 3 0 11-4 4.5L1 9.5" />
//                     </svg>
//                     <span className="text-xs text-gray-400">{c.phone}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <svg width="10" height="10" fill="none" stroke="#9ca3af" strokeWidth="2">
//                       <rect x="1" y="2" width="12" height="9" rx="1" />
//                       <path d="M1 4l6 4 6-4" />
//                     </svg>
//                     <span className="text-xs text-gray-400">{c.email}</span>
//                   </div>
//                 </div>

//                 {/* Spent + purchases */}
//                 <div className="text-right flex-shrink-0">
//                   <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
//                     ₵{c.total.toFixed(2)}
//                   </p>
//                   <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total Spent</p>
//                   <span className="text-[10px] bg-brand-50 text-brand-600 font-semibold px-2 py-0.5 rounded-full">
//                     {c.purchases} purchases
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Navbar />
//     </div>
//   );
// }