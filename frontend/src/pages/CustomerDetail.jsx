// src/pages/CustomerDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomers, editCustomer } from "../api/api";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone, faEnvelope, faLocationDot,
  faTriangleExclamation, faPen
} from "@fortawesome/free-solid-svg-icons";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCustomers()
      .then(({ data }) => {
        const found = data.customers.find((c) => c.id == id);
        setCustomer(found);
        setForm(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await editCustomer(id, form);
      setCustomer(data.customer);
      setEditing(false);
    } catch {
      alert("Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  if (!customer) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-gray-400">Customer not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <PageHeader
        title="Customer Profile"
        action={
          <button onClick={() => setEditing((e) => !e)}>
            <FontAwesomeIcon icon={faPen} className="text-brand-600 text-sm" />
          </button>
        }
      />

      <div className="px-4 pt-4">

        {/* Profile hero */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mb-3">
            <span className="text-brand-600 font-black text-2xl">
              {customer.name[0].toUpperCase()}
            </span>
          </div>
          <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{customer.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{customer.email}</p>

          {/* Stats row */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 w-full justify-center">
            {[
              { label: "Purchases", value: customer.purchases },
              { label: "Total Spent", value: `₵${customer.total?.toFixed(2)}` },
              { label: "Credit Owed", value: `₵${customer.credit_owed?.toFixed(2)}`, danger: customer.credit_owed > 0 },
            ].map(({ label, value, danger }) => (
              <div key={label} className="text-center">
                <p className={`font-bold text-base ${danger ? "text-red-500" : "text-gray-800 dark:text-gray-100"}`}>
                  {value}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Credit warning */}
        {customer.credit_owed > 0 && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-2xl px-4 py-3 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" />
            <p className="text-sm text-red-500 font-semibold">
              This customer owes ₵{customer.credit_owed.toFixed(2)} on credit
            </p>
          </div>
        )}

        {/* Details card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Contact Details</p>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-xs text-brand-600 font-semibold">
                Edit
              </button>
            )}
          </div>

          <div className="p-4 flex flex-col gap-3">
            {editing ? (
              <>
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Phone", key: "phone", type: "tel" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Address", key: "address" },
                  { label: "Credit Owed (₵)", key: "credit_owed", type: "number" },
                ].map(({ label, key, type = "text" }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                    <input
                      type={type}
                      value={form[key] ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-gray-600 dark:text-gray-300 font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-brand-600 text-white rounded-full font-bold text-sm disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {[
                  { icon: faPhone, value: customer.phone },
                  { icon: faEnvelope, value: customer.email },
                  { icon: faLocationDot, value: customer.address || "No address set" },
                ].map(({ icon, value }, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={icon} className="text-brand-600 text-xs" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

      </div>

      <Navbar />
    </div>
  );
}