import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/register", form);

      alert("Registered successfully 🎉");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-400">
          Create Account
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full mb-4 p-2 rounded bg-gray-700 focus:outline-none"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 rounded bg-gray-700 focus:outline-none"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 p-2 rounded bg-gray-700 focus:outline-none"
          onChange={handleChange}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-2 rounded text-lg font-semibold ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-green-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
