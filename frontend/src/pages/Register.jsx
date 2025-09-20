// src/pages/Register.jsx - Beautiful modern design
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await registerUser(form.name, form.email, form.password, form.role);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error registering user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white">🍭</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Join Sweet Shop
            </h1>
            <p className="text-gray-600 mt-2">Create your account to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-12"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <div className="absolute left-4 top-3.5">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-12"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <div className="absolute left-4 top-3.5">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-12"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <div className="absolute left-4 top-3.5">
                  <span className="text-gray-400">🔒</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="relative">
                <select
                  name="role"
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-12 appearance-none"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="ROLE_USER">Customer</option>
                  <option value="ROLE_ADMIN">Shop Manager</option>
                </select>
                <div className="absolute left-4 top-3.5">
                  <span className="text-gray-400">⚡</span>
                </div>
                <div className="absolute right-4 top-3.5">
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Choose "Customer" for purchasing or "Shop Manager" for inventory management
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Start your sweet journey today 🚀
          </p>
        </div>
      </div>
    </div>
  );
}