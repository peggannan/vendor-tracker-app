// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEnvelope, faCircleCheck, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        "Could not send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-6 max-w-sm mx-auto text-center">
        {/* Success state */}
        <div className="w-24 h-24 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-6">
          <FontAwesomeIcon icon={faPaperPlane} className="text-brand-600 text-4xl" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Check Your Email
        </h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-2 leading-relaxed">
          We sent a password reset link to
        </p>
        <p className="text-brand-600 font-semibold text-sm mb-6">{email}</p>
        <p className="text-gray-400 text-xs mb-8 leading-relaxed">
          Click the link in the email to reset your password. The link expires in 24 hours.
          Check your spam folder if you don't see it.
        </p>

        <button
          onClick={() => setSent(false)}
          className="w-full py-3.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full mb-3"
        >
          Try a different email
        </button>

        <Link to="/login" className="text-brand-600 font-semibold text-sm">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col max-w-sm mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate("/login")}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
        </button>
        <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
      </div>

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-5">
        <FontAwesomeIcon icon={faEnvelope} className="text-brand-600 text-2xl" />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Forgot Password?
      </h2>
      <p className="text-gray-400 dark:text-gray-500 text-sm mb-8 leading-relaxed">
        No worries. Enter your email address and we'll send you a link to reset your password.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mb-1.5 block font-medium">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
            required
            autoFocus
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950 px-4 py-2.5 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full disabled:opacity-60 mt-2"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-6">
        Remember your password?{" "}
        <Link to="/login" className="text-brand-600 font-semibold">
          Sign In
        </Link>
      </p>
    </div>
  );
}