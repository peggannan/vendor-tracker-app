// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts, editProduct, deleteProduct, restockProduct } from "../api/api";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical, faCamera, faTrash, faPen
} from "@fortawesome/free-solid-svg-icons";

const CATEGORIES = ["Groceries", "Beverages", "Electronics", "Apparel", "General"];
const UNITS = ["Piece", "Kg", "Litre", "Box", "Pack", "Dozen"];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [restockForm, setRestockForm] = useState({ quantity: "", cost_price: "" });
  const [restocking, setRestocking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getProducts()
      .then(({ data }) => {
        const found = data.products.find((p) => p.id == id);
        setProduct(found);
        setForm(found ?? {});
        setImageFile(null);
        setImagePreview(found?.image ?? "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(form.image ?? product?.image ?? "");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile, form.image, product?.image]);

const handleSave = async () => {
  setSaving(true);
  try {
    const { data } = await editProduct(id, { ...form, image_file: imageFile });
    // merge the returned product with current form so UI reflects changes
    const updated = {
      ...form,
      ...data.product,
      price: data.product.price ?? form.price,
      stock: data.product.stock ?? form.stock,
      base_cost: data.product.base_cost ?? form.base_cost,
    };
    setProduct(updated);
    setForm(updated);
    setImageFile(null);
    setImagePreview(updated.image ?? "");
    setEditing(false);
  } catch (err) {
    alert(err.response?.data?.error?.message || "Could not save changes");
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      navigate("/products");
    } catch {
      alert("Could not delete product");
    }
  };

  const handleRestock = async () => {
    if (!restockForm.quantity || Number(restockForm.quantity) <= 0) {
      return alert("Enter a valid restock quantity");
    }

    setRestocking(true);
    try {
      const res = await restockProduct(id, Number(restockForm.quantity), restockForm.cost_price || undefined);
      const updatedStock = res.data?.data?.stock_quantity ?? Number(product.stock ?? 0) + Number(restockForm.quantity);
      const updatedProduct = {
        ...product,
        ...form,
        stock: updatedStock,
        base_cost: res.data?.data?.cost_price ?? form.base_cost,
      };
      setProduct(updatedProduct);
      setForm(updatedProduct);
      setRestockForm({ quantity: "", cost_price: "" });
    } catch (err) {
      alert(err.response?.data?.error?.message || "Could not restock product");
    } finally {
      setRestocking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-500">Product not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <PageHeader
        title="Product Details"
        action={
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600 dark:text-gray-300" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-9 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-20 w-36 overflow-hidden">
                  <button
                    onClick={() => { setEditing(true); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPen} className="text-brand-600 text-xs" />
                    Edit Product
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); handleDelete(); }}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        }
      />

      <div className="px-4 pt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-4">

          {/* Product image */}
          <div className="relative bg-gray-100 dark:bg-gray-700 h-48 flex items-center justify-center border border-gray-200 dark:border-gray-600">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <FontAwesomeIcon icon={faCamera} className="text-4xl" />
                <p className="text-sm">Image</p>
              </div>
            )}
          </div>

          {editing && (
            <div className="px-5 py-3 border-b border-gray-50 dark:border-gray-700">
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )} 

          {/* Product name + SKU */}
          <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700 text-center">
            {editing ? (
              <input
                type="text"
                value={form.name ?? ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-center text-xl font-bold border-b-2 border-brand-500 bg-transparent text-gray-900 dark:text-white focus:outline-none pb-1 mb-1"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
            )}
            <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku ?? "N/A"}</p>
          </div>

          {/* Form fields */}
          <div className="px-5 py-4 flex flex-col gap-4">

            {/* Description */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                Description
              </label>
              <input
                type="text"
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={!editing}
                placeholder="Product description..."
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-70 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                Category
              </label>
              <input
                list="product-detail-categories"
                value={form.category ?? ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                disabled={!editing}
                placeholder="Enter or choose a category"
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-70 focus:ring-2 focus:ring-brand-500"
              />
              <datalist id="product-detail-categories">
                {CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Unit */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                Unit
              </label>
              <select
                value={form.unit ?? ""}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                disabled={!editing}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-70 focus:ring-2 focus:ring-brand-500 appearance-none"
              >
                <option value="">Select unit</option>
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>

            {/* Sale Price + Cost Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                  Sale Price
                </label>
                <input
                  type="number"
                  value={form.price ?? ""}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  disabled={!editing}
                  placeholder="₵ 0.00"
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-70 focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                  Cost Price
                </label>
                <input
                  type="number"
                  value={form.base_cost ?? ""}
                  onChange={(e) => setForm({ ...form, base_cost: e.target.value })}
                  disabled={!editing}
                  placeholder="₵ 0.00"
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-70 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Quantity + Sold */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={form.stock ?? ""}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  disabled={!editing}
                  placeholder="0"
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-70 focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                  Sold
                </label>
                <input
                  type="number"
                  value={form.units_sold ?? ""}
                  onChange={(e) => setForm({ ...form, units_sold: e.target.value })}
                  disabled={!editing}
                  placeholder="0"
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-70 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Restock */}
            <div className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Restock Product</p>
                  <p className="text-xs text-gray-400">Add quantity to current stock</p>
                </div>
                <p className="text-sm font-bold text-brand-600">Current: {form.stock ?? product.stock ?? 0}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Quantity to add</label>
                  <input
                    type="number"
                    min="1"
                    value={restockForm.quantity}
                    onChange={(e) => setRestockForm({ ...restockForm, quantity: e.target.value })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">New cost price (optional)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={restockForm.cost_price}
                    onChange={(e) => setRestockForm({ ...restockForm, cost_price: e.target.value })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
              <button
                onClick={handleRestock}
                disabled={restocking}
                className="mt-3 w-full py-3 bg-brand-600 text-white rounded-xl font-semibold disabled:opacity-60"
              >
                {restocking ? "Restocking..." : "Add to Stock"}
              </button>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expiry_date ?? ""}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                disabled={!editing}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none disabled:opacity-70 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Profit margin display */}
            {product.price && product.base_cost && (
              <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl px-4 py-3 flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Profit Margin</p>
                <p className="text-sm font-bold text-brand-600">
                  ₵{(product.price - product.base_cost).toFixed(2)} per unit
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Save / Cancel buttons — only show when editing */}
        {editing && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => { setEditing(false); setForm(product); setImageFile(null); setImagePreview(product?.image ?? ""); }}
              className="flex-1 py-3.5 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-600 dark:text-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3.5 bg-brand-600 text-white rounded-2xl font-bold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

      </div>

      <Navbar />
    </div>
  );
}