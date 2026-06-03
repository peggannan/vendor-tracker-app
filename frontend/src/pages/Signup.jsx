// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    setError("");
    try {
      const { data } = await signup({ name: form.name, email: form.email, password: form.password });
      saveAuth(data.user, data.token);
      navigate("/user-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white dark:bg-gray-900 max-w-sm mx-auto">

      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <img src={logo} alt="logo" className="w-16 h-16 object-contain mb-2" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Shelfline</h1>
        <p className="text-gray-400 text-sm">Register Using Your Credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

        {/* Name + Email */}
        {[
          { label: "Name", key: "name", type: "text", placeholder: "Enter Your Name" },
          { label: "Email", key: "email", type: "email", placeholder: "Enter Your Email" },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
              required
            />
          </div>
        ))}

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="My Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-brand-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm My Password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-brand-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full mt-2 disabled:opacity-60"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-600 font-semibold">Sign in here</Link>
      </p>
    </div>
  );
}