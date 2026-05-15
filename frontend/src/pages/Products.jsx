import { useState } from "react"
import { useNavigate } from "react-router-dom"

const initialProducts = [
  { id: 1, name: "Mineral Water", price: 5, stock: 24 },
  { id: 2, name: "Biscuits", price: 3, stock: 4 },
  { id: 3, name: "Matches", price: 2, stock: 3 },
  { id: 4, name: "Candles", price: 4, stock: 2 },
  { id: 5, name: "Bread", price: 8, stock: 10 },
]

function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const navigate = useNavigate()

  function handleAdd(e) {
    e.preventDefault()
    const newProduct = {
      id: products.length + 1,
      name,
      price: Number(price),
      stock: Number(stock),
    }
    setProducts([...products, newProduct])
    setName("")
    setPrice("")
    setStock("")
    setShowForm(false)
  }

  function handleDelete(id) {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} items in your shop</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          + Add
        </button>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-4">New Product</p>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Product name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mineral Water"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price (GH₵)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stock (qty)</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`px-4 py-4 flex items-center justify-between ${
                index !== products.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">GH₵ {product.price} per unit</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-sm font-bold ${product.stock <= 5 ? "text-red-500" : "text-gray-900"}`}>
                    {product.stock} left
                  </p>
                  {product.stock <= 5 && (
                    <p className="text-xs text-red-400">Low stock</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-gray-300 hover:text-red-400 text-lg transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 max-w-lg mx-auto">
          <button onClick={() => navigate("/dashboard")} className="text-xs text-gray-400 flex flex-col items-center gap-1">
            <span className="text-lg">🏠</span> Home
          </button>
          <button onClick={() => navigate("/record-sale")} className="text-xs text-gray-400 flex flex-col items-center gap-1">
            <span className="text-lg">💰</span> Sale
          </button>
          <button onClick={() => navigate("/products")} className="text-xs text-gray-900 font-semibold flex flex-col items-center gap-1">
            <span className="text-lg">📦</span> Products
          </button>
          <button onClick={() => navigate("/sales")} className="text-xs text-gray-400 flex flex-col items-center gap-1">
            <span className="text-lg">📋</span> History
          </button>
        </div>

      </div>
    </div>
  )
}

export default Products