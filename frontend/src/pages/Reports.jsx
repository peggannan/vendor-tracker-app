// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import { getSalesHistory, getProducts, getCustomers } from "../api/api";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp, faArrowTrendDown,
  faBoxesStacked, faUsers, faReceipt
} from "@fortawesome/free-solid-svg-icons";
import { StatSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

function StatCard({ label, value, sub, icon, trend, trendValue }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-brand-600 text-sm" />
        </div>
        {trendValue !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
            <FontAwesomeIcon icon={trend >= 0 ? faArrowTrendUp : faArrowTrendDown} className="text-xs" />
            {Math.abs(trendValue)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// Custom tooltip for charts
function CustomTooltip({ active, payload, label, prefix = "₵" }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-brand-600">
          {prefix}{parseFloat(payload[0].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
}

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7"); // days

  useEffect(() => {
    Promise.all([getSalesHistory(), getProducts(), getCustomers()])
      .then(([s, p, c]) => {
        setSales(s.data.sales ?? []);
        setProducts(p.data.products ?? []);
        setCustomers(c.data.customers ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter sales by period
  const filteredSales = sales.filter((s) => {
    if (period === "all") return true;
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(s.created_at) >= cutoff && s.status === "Approved";
  });

  // Total revenue
  const totalRevenue = filteredSales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

  // Average order value
  const avgOrder = filteredSales.length ? totalRevenue / filteredSales.length : 0;

  // Revenue by day for area chart
  const revenueByDay = (() => {
    const map = {};
    const days = period === "all" ? 30 : parseInt(period);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }
    filteredSales.forEach((s) => {
      const key = s.created_at?.slice(0, 10);
      if (key && map[key] !== undefined) {
        map[key] += parseFloat(s.total || 0);
      }
    });
    return Object.entries(map).map(([date, revenue]) => ({
      date: date.slice(5), // MM-DD
      revenue,
    }));
  })();

  // Top products by revenue
  const topProducts = (() => {
    const map = {};
    filteredSales.forEach((s) => {
      const name = s.product_name ?? "Unknown";
      if (!map[name]) map[name] = 0;
      map[name] += parseFloat(s.total || 0);
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + "…" : name, value }));
  })();

  // Payment method breakdown for pie
  const paymentBreakdown = (() => {
    const map = {};
    filteredSales.forEach((s) => {
      const method = s.payment_method ?? "CASH";
      if (!map[method]) map[method] = 0;
      map[method] += parseFloat(s.total || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  // Sales by day of week
  const salesByDay = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    filteredSales.forEach((s) => {
      const day = days[new Date(s.created_at).getDay()];
      map[day] += parseFloat(s.total || 0);
    });
    return days.map((day) => ({ day, revenue: map[day] }));
  })();

  const PERIODS = [
    { label: "7D", value: "7" },
    { label: "14D", value: "14" },
    { label: "30D", value: "30" },
    { label: "All", value: "all" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <PageHeader title="Reports & Analytics" />

      <div className="px-4 pt-4 lg:px-8 lg:pt-6">

        {/* Period selector */}
        <div className="flex items-center gap-2 mb-5">
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                period === value
                  ? "bg-brand-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl h-52 animate-pulse" />
            <div className="bg-white dark:bg-gray-800 rounded-2xl h-52 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <StatCard
                label="Total Revenue"
                value={`₵${totalRevenue.toFixed(2)}`}
                icon={faArrowTrendUp}
                sub={`${filteredSales.length} transactions`}
              />
              <StatCard
                label="Avg Order Value"
                value={`₵${avgOrder.toFixed(2)}`}
                icon={faReceipt}
                sub="Per transaction"
              />
              <StatCard
                label="Total Products"
                value={products.length}
                icon={faBoxesStacked}
                sub={`${products.filter((p) => p.is_low_stock).length} low stock`}
              />
              <StatCard
                label="Total Customers"
                value={customers.length}
                icon={faUsers}
                sub="Registered buyers"
              />
            </div>

            {/* Revenue over time — area chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
              <p className="font-bold text-gray-900 dark:text-white text-sm mb-4">
                Revenue Over Time
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={revenueByDay}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(revenueByDay.length / 5)}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₵${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top products + Payment breakdown — side by side on desktop */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-4 flex flex-col gap-4 mb-4">

              {/* Top products bar chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-4">
                  Top Products by Revenue
                </p>
                {topProducts.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₵${v}`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        tickLine={false}
                        axisLine={false}
                        width={70}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#7c3aed" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Payment method pie chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-4">
                  Payment Methods
                </p>
                {paymentBreakdown.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
                ) : (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="60%" height={160}>
                      <PieChart>
                        <Pie
                          data={paymentBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {paymentBreakdown.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2 flex-1">
                      {paymentBreakdown.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              ₵{parseFloat(item.value).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sales by day of week */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
              <p className="font-bold text-gray-900 dark:text-white text-sm mb-4">
                Sales by Day of Week
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₵${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Low stock table */}
            {products.filter((p) => p.is_low_stock).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-4">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    Low Stock Alert
                  </p>
                </div>
                {products
                  .filter((p) => p.is_low_stock)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-200">{p.name}</p>
                      <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded-full">
                        {p.stock} left
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      <Navbar />
    </div>
  );
}