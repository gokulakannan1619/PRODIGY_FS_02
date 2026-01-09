import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editEmp, setEditEmp] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ================= FETCH =================
  const fetchEmployees = () => {
    API.get(`/employees?page=${page}&search=${search}`)
      .then((res) => {
        if (res.data.employees) {
          setEmployees(res.data.employees);
          setTotalPages(res.data.totalPages);
        } else {
          setEmployees(res.data);
          setTotalPages(1);
        }
      })
      .catch(() => alert("Admin only"));
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search]);

  // ================= UPDATE =================
  const updateEmployee = () => {
    API.put(`/employees/${editEmp.id}`, editEmp).then(() => {
      setEditEmp(null);
      fetchEmployees();
    });
  };

  // ================= DELETE =================
  const deleteEmployee = (id) => {
    if (window.confirm("Delete this employee?")) {
      API.delete(`/employees/${id}`).then(fetchEmployees);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <motion.div
        className="flex-1 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Employees
        </h1>

        {/* ================= SEARCH ================= */}
        <input
          type="text"
          placeholder="Search employee..."
          className="border p-2 mb-5 w-full max-w-sm rounded
                     dark:bg-slate-800 dark:text-white"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-gray-200 dark:bg-slate-700">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t dark:border-slate-700"
                >
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-white rounded"
                      onClick={() => setEditEmp(emp)}
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded"
                      onClick={() => deleteEmployee(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex gap-2 mt-6">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-slate-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* ================= EDIT MODAL ================= */}
        <AnimatePresence>
          {editEmp && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96"
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Edit Employee
                </h2>

                <input
                  className="border p-2 w-full mb-3 rounded
                             dark:bg-slate-700 dark:text-white"
                  value={editEmp.name}
                  onChange={(e) =>
                    setEditEmp({ ...editEmp, name: e.target.value })
                  }
                />

                <input
                  className="border p-2 w-full mb-4 rounded
                             dark:bg-slate-700 dark:text-white"
                  value={editEmp.email}
                  onChange={(e) =>
                    setEditEmp({ ...editEmp, email: e.target.value })
                  }
                />

                <div className="flex justify-end gap-3">
                  <button
                    className="bg-gray-400 px-4 py-1 rounded"
                    onClick={() => setEditEmp(null)}
                  >
                    Cancel
                  </button>

                  <button
                    className="bg-green-500 hover:bg-green-600 px-4 py-1 text-white rounded"
                    onClick={updateEmployee}
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
