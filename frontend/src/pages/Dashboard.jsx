import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "./Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // State Statistik Dashboard
  const [stats, setStats] = useState({
    totalPasien: 0,
    pendaftaranHariIni: 0,
    antreanHariIni: 0,
    pasienMenunggu: 0,
    total_calling: 0,
    pasienSelesai: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard");
        if (response.data && response.data.success) {
          const data = response.data.data;
          setStats({
            totalPasien: data.total_patients || 0,
            pendaftaranHariIni: data.total_patients_today || 0,
            antreanHariIni: data.total_queues_today || 0,
            pasienMenunggu: data.total_waiting || 0,
            total_calling: data.total_calling || 0,
            pasienSelesai: data.total_completed || 0,
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err.message);
      }
    };

    fetchStats();
  }, []);

  const role = user?.role || "User";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <Navbar />

      <main style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Dashboard */}
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              color: "#0f172a",
              fontSize: "24px",
              fontWeight: "700",
              margin: "0 0 6px 0",
            }}
          >
            Dashboard Utama
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Selamat datang kembali, <strong style={{ color: "#1e293b" }}>{user?.name || "Pengguna"}</strong>
          </p>
        </div>

        {/* Grid 6 Stat Cards (3 Kolom x 2 Baris Simetris) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <CardItem
            title="TOTAL PASIEN"
            value={stats.totalPasien}
            badge="Master Data"
            color="#2563eb"
            bgColor="#eff6ff"
          />

          <CardItem
            title="PASIEN HARI INI"
            value={stats.pendaftaranHariIni}
            badge="Registrasi"
            color="#16a34a"
            bgColor="#f0fdf4"
          />

          <CardItem
            title="ANTREAN HARI INI"
            value={stats.antreanHariIni}
            badge="Kunjungan"
            color="#0284c7"
            bgColor="#f0f9ff"
          />

          <CardItem
            title="PASIEN MENUNGGU"
            value={stats.pasienMenunggu}
            badge="Antrean"
            color="#ea580c"
            bgColor="#fff7ed"
          />

          <CardItem
            title="SEDANG DILAYANI"
            value={stats.total_calling}
            badge="Pemeriksaan"
            color="#ca8a04"
            bgColor="#fefce8"
          />

          <CardItem
            title="SELESAI DILAYANI"
            value={stats.pasienSelesai}
            badge="Selesai"
            color="#059669"
            bgColor="#ecfdf5"
          />
        </div>

        {/* Seksi Deskripsi Alur Kerja Sistem */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "28px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
              color: "#0f172a",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            📋 Panduan Alur Operasional MiniClinic
          </h3>
          <p
            style={{
              margin: "0 0 20px 0",
              color: "#64748b",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Sistem terintegrasi ini dirancang untuk mempermudah alur pelayanan medis dari pendaftaran hingga rekam medis pasien. Silakan gunakan menu di navigasi atas sesuai tugas utama Anda:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <WorkflowStep
              step="1"
              title="Pendaftaran Pasien"
              description="Petugas mendaftarkan pasien baru/lama dan secara otomatis mencetak nomor antrean hari ini."
            />
            <WorkflowStep
              step="2"
              title="Pemanggilan Antrean"
              description="Petugas/Dokter memanggil pasien yang sedang menunggu sesuai dengan nomor urut antrean."
            />
            <WorkflowStep
              step="3"
              title="Pemeriksaan & Rekam Medis"
              description="Dokter melakukan diagnosis, memberikan tindakan medis, serta mencatat hasil rekam medis pasien."
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-komponen Card Statistik
const CardItem = ({ title, value, badge, color, bgColor }) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px 22px",
        border: "1px solid #e2e8f0",
        borderLeft: `5px solid ${color}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.05em", marginBottom: "8px" }}>
          {title}
        </div>
        <div style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", lineHeight: "1" }}>
          {value}
        </div>
      </div>

      <span
        style={{
          backgroundColor: bgColor,
          color: color,
          fontSize: "12px",
          fontWeight: "600",
          padding: "4px 10px",
          borderRadius: "16px",
          border: `1px solid ${color}20`,
        }}
      >
        {badge}
      </span>
    </div>
  );
};

// Sub-komponen Panduan Alur
const WorkflowStep = ({ step, title, description }) => {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #f1f5f9",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <span
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: "700",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {step}
        </span>
        <h4 style={{ margin: 0, color: "#1e293b", fontSize: "14px", fontWeight: "600" }}>
          {title}
        </h4>
      </div>
      <p style={{ margin: 0, color: "#64748b", fontSize: "13px", lineHeight: "1.5" }}>
        {description}
      </p>
    </div>
  );
};

export default Dashboard;