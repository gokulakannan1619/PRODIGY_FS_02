
import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", {
        email: "gokul@test.com",
        password: "12345",
      });

      localStorage.setItem("token", res.data.access_token);
      alert("Login successful");

      // 🔥 redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg"
      >
        Login
      </button>
    </div>
  );
}
