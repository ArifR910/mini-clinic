import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role = user?.role;
  const isAdmin = role === "Admin";
  const isPetugas = role === "Petugas Pendaftaran";
  const isDokter = role === "Dokter";

  // Cek apakah user saat ini berada di Dashboard
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari aplikasi?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        backgroundColor: "#0f172a",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand & Dynamic Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            🏥
          </div>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", letterSpacing: "-0.01em" }}>
            Mini<span style={{ color: "#38bdf8" }}>Clinic</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Link to="/dashboard" style={navLinkStyle(isActive("/dashboard"))}>
            Dashboard
          </Link>

          {/* Data Pasien: Admin, Petugas, Dokter */}
          {(isAdmin || isPetugas || isDokter) && (
            <Link to="/patients" style={navLinkStyle(isActive("/patients"))}>
              Data Pasien
            </Link>
          )}

          {/* Pendaftaran: Hanya Admin & Petugas */}
          {(isAdmin || isPetugas) && (
            <Link to="/registrations" style={navLinkStyle(isActive("/registrations"))}>
              Pendaftaran
            </Link>
          )}

          {/* Antrean: Admin, Petugas, Dokter */}
          {(isAdmin || isPetugas || isDokter) && (
            <Link to="/queues" style={navLinkStyle(isActive("/queues"))}>
              Antrean
            </Link>
          )}

          {/* Rekam Medis: Hanya Admin & Dokter */}
          {(isAdmin || isDokter) && (
            <Link to="/medical-records" style={navLinkStyle(isActive("/medical-records"))}>
              Rekam Medis
            </Link>
          )}
        </div>
      </div>

      {/* User Info & Conditional Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#f1f5f9" }}>
            {user?.name || "User"}
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
            {role || "Guest"}
          </div>
        </div>

        {isDashboard && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ef4444",
              color: "#ffffff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const navLinkStyle = (active) => ({
  color: active ? "#ffffff" : "#94a3b8",
  backgroundColor: active ? "rgba(255, 255, 255, 0.1)" : "transparent",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: active ? "600" : "500",
  padding: "8px 14px",
  borderRadius: "6px",
  transition: "all 0.15s ease",
});

export default Navbar;