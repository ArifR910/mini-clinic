import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "./Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // 1. Update State
  const [stats, setStats] = useState({
    totalPasien: 0,
    pendaftaranHariIni: 0,
    antreanHariIni: 0,
    pasienMenunggu: 0,
    pasienSelesai: 0,
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
          // Map data dari controller backend
          setStats({
            totalPasien: data.total_patients || 0,
            pendaftaranHariIni: data.total_patients_today || 0,
            antreanHariIni: data.total_queues_today || 0,
            pasienMenunggu: data.total_waiting || 0,
            pasienSelesai: data.total_completed || 0,
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err.message);
      }
    };

    fetchStats();
  }, []);

  const role = user?.role;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f9", fontFamily: "sans-serif" }}>
      <Navbar />

      <main style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#1e293b", marginBottom: "24px" }}>
          Dashboard ({role || "User"})
        </h1>

        {/* 2. Grid 5 Cards Statistik Sesuai Requirements */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "16px", 
            marginBottom: "32px" 
          }}
        >
          {/* Card 1: Total Pasien */}
          <div style={cardStyle("#eff6ff", "#2563eb")}>
            <h3 style={cardTitleStyle("#1e40af")}>TOTAL PASIEN</h3>
            <p style={cardValueStyle("#1e3a8a")}>{stats.totalPasien}</p>
          </div>

          {/* Card 2: Total Pasien Hari Ini */}
          <div style={cardStyle("#f0fdf4", "#16a34a")}>
            <h3 style={cardTitleStyle("#166534")}>PASIEN HARI INI</h3>
            <p style={cardValueStyle("#14532d")}>{stats.pendaftaranHariIni}</p>
          </div>

          {/* Card 3: Total Antrean Hari Ini */}
          <div style={cardStyle("#f0f9ff", "#0284c7")}>
            <h3 style={cardTitleStyle("#0369a1")}>ANTEAN HARI INI</h3>
            <p style={cardValueStyle("#075985")}>{stats.antreanHariIni}</p>
          </div>

          {/* Card 4: Total Pasien Menunggu */}
          <div style={cardStyle("#fff7ed", "#ea580c")}>
            <h3 style={cardTitleStyle("#9a3412")}>PASIEN MENUNGGU</h3>
            <p style={cardValueStyle("#7c2d12")}>{stats.pasienMenunggu}</p>
          </div>

          {/* Card 5: Total Pasien Selesai */}
          <div style={cardStyle("#ecfdf5", "#059669")}>
            <h3 style={cardTitleStyle("#065f46")}>SELESAI DILAYANI</h3>
            <p style={cardValueStyle("#064e3b")}>{stats.pasienSelesai}</p>
          </div>
        </div>

        {/* Aksi Cepat Menu */}
        <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginTop: 0, color: "#1e293b", marginBottom: "16px" }}>Aksi Cepat Menu</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button style={actionButtonStyle("#0d9488")} onClick={() => navigate("/patients")}>
              Data Pasien
            </button>
            <button style={actionButtonStyle("#0284c7")} onClick={() => navigate("/registrations")}>
              Semua Pendaftaran
            </button>
            <button style={actionButtonStyle("#d97706")} onClick={() => navigate("/queues")}>
              Manajemen Antrean
            </button>
            <button style={actionButtonStyle("#0284c7")} onClick={() => navigate("/medical-records")}>
              Riwayat Rekam Medis
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Styles
const cardStyle = (bgColor, borderColor) => ({
  backgroundColor: bgColor,
  borderLeft: `5px solid ${borderColor}`,
  borderRadius: "8px",
  padding: "16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
});

const cardTitleStyle = (color) => ({
  margin: "0 0 8px 0",
  fontSize: "12px",
  fontWeight: "bold",
  color: color,
});

const cardValueStyle = (color) => ({
  margin: 0,
  fontSize: "28px",
  fontWeight: "bold",
  color: color,
});

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