// src/pages/Login.jsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const { data } = await login(form);
    saveAuth(data.user, data.token);  // ← fix: data.user not data.username
    navigate("/dashboard");
  } catch (err) {
    const errData = err.response?.data?.error?.message;
    if (errData) {
      const firstError = Object.values(errData)[0];
      setError(Array.isArray(firstError) ? firstError[0] : firstError);
    } else {
      setError("Wrong username or password");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-b from-brand-500 to-brand-600 flex flex-col justify-end max-w-sm mx-auto">
      <div className="bg-white rounded-t-3xl px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Username</label>
            <input
              type="username"
              placeholder="My Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${error ? "border-red-400" : "border-gray-200 focus:border-brand-500"}`}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            {(() => {
              const [showPw, setShowPw] = useState(false);
              return (
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="My Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none ${error ? "border-red-400" : "border-gray-200 focus:border-brand-500"}`}
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
              );
            })()}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-500">
              <input type="checkbox" className="accent-brand-600" /> Remember Me
            </label>
            <button type="button" className="text-brand-600 font-medium">Forgot Password</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-full mt-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-brand-600 font-semibold">Sign Up Here</Link>
        </p>
      </div>
    </div>
  );
}