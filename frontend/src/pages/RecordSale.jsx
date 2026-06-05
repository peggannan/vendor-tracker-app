// // src/pages/RecordSale.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getProducts, getCustomers, recordSale, addProduct, addCustomer } from "../api/api";
// import PageHeader from "../components/PageHeader";
// import Navbar from "../components/Navbar";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";

// const PAYMENT_METHODS = ["CASH", "CARD", "MOBILE MONEY", "CREDIT"];
// const CATEGORIES = ["Groceries", "Beverages", "Electronics", "Apparel", "General"];

// function QuickAddProduct({ onAdd, onClose }) {
//   const [form, setForm] = useState({ name: "", price: "", stock: "", category: "General", sku: "" });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!form.name || !form.price) return alert("Name and price are required");
//     setLoading(true);
//     try {
//       const { data } = await addProduct(form);
//       onAdd(data.product);
//     } catch {
//       alert("Could not add product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
//       <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg p-6">
//         <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Quick Add Product</h3>
//         <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pb-2">
//           {[
//             { label: "Product Name *", key: "name" },
//             { label: "SKU", key: "sku", placeholder: "e.g. PRD001" },
//             { label: "Sale Price (₵) *", key: "price", type: "number" },
//             { label: "Stock Quantity", key: "stock", type: "number" },
//           ].map(({ label, key, type = "text", placeholder }) => (
//             <div key={key}>
//               <label className="text-xs text-gray-500 mb-1 block">{label}</label>
//               <input
//                 type={type}
//                 placeholder={placeholder}
//                 value={form[key]}
//                 onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//                 className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
//               />
//             </div>
//           ))}
//           <div>
//             <label className="text-xs text-gray-500 mb-1 block">Category</label>
//             <select
//               value={form.category}
//               onChange={(e) => setForm({ ...form, category: e.target.value })}
//               className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
//             >
//               {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//             </select>
//           </div>
//         </div>
//         <div className="flex gap-3 mt-4">
//           <button onClick={onClose} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 font-semibold">
//             Cancel
//           </button>
//           <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-brand-600 text-white rounded-full font-bold disabled:opacity-60">
//             {loading ? "Adding..." : "Add Product"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function QuickAddCustomer({ onAdd, onClose }) {
//   const [form, setForm] = useState({ name: "", phone: "", email: "", credit_owed: 0 });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!form.name) return alert("Name is required");
//     setLoading(true);
//     try {
//       const { data } = await addCustomer(form);
//       onAdd(data.customer);
//     } catch {
//       alert("Could not add customer");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
//       <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg p-6">
//         <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Quick Add Customer</h3>
//         <div className="flex flex-col gap-3">
//           {[
//             { label: "Full Name *", key: "name" },
//             { label: "Phone", key: "phone", type: "tel" },
//             { label: "Email", key: "email", type: "email" },
//           ].map(({ label, key, type = "text" }) => (
//             <div key={key}>
//               <label className="text-xs text-gray-500 mb-1 block">{label}</label>
//               <input
//                 type={type}
//                 value={form[key]}
//                 onChange={(e) => setForm({ ...form, [key]: e.target.value })}
//                 className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
//               />
//             </div>
//           ))}
//         </div>
//         <div className="flex gap-3 mt-4">
//           <button onClick={onClose} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 font-semibold">
//             Cancel
//           </button>
//           <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-brand-600 text-white rounded-full font-bold disabled:opacity-60">
//             {loading ? "Adding..." : "Add Customer"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function RecordSale() {
//   const [products, setProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [form, setForm] = useState({
//     product_id: "",
//     customer_id: "",
//     quantity: 1,
//     payment_method: "CASH",
//     staff_name: "",
//     notes: "",
//     status: "Approved",
//   });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [showAddCustomer, setShowAddCustomer] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     Promise.all([getProducts(), getCustomers()])
//       .then(([pRes, cRes]) => {
//         setProducts(pRes.data.products);
//         setCustomers(cRes.data.customers);
//       })
//       .catch(console.error);
//   }, []);

//   const selectedProduct = products.find((p) => p.id == form.product_id);
//   const selectedCustomer = customers.find((c) => c.id == form.customer_id);
//   const total = selectedProduct
//     ? (parseFloat(selectedProduct.price) * form.quantity).toFixed(2)
//     : "0.00";

//   const handleSubmit = async () => {
//     if (!form.product_id) return alert("Please select a product");
//     if (!form.customer_id) return alert("Please select a customer");
//     setLoading(true);
//     try {
//       await recordSale({ ...form, total });
//       setSuccess(true);
//     } catch (err) {
//       alert(err.response?.data?.message || "Could not record sale");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProduct = (product) => {
//     setProducts((p) => [product, ...p]);
//     setForm((f) => ({ ...f, product_id: product.id }));
//     setShowAddProduct(false);
//   };

//   const handleAddCustomer = (customer) => {
//     setCustomers((c) => [customer, ...c]);
//     setForm((f) => ({ ...f, customer_id: customer.id }));
//     setShowAddCustomer(false);
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6 max-w-sm mx-auto text-center">
//         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
//           <FontAwesomeIcon icon={faCheck} className="text-green-600 text-3xl" />
//         </div>
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Sale Recorded!</h2>
//         <p className="text-gray-500 text-sm mb-2">
//           {selectedProduct?.name} × {form.quantity}
//         </p>
//         <p className="text-3xl font-black text-brand-600 mb-2">₵{total}</p>
//         <p className="text-xs text-gray-400 mb-8">
//           {form.payment_method} · {selectedCustomer?.name ?? "—"}
//         </p>
//         <button
//           onClick={() => {
//             setSuccess(false);
//             setForm({ product_id: "", customer_id: "", quantity: 1, payment_method: "CASH", staff_name: "", notes: "", status: "Approved" });
//           }}
//           className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full mb-3"
//         >
//           Record Another
//         </button>
//         <button
//           onClick={() => navigate("/dashboard")}
//           className="text-brand-600 font-semibold text-sm"
//         >
//           Go to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32 max-w-lg mx-auto">
//       <PageHeader title="Record Sale" />

//       <div className="px-4 pt-4 flex flex-col gap-4">

//         {/* Product */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Product</label>
//             <button
//               onClick={() => setShowAddProduct(true)}
//               className="flex items-center gap-1 text-xs text-brand-600 font-semibold"
//             >
//               <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
//               New Product
//             </button>
//           </div>
//           <select
//             value={form.product_id}
//             onChange={(e) => setForm({ ...form, product_id: e.target.value })}
//             className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
//           >
//             <option value="">-- Select a product --</option>
//             {products.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.name} — ₵{p.price} ({p.stock} in stock)
//               </option>
//             ))}
//           </select>

//           {/* Selected product info */}
//           {selectedProduct && (
//             <div className="mt-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl px-4 py-2.5 flex justify-between">
//               <span className="text-xs text-gray-500 dark:text-gray-400">Unit Price</span>
//               <span className="text-xs font-bold text-brand-600">₵{selectedProduct.price}</span>
//             </div>
//           )}
//         </div>

//         {/* Customer */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Customer</label>
//             <button
//               onClick={() => setShowAddCustomer(true)}
//               className="flex items-center gap-1 text-xs text-brand-600 font-semibold"
//             >
//               <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
//               New Customer
//             </button>
//           </div>
//           <select
//             value={form.customer_id}
//             onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
//             className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
//           >
//             <option value="">-- Select a customer --</option>
//             {customers.map((c) => (
//               <option key={c.id} value={c.id}>{c.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Quantity */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
//           <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">
//             Quantity
//           </label>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
//               className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-lg flex items-center justify-center"
//             >
//               −
//             </button>
//             <input
//               type="number"
//               min="1"
//               value={form.quantity}
//               onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
//               className="flex-1 text-center border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-brand-500"
//             />
//             <button
//               onClick={() => setForm((f) => ({ ...f, quantity: f.quantity + 1 }))}
//               className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center"
//             >
//               +
//             </button>
//           </div>
//         </div>

//         {/* Payment Method */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
//           <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-3">
//             Payment Method
//           </label>
//           <div className="grid grid-cols-2 gap-2">
//             {PAYMENT_METHODS.map((method) => (
//               <button
//                 key={method}
//                 onClick={() => setForm({ ...form, payment_method: method })}
//                 className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
//                   form.payment_method === method
//                     ? "bg-brand-600 text-white border-brand-600"
//                     : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
//                 }`}
//               >
//                 {method}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Status */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
//           <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-3">
//             Status
//           </label>
//           <div className="grid grid-cols-3 gap-2">
//             {["Approved", "Pending", "Rejected"].map((status) => (
//               <button
//                 key={status}
//                 onClick={() => setForm({ ...form, status })}
//                 className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
//                   form.status === status
//                     ? status === "Approved"
//                       ? "bg-green-500 text-white border-green-500"
//                       : status === "Rejected"
//                       ? "bg-red-500 text-white border-red-500"
//                       : "bg-yellow-500 text-white border-yellow-500"
//                     : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
//                 }`}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Notes */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
//           <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">
//             Notes (optional)
//           </label>
//           <textarea
//             placeholder="Any additional notes..."
//             value={form.notes}
//             onChange={(e) => setForm({ ...form, notes: e.target.value })}
//             rows={3}
//             className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none"
//           />
//         </div>

//         {/* Total summary */}
//         <div className="bg-brand-600 rounded-2xl p-4 flex items-center justify-between">
//           <div>
//             <p className="text-white/70 text-xs">Total Amount</p>
//             <p className="text-white font-black text-2xl">₵{total}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-white/70 text-xs">{form.payment_method}</p>
//             <p className="text-white text-xs font-medium">{selectedCustomer?.name ?? "No customer"}</p>
//           </div>
//         </div>

//       </div>

//       {/* Submit button */}
//       <div className="fixed bottom-16 left-0 right-0 px-4 max-w-lg mx-auto z-10">
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-60 text-base"
//         >
//           {loading ? "Recording..." : "Record Sale"}
//         </button>
//       </div>

//       {showAddProduct && (
//         <QuickAddProduct
//           onAdd={handleAddProduct}
//           onClose={() => setShowAddProduct(false)}
//         />
//       )}

//       {showAddCustomer && (
//         <QuickAddCustomer
//           onAdd={handleAddCustomer}
//           onClose={() => setShowAddCustomer(false)}
//         />
//       )}

//       <Navbar />
//     </div>
//   );
// }






// src/pages/RecordSale.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getCustomers, recordSale, addProduct, addCustomer } from "../api/api";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";

const PAYMENT_METHODS = ["CASH", "MOBILE MONEY"];
const CATEGORIES = ["Groceries", "Beverages", "Electronics", "Apparel", "General"];

function QuickAddProduct({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "General", sku: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Name and price are required");
    setLoading(true);
    try {
      const { data } = await addProduct(form);
      onAdd(data.product);
    } catch {
      alert("Could not add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Quick Add Product</h3>
        <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pb-2">
          {[
            { label: "Product Name *", key: "name" },
            { label: "SKU", key: "sku", placeholder: "e.g. PRD001" },
            { label: "Sale Price (₵) *", key: "price", type: "number" },
            { label: "Stock Quantity", key: "stock", type: "number" },
          ].map(({ label, key, type = "text", placeholder }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 font-semibold">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-brand-600 text-white rounded-full font-bold disabled:opacity-60">
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickAddCustomer({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name) return alert("Name is required");
    setLoading(true);
    try {
      const { data } = await addCustomer(form);
      onAdd(data.customer);
    } catch {
      alert("Could not add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg p-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Quick Add Customer</h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "Full Name *", key: "name" },
            { label: "Phone", key: "phone", type: "tel" },
          ].map(({ label, key, type = "text" }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 font-semibold">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-brand-600 text-white rounded-full font-bold disabled:opacity-60">
            {loading ? "Adding..." : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecordSale() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    customer_id: "",
    quantity: 1,
    payment_method: "CASH",
    notes: "",
    status: "Approved",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getProducts(), getCustomers()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.products);
        setCustomers(cRes.data.customers);
      })
      .catch(console.error);
  }, []);

  const selectedProduct = products.find((p) => p.id == form.product_id);
  const selectedCustomer = customers.find((c) => c.id == form.customer_id);
  const total = selectedProduct
    ? (parseFloat(selectedProduct.price) * form.quantity).toFixed(2)
    : "0.00";

  const handleSubmit = async () => {
    if (!form.product_id) return alert("Please select a product");
    setLoading(true);
    try {
      await recordSale({ ...form, total });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.error?.message || "Could not record sale");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    setProducts((p) => [product, ...p]);
    setForm((f) => ({ ...f, product_id: product.id }));
    setShowAddProduct(false);
  };

  const handleAddCustomer = (customer) => {
    setCustomers((c) => [customer, ...c]);
    setForm((f) => ({ ...f, customer_id: customer.id }));
    setShowAddCustomer(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6 max-w-sm mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faCheck} className="text-green-600 text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Sale Recorded!</h2>
        <p className="text-gray-500 text-sm mb-2">
          {selectedProduct?.name} × {form.quantity}
        </p>
        <p className="text-3xl font-black text-brand-600 mb-2">₵{total}</p>
        <p className="text-xs text-gray-400 mb-8">
          {form.payment_method} · {selectedCustomer?.name ?? "Walk-in"}
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setForm({ product_id: "", customer_id: "", quantity: 1, payment_method: "CASH", notes: "", status: "Approved" });
          }}
          className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full mb-3"
        >
          Record Another
        </button>
        <button onClick={() => navigate("/dashboard")} className="text-brand-600 font-semibold text-sm">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32 max-w-lg mx-auto lg:max-w-full">
      <PageHeader title="Record Sale" />

      {/* Desktop title */}
      <div className="hidden lg:flex items-center justify-between px-8 pt-6 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Record Sale</h1>
          <p className="text-sm text-gray-400 mt-0.5">Fill in the details to record a new sale</p>
        </div>
        {/* Total summary pill — desktop */}
        <div className="bg-brand-600 rounded-2xl px-6 py-3 text-right">
          <p className="text-white/70 text-xs">Total Amount</p>
          <p className="text-white font-black text-2xl">₵{total}</p>
          <p className="text-white/60 text-xs">{form.payment_method} · {selectedCustomer?.name ?? "Walk-in"}</p>
        </div>
      </div>

      {/* Two column layout on desktop */}
      <div className="px-4 pt-4 lg:px-8 lg:pt-4 lg:grid lg:grid-cols-2 lg:gap-6 flex flex-col gap-4">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Product */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Product</label>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-1 text-xs text-brand-600 font-semibold"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                New Product
              </button>
            </div>
            <select
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="">-- Select a product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₵{p.price} ({p.stock} in stock)
                </option>
              ))}
            </select>
            {selectedProduct && (
              <div className="mt-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl px-4 py-2.5 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Unit Price</span>
                <span className="text-xs font-bold text-brand-600">₵{selectedProduct.price}</span>
              </div>
            )}
          </div>

          {/* Customer */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Customer</label>
              <button
                onClick={() => setShowAddCustomer(true)}
                className="flex items-center gap-1 text-xs text-brand-600 font-semibold"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                New Customer
              </button>
            </div>
            <select
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="">-- Walk-in / No customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} {c.phone ? `· ${c.phone}` : ""}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-lg flex items-center justify-center"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                className="flex-1 text-center border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={() => setForm((f) => ({ ...f, quantity: f.quantity + 1 }))}
                className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  onClick={() => setForm({ ...form, payment_method: method })}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    form.payment_method === method
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">
              Notes (optional)
            </label>
            <textarea
              placeholder="Any additional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Total summary — mobile only */}
          <div className="lg:hidden bg-brand-600 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs">Total Amount</p>
              <p className="text-white font-black text-2xl">₵{total}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">{form.payment_method}</p>
              <p className="text-white text-xs font-medium">{selectedCustomer?.name ?? "Walk-in"}</p>
            </div>
          </div>

          {/* Submit button — desktop inline */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="hidden lg:flex w-full py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-60 text-base items-center justify-center"
          >
            {loading ? "Recording..." : "Record Sale"}
          </button>

        </div>
      </div>

      {/* Submit button — mobile fixed */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 px-4 max-w-lg mx-auto z-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-60 text-base"
        >
          {loading ? "Recording..." : "Record Sale"}
        </button>
      </div>

      {showAddProduct && (
        <QuickAddProduct
          onAdd={handleAddProduct}
          onClose={() => setShowAddProduct(false)}
        />
      )}

      {showAddCustomer && (
        <QuickAddCustomer
          onAdd={handleAddCustomer}
          onClose={() => setShowAddCustomer(false)}
        />
      )}

      <Navbar />
    </div>
  );
}