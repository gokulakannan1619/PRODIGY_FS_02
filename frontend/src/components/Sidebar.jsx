import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ role }) {
  const location = useLocation();

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
  };

  const linkStyle = (path) =>
    `block px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <aside className="fixed left-0 top-0 w-64 min-h-screen bg-gray-900 text-white shadow-xl">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">EMS Dashboard</h1>
        <p className="text-sm text-gray-400">Employee Management</p>
      </div>

      <nav className="p-4 space-y-2">
        <Link to="/dashboard" className={linkStyle("/dashboard")}>
          🏠 Dashboard
        </Link>

        {role === "admin" && (
          <Link to="/employees" className={linkStyle("/employees")}>
            👥 Employees
          </Link>
        )}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 space-y-3">
        <button
          onClick={toggleDark}
          className="w-full bg-gray-700 px-4 py-2 rounded-lg"
        >
          🌙 Toggle Dark Mode
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full text-red-400"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
