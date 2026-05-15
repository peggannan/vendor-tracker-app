import { useNavigate } from "react-router-dom"

const stats = {
  total_revenue: 430,
  total_sales: 18,
  top_product: "Mineral Water",
  low_stock: ["Biscuits", "Matches", "Candles"]
}

const recent_sales = [
  { id: 1, product: "Mineral Water", qty: 3, total: 15, time: "9:30 AM" },
  { id: 2, product: "Biscuits", qty: 2, total: 6, time: "10:15 AM" },
  { id: 3, product: "Matches", qty: 5, total: 10, time: "11:00 AM" },
]

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Good morning 👋</h1>
          <p className="text-sm text-gray-500">Here's how your shop is doing today</p>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ⚙️
        </button>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Today's Revenue</p>
            <p className="text-2xl font-bold text-gray-900">GH₵ {stats.total_revenue}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Sales Today</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_sales}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Top Product</p>
            <p className="text-base font-semibold text-gray-900">{stats.top_product}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Low Stock Items</p>
            <p className="text-2xl font-bold text-red-500">{stats.low_stock.length}</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.low_stock.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-red-700 mb-2">⚠️ Low Stock Alert</p>
            <div className="flex flex-wrap gap-2">
              {stats.low_stock.map((item) => (
                <span key={item} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent Sales */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Recent Sales</p>
            <span
              onClick={() => navigate("/sales")}
              className="text-xs text-gray-500 cursor-pointer hover:underline"
            >
              View all
            </span>
          </div>
          {recent_sales.map((sale) => (
            <div key={sale.id} className="px-4 py-3 border-b border-gray-50 last:border-0 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{sale.product}</p>
                <p className="text-xs text-gray-500">Qty: {sale.qty} · {sale.time}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">GH₵ {sale.total}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/record-sale")}
            className="bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition"
          >
            + Record Sale
          </button>
          <button
            onClick={() => navigate("/products")}
            className="bg-white border border-gray-200 text-gray-900 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            View Products
          </button>
        </div>

      </div>
    </div>
  )
}

export default Dashboard