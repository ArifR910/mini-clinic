import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPasien: 0,
    pendaftaranHariIni: 0,
    antreanBerjalan: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard");

        if (response.data && response.data.success) {
          const data = response.data.data;

          setStats({
            totalPasien: data.total_patients,
            pendaftaranHariIni: data.total_patients_today,
            antreanBerjalan: data.total_waiting,
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err.message);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header / Navbar */}
      <header
        style={{
          backgroundColor: "#1d4ed8",
          color: "#ffffff",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px" }}>
          🏥 Mini Clinic Info System
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span>
            Selamat datang,{" "}
            <strong>{user?.name || user?.username || "Admin"}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#1e293b", marginBottom: "24px" }}>
          Dashboard Utama
        </h1>

        {/* Card Ringkasan / Statistik */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div style={cardStyle("#eff6ff", "#2563eb")}>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#1e40af",
              }}
            >
              TOTAL PASIEN
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "bold",
                color: "#1e3a8a",
              }}
            >
              {stats.totalPasien || 128}
            </p>
          </div>

          <div style={cardStyle("#f0fdf4", "#16a34a")}>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#166534",
              }}
            >
              PENDAFTARAN HARI INI
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "bold",
                color: "#14532d",
              }}
            >
              {stats.pendaftaranHariIni || 14}
            </p>
          </div>

          <div style={cardStyle("#fff7ed", "#ea580c")}>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#9a3412",
              }}
            >
              ANTEAN BERJALAN
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "bold",
                color: "#7c2d12",
              }}
            >
              {stats.antreanBerjalan}
            </p>
          </div>
        </div>

        {/* Menu Aksi Cepat */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#334155" }}>Aksi Cepat</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button style={actionButtonStyle("#2563eb")}>
              + Registrasi Pasien Baru
            </button>
            <button style={actionButtonStyle("#059669")}>
              + Pendaftaran Berobat
            </button>
            <button style={actionButtonStyle("#4f46e5")}>
              📋 Lihat Antrean
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Style untuk Card
const cardStyle = (bgColor, borderColor) => ({
  backgroundColor: bgColor,
  borderLeft: `6px solid ${borderColor}`,
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
});

// Helper Style untuk Button Aksi
const actionButtonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: "#ffffff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
});

export default Dashboard;
