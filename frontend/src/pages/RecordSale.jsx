import { useState } from "react"
import { useNavigate } from "react-router-dom"

const products = [
  { id: 1, name: "Mineral Water", price: 5, stock: 24 },
  { id: 2, name: "Biscuits", price: 3, stock: 4 },
  { id: 3, name: "Matches", price: 2, stock: 3 },
  { id: 4, name: "Candles", price: 4, stock: 2 },
  { id: 5, name: "Bread", price: 8, stock: 10 },
]

function RecordSale() {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [confirmed, setConfirmed] = useState(false)
  const navigate = useNavigate()

  const product = products.find((p) => p.id === Number(selectedProduct))
  const total = product ? product.price * quantity : 0

  function handleSale(e) {
    e.preventDefault()
    // TODO: connect to real API later
    setConfirmed(true)
  }

  function handleAnother() {
    setSelectedProduct("")
    setQuantity(1)
    setConfirmed(false)
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sale Recorded!</h2>
          <p className="text-sm text-gray-500 mb-2">{product.name} × {quantity}</p>
          <p className="text-2xl font-bold text-gray-900 mb-6">GH₵ {total}</p>
          <button
            onClick={handleAnother}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition mb-3"
          >
            Record Another Sale
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900">Record a Sale</h1>
        <p className="text-sm text-gray-500">What did you sell?</p>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSale}>

            {/* Product Picker */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
              >
                <option value="">Select a product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — GH₵ {p.price} ({p.stock} in stock)
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 text-lg font-bold hover:bg-gray-200 transition"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-gray-900 w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 text-lg font-bold hover:bg-gray-200 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            {product && (
              <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">GH₵ {total}</p>
              </div>
            )}

            {/* Stock warning */}
            {product && quantity > product.stock && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
                <p className="text-sm text-red-600">⚠️ Not enough stock. Only {product.stock} units available.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedProduct || quantity > (product?.stock || 0)}
              className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Sale
            </button>

          </form>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3">
        <button onClick={() => navigate("/dashboard")} className="text-xs text-gray-400 flex flex-col items-center gap-1">
          <span className="text-lg">🏠</span> Home
        </button>
        <button onClick={() => navigate("/record-sale")} className="text-xs text-gray-900 font-semibold flex flex-col items-center gap-1">
          <span className="text-lg">💰</span> Sale
        </button>
        <button onClick={() => navigate("/products")} className="text-xs text-gray-400 flex flex-col items-center gap-1">
          <span className="text-lg">📦</span> Products
        </button>
        <button onClick={() => navigate("/sales")} className="text-xs text-gray-400 flex flex-col items-center gap-1">
          <span className="text-lg">📋</span> History
        </button>
      </div>

    </div>
  )
}

export default RecordSale