// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import { getDashboard, getSalesHistory } from "../api/api";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getSalesHistory()])
      .then(([d, s]) => { setStats(d.data); setSales(s.data.sales); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-lg mx-auto">
      <Header title="Reports" />
      <PageHeader title="Reports" />

      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "Total Revenue", value: `₵${totalRevenue.toFixed(2)}` },
            { label: "Total Transactions", value: sales.length },
            { label: "Top Product", value: stats?.top_product?.name ?? "—" },
            { label: "Units Sold", value: stats?.top_product?.units_sold ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-lg font-bold text-gray-800">{loading ? "—" : value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-semibold text-gray-800 mb-3">Recent Transactions</p>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            sales.slice(0, 10).map((s) => (
              <div key={s.id} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{s.product_name}</span>
                <span className="text-sm font-medium text-gray-800">₵{s.total}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
}