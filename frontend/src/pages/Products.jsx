// src/pages/Products.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, addProduct, editProduct, deleteProduct } from "../api/api";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import { ListSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPlus, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

const CATEGORIES = ["All", "Groceries", "Beverages", "Electronics", "Apparel"];
const UNITS = ["piece", "sachet", "bottle", "bag", "kg", "g", "litre", "tin", "crate", "pack", "bunch", "tuber", "other"];

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product || { name: "", price: "", stock: "", category: "Groceries", base_cost: "", unit: "piece", expiry_date: "" }
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(product?.image ?? "");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile, product?.image]);

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Name and price are required");
    setLoading(true);
    try {
      const payload = { ...form, image_file: imageFile };
      if (product) {
        const { data } = await editProduct(product.id, payload);
        onSave(data.product, "edit");
      } else {
        const { data } = await addProduct(payload);
        onSave(data.product, "add");
      }
      onClose();
    } catch (err) {
      alert(err.response?.data?.error?.message || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg p-6">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">
          {product ? "Edit Product" : "Add Item"}
        </h3>
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pb-2">
          {[
            { label: "Product Name *", key: "name", type: "text" },
            { label: "Unit Sale Price (₵) *", key: "price", type: "number" },
            { label: "Unit Base Cost (₵)", key: "base_cost", type: "number" },
            { label: "Stock Quantity", key: "stock", type: "number" },
            { label: "Expiry Date (optional)", key: "expiry_date", type: "date" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 mb-1 block">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key] ?? ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Category</label>
            <input
              list="product-category-options"
              value={form.category ?? "Groceries"}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Enter or choose a category"
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            />
            <datalist id="product-category-options">
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Unit</label>
            <select
              value={form.unit ?? "piece"}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            />
            {imagePreview && (
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 h-28">
                <img src={imagePreview} alt={form.name || "Product preview"} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-brand-600 text-white rounded-full font-bold disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ThreeDotMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-20 w-32 overflow-hidden">
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ProductCard({ p, onNavigate, onEdit, onDelete }) {
  return (
    <div
      onClick={() => onNavigate(p.id)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform border border-gray-100 dark:border-gray-700"
    >
      {/* Product image */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-brand-100 dark:bg-brand-900/20">
        {p.image ? (
          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="22" height="22" fill="none" stroke="#7c3aed" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{p.name}</p>
        <p className="text-[10px] text-gray-400">SKU: {p.sku ?? `#${p.id}`}</p>
        <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-full font-medium">
          {p.category ?? "General"}
        </span>
      </div>

      {/* Price + stock */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">₵{p.price}</p>
        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
          p.is_low_stock || p.stock <= (p.low_stock_threshold ?? 5)
            ? "bg-red-50 text-red-500"
            : "bg-green-50 text-green-600"
        }`}>
          Qty: {p.stock}
        </div>
      </div>

      <ThreeDotMenu onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then(({ data }) => setProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (product, type) => {
    if (type === "add") setProducts((p) => [product, ...p]);
    else setProducts((p) => p.map((x) => (x.id === product.id ? product : x)));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch {
      alert("Could not delete product");
    }
  };

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const topProduct = [...products].sort((a, b) => (b.units_sold ?? 0) - (a.units_sold ?? 0))[0];
  const lowStockCount = products.filter((p) => p.is_low_stock || p.stock <= (p.low_stock_threshold ?? 5)).length;
  const totalSold = products.reduce((sum, p) => sum + (p.units_sold ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32 max-w-lg mx-auto lg:max-w-full">
      <Header />
      <PageHeader title="Products & Stock" />

      {/* Desktop title + Add button */}
      <div className="hidden lg:flex items-center justify-between px-8 pt-6 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products & Stock Inventory
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage stock levels, categories & parameters
          </p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-brand-600 text-white font-bold px-5 py-3 rounded-full hover:bg-brand-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Item
        </button>
      </div>

      {/* Two column layout on desktop */}
      <div className="px-4 pt-4 lg:px-8 lg:pt-4 lg:grid lg:grid-cols-[300px_1fr] lg:gap-6 flex flex-col gap-4">

        {/* LEFT COLUMN — filters and stats */}
        <div className="flex flex-col gap-4">

          {/* Stat pills */}
          <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
            {[
              { label: "Total Items", value: products.length },
              { label: "Low Stock", value: lowStockCount, sub: "Below threshold", danger: true },
              { label: "Total Sold", value: totalSold, success: true },
              { label: "Returned", value: 0 },
            ].map(({ label, value, sub, danger, success }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm text-center border border-gray-100 dark:border-gray-700">
                <p className="text-[9px] text-gray-400 uppercase tracking-wide leading-tight mb-1">{label}</p>
                <p className={`text-lg font-black leading-none ${danger ? "text-red-500" : success ? "text-green-500" : "text-gray-800 dark:text-gray-100"}`}>
                  {value}
                </p>
                {sub && (
                  <p className={`text-[8px] mt-0.5 leading-tight ${danger ? "text-red-400" : "text-gray-400"}`}>
                    {sub}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Top seller banner */}
          {topProduct && (
            <div
              onClick={() => navigate(`/products/${topProduct.id}`)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-brand-100 dark:bg-brand-900/20">
                  {topProduct.image ? (
                    <img src={topProduct.image} alt={topProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="22" height="22" fill="none" stroke="#7c3aed" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[9px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    ★ Best Seller
                  </span>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mt-0.5">{topProduct.name}</p>
                  <p className="text-xs text-gray-400">{topProduct.units_sold ?? 0} units sold recently</p>
                </div>
              </div>
              <button className="text-xs border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-xl font-medium flex-shrink-0">
                Inspect
              </button>
            </div>
          )}

          {/* Search bar */}
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 gap-2 shadow-sm">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-xs flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, SKU, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-gray-600 dark:text-gray-300 placeholder-gray-400 focus:outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <FontAwesomeIcon icon={faXmark} className="text-gray-400 text-xs" />
              </button>
            )}
          </div>

          {/* Category filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "bg-brand-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN — product list */}
        <div>
          {loading ? (
            <ListSkeleton count={4} type="card" />
          ) : filtered.length === 0 ? (
            <EmptyState
              type={search || activeCategory !== "All" ? "search" : "products"}
              onAction={() => setModal("add")}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  onNavigate={(id) => navigate(`/products/${id}`)}
                  onEdit={() => setModal(p)}
                  onDelete={() => handleDelete(p.id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Add Item button */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 px-4 max-w-lg mx-auto z-10">
        <button
          onClick={() => setModal("add")}
          className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Item
        </button>
      </div>

      {modal && (
        <ProductModal
          product={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <Navbar />
    </div>
  );
}






























// // src/pages/Products.jsx
// import { useEffect, useState } from "react";
// import { getProducts, addProduct, editProduct, deleteProduct } from "../api/api";
// import Header from "../components/Header";
// import PageHeader from "../components/PageHeader";
// import Navbar from "../components/Navbar";

// function ProductModal({ product, onClose, onSave }) {
//   const [form, setForm] = useState(product || { name: "", price: "", stock: "" });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       if (product) {
//         const { data } = await editProduct(product.id, form);
//         onSave(data.product, "edit");
//       } else {
//         const { data } = await addProduct(form);
//         onSave(data.product, "add");
//       }
//       onClose();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error saving product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
//       <div className="bg-white rounded-t-3xl w-full max-w-lg p-6">
//         <h3 className="font-bold text-lg text-gray-800 mb-4">{product ? "Edit Product" : "Add Product"}</h3>
//         <div className="flex flex-col gap-3">
//           {[
//             { label: "Product Name", key: "name", type: "text" },
//             { label: "Price (₵)", key: "price", type: "number" },
//             { label: "Stock Quantity", key: "stock", type: "number" },
//           ].map(({ label, key, type }) => (
//             <div key={key}>
//               <label className="text-sm text-gray-500 mb-1 block">{label}</label>
//               <input
//                 type={type}
//                 value={form[key]}
//                 onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
//               />
//             </div>
//           ))}
//         </div>
//         <div className="flex gap-3 mt-5">
//           <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-full text-gray-600 font-semibold">Cancel</button>
//           <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-brand-600 text-white rounded-full font-bold disabled:opacity-60">
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modal, setModal] = useState(null); // null | "add" | product object

//   useEffect(() => {
//     getProducts()
//       .then(({ data }) => setProducts(data.products))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const handleSave = (product, type) => {
//     if (type === "add") setProducts((p) => [product, ...p]);
//     else setProducts((p) => p.map((x) => (x.id === product.id ? product : x)));
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this product?")) return;
//     try {
//       await deleteProduct(id);
//       setProducts((p) => p.filter((x) => x.id !== id));
//     } catch {
//       alert("Could not delete product");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-24 max-w-lg mx-auto">
//       <PageHeader title="Products" />

//       <div className="px-4 pt-4">
        
//         {loading ? (
//           <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
//         ) : products.length === 0 ? (
//           <p className="text-gray-400 text-sm text-center py-8">No products yet. Add one above.</p>
//         ) : (
//           <div className="flex flex-col gap-3">
//             {products.map((p) => (
//               <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <p className="font-semibold text-gray-800">{p.name}</p>
//                     <p className="text-sm text-gray-400">₵{p.price} · {p.stock} in stock</p>
//                     {p.stock <= 5 && (
//                       <span className="text-xs text-red-500 font-medium">Low Stock</span>
//                     )}
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => setModal(p)} className="text-brand-600 text-xs font-semibold px-3 py-1 border border-brand-100 rounded-full">Edit</button>
//                     <button onClick={() => handleDelete(p.id)} className="text-red-500 text-xs font-semibold px-3 py-1 border border-red-100 rounded-full">Delete</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <button
//           onClick={() => setModal("add")}
//           className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full mb-5"
//         >
//           + Add Product
//         </button>


//       {modal && (
//         <ProductModal
//           product={modal === "add" ? null : modal}
//           onClose={() => setModal(null)}
//           onSave={handleSave}
//         />
//       )}

//       <Navbar />
//     </div>
//   );
// }