import React from "react";
import API from "../services/api";

export default function Register() {
  const handleRegister = async () => {
    await API.post("/register", {
      name: "Gokul",
      email: "gokul@test.com",
      password: "12345",
    });
    alert("Registered successfully");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Register
      </button>
    </div>
  );
}
