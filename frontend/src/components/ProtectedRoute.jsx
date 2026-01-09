import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    if (roleRequired && role !== roleRequired) {
      return (
        <h1 className="text-center mt-20 text-red-500 text-xl">
          Access Denied ❌
        </h1>
      );
    }

    return children;
  } catch (error) {
    // Invalid token
    localStorage.clear();
    return <Navigate to="/" />;
  }
}
