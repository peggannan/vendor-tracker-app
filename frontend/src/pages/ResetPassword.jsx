// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock, faEye, faEyeSlash,
  faCircleCheck, faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Invalid link
  if (!uid || !token) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-6 max-w-sm mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center mb-5">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Invalid Reset Link
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link
          to="/forgot-password"
          className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full text-center block"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  // Password strength
  const getStrength = (pw) => [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length;

  const strength = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "text-red-400", "text-yellow-400", "text-blue-400", "text-green-500"][strength];
  const barColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    setLoading(true);
    setError("");
    try {
      await resetPassword(uid, token, form.password, form.confirm);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        "Could not reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-6 max-w-sm mx-auto text-center">
        <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-6">
          <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Password Reset!
        </h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col max-w-sm mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="w-9" />
        <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
        <div className="w-9" />
      </div>

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-5">
        <FontAwesomeIcon icon={faLock} className="text-brand-600 text-2xl" />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Set New Password
      </h2>
      <p className="text-gray-400 dark:text-gray-500 text-sm mb-8 leading-relaxed">
        Create a strong password for your account. It must be at least 8 characters.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* New password */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1.5 block font-medium">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-brand-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Strength bar */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      level <= strength ? barColor : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${strengthColor}`}>
                {strengthLabel}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1.5 block font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none dark:bg-gray-800 dark:text-white ${
                form.confirm && form.confirm !== form.password
                  ? "border-red-400 focus:border-red-400"
                  : form.confirm && form.confirm === form.password
                  ? "border-green-400 focus:border-green-400"
                  : "border-gray-200 dark:border-gray-600 focus:border-brand-500"
              }`}
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
          {form.confirm && form.confirm !== form.password && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
          {form.confirm && form.confirm === form.password && (
            <p className="text-xs text-green-500 mt-1">✓ Passwords match</p>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950 px-4 py-2.5 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || form.password !== form.confirm || form.password.length < 8}
          className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full mt-2 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}