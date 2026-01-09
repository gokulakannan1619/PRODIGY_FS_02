
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      alert("Login successful 🎉");
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Secure Login 🔐
        </h1>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <label className="block mb-2 text-sm">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="gokul@test.com"
        />

        {/* PASSWORD */}
        <label className="block mb-2 text-sm">Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm text-gray-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-2 rounded font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-sm text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
