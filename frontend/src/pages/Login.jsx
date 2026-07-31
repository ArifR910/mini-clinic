import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mengambil fungsi login dari AuthContext (jika ada)
  const authContext = useContext(AuthContext);
  const login = authContext?.login;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { username, password });

      console.log("Respon Backend Lengkap:", res.data);

      const token = res.data?.data?.token || res.data?.token;
      const user = res.data?.data?.user || res.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        navigate("/dashboard");
      } else {
        setError(res.data?.message || "Token tidak ditemukan dari backend");
      }
    } catch (err) {
      console.error("Error sungguhan di catch:", err);

      const pesanError =
        err.response?.data?.message || err.message || "Login gagal";
      setError(pesanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f1f5f9",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "#1e293b",
          }}
        >
          Mini Clinic Info System
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
