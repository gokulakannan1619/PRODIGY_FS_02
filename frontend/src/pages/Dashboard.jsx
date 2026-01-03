import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setMsg(res.data.msg))
      .catch(() => alert("Unauthorized"));
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-xl">
      {msg}
    </div>
  );
}
