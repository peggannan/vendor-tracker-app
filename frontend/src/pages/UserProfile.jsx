// src/pages/Profile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function UserProfile() {
  const { user, saveAuth, token } = useAuth();
  const navigate = useNavigate();

  const [personalForm, setPersonalForm] = useState({
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ")[1] ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  const [shopForm, setShopForm] = useState({
    shopName: user?.shopName ?? "",
    shopAddress: user?.shopAddress ?? "",
    shopCategory: user?.shopCategory ?? "",
  });

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingShop, setEditingShop] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      // TODO: connect to backend PUT /api/user/profile
      const updated = {
        ...user,
        name: `${personalForm.firstName} ${personalForm.lastName}`,
        email: personalForm.email,
        phone: personalForm.phone,
      };
      saveAuth(updated, token);
      setEditingPersonal(false);
      showSuccess("Personal details updated!");
    } catch {
      alert("Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShop = async () => {
    setSaving(true);
    try {
      // TODO: connect to backend PUT /api/user/shop
      const updated = { ...user, ...shopForm };
      saveAuth(updated, token);
      setEditingShop(false);
      showSuccess("Shop details updated!");
    } catch {
      alert("Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  const initials = `${personalForm.firstName?.[0] ?? ""}${personalForm.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <Header title="My Profile" />

      <div className="px-4 pt-4">

        {/* Success toast */}
        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-100 dark:border-green-800 rounded-2xl px-4 py-3 mb-4 text-sm text-green-600 dark:text-green-300 font-medium text-center">
            ✓ {successMsg}
          </div>
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-2xl mb-2">
            {initials}
          </div>
          <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">
            {personalForm.firstName} {personalForm.lastName}
          </p>
          <p className="text-sm text-gray-400">{personalForm.email}</p>
        </div>

        {/* Personal Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Personal Details</p>
            {!editingPersonal && (
              <button
                onClick={() => setEditingPersonal(true)}
                className="text-xs text-brand-600 font-semibold"
              >
                Edit
              </button>
            )}
          </div>

          <div className="p-4 flex flex-col gap-3">
            {editingPersonal ? (
              <>
                {[
                  { label: "First Name", key: "firstName" },
                  { label: "Last Name", key: "lastName" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Phone", key: "phone", type: "tel" },
                ].map(({ label, key, type = "text" }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                    <input
                      type={type}
                      value={personalForm[key]}
                      onChange={(e) => setPersonalForm({ ...personalForm, [key]: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => setEditingPersonal(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-gray-600 dark:text-gray-300 font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePersonal}
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
                  { label: "First Name", value: personalForm.firstName },
                  { label: "Last Name", value: personalForm.lastName },
                  { label: "Email", value: personalForm.email },
                  { label: "Phone", value: personalForm.phone || "Not set" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{value}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Shop Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Shop Details</p>
            {!editingShop && (
              <button
                onClick={() => setEditingShop(true)}
                className="text-xs text-brand-600 font-semibold"
              >
                Edit
              </button>
            )}
          </div>

          <div className="p-4 flex flex-col gap-3">
            {editingShop ? (
              <>
                {[
                  { label: "Shop Name", key: "shopName" },
                  { label: "Shop Address", key: "shopAddress" },
                  { label: "Category", key: "shopCategory", placeholder: "e.g. Food & Beverages" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={shopForm[key]}
                      onChange={(e) => setShopForm({ ...shopForm, [key]: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => setEditingShop(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-full text-gray-600 dark:text-gray-300 font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveShop}
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
                  { label: "Shop Name", value: shopForm.shopName || "Not set" },
                  { label: "Address", value: shopForm.shopAddress || "Not set" },
                  { label: "Category", value: shopForm.shopCategory || "Not set" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{value}</span>
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