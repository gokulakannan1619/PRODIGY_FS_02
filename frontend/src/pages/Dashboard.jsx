import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [msg, setMsg] = useState("");
  const [role, setRole] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔒 No token → login
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload.role) {
        throw new Error("Invalid token payload");
      }

      setRole(payload.role);

      // Dashboard message
      API.get("/dashboard")
        .then((res) => setMsg(res.data.msg))
        .catch(() => {
          localStorage.clear();
          window.location.href = "/";
        });

      // Admin stats
      if (payload.role === "admin") {
        API.get("/dashboard-stats")
          .then((res) => {
            setStats([
              { name: "Employees", value: res.data.totalEmployees },
            ]);
          })
          .catch(() => setStats([]));
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.clear();
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  }, []);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950">
      {/* SIDEBAR */}
      <Sidebar role={role} />

      {/* MAIN CONTENT */}
      <motion.main
        className="ml-64 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {msg}
          </p>
        </div>

        {/* ================= ADMIN VIEW ================= */}
        {role === "admin" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">
                  Total Employees
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats[0]?.value ?? 0}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">
                  Role
                </h3>
                <p className="text-3xl font-bold text-green-500 mt-2">
                  Admin
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </h3>
                <p className="text-3xl font-bold text-purple-500 mt-2">
                  Active
                </p>
              </div>
            </div>

            {/* CHART */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Employee Analytics
              </h2>

              {stats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats}>
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
          </>
        )}

        {/* ================= USER VIEW ================= */}
        {role === "user" && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              Welcome 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You are logged in as a <strong>User</strong>.
              <br />
              You can view your dashboard but cannot manage employees.
            </p>
          </div>
        )}
      </motion.main>
    </div>
  );
}
