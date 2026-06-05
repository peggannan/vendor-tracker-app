// src/pages/AddCustomer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../api/api";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";

export default function AddCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", credit_owed: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name) return alert("Name is required");
    setLoading(true);
    try {
      await addCustomer(form);
      navigate("/customers");
    } catch {
      alert("Could not add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <PageHeader title="Add Buyer" />

      <div className="px-4 pt-4 flex flex-col gap-3">
        {[
          { label: "Full Name", key: "name" },
          { label: "Phone Number", key: "phone", type: "tel" },
          { label: "Email Address", key: "email", type: "email" },
          { label: "Address", key: "address" },
          { label: "Initial Credit Owed (₵)", key: "credit_owed", type: "number" },
        ].map(({ label, key, type = "text" }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block font-medium">
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 bg-white"
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl mt-4 disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Customer"}
        </button>
      </div>

      <Navbar />
    </div>
  );
}