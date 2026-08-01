import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex justify-between items-center text-white mb-6">
      {/* Logo / Title */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-blue-400">Mini Clinic</h1>

        {/* Dynamic Menu Berdasarkan Role */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {/* MENU ADMIN */}
          {role === "Admin" && (
            <>
              <Link to="/dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>
              <Link to="/patients" className="hover:text-blue-400">
                Data Pasien
              </Link>
              <Link to="/registrations" className="hover:text-blue-400">
                Pendaftaran
              </Link>
              <Link to="/queues" className="hover:text-blue-400">
                Antrean
              </Link>
              <Link to="/patients" className="hover:text-blue-400">
                Data Pasien
              </Link>
            </>
          )}

          {/* MENU DOKTER */}
          {role === "Dokter" && (
            <>
              <Link to="/dashboard" className="hover:text-blue-400">
                Antrean Pasien Hari Ini
              </Link>
              <Link to="/medical-records" className="hover:text-blue-400">
                Riwayat Rekam Medis
              </Link>
            </>
          )}

          {/* MENU PETUGAS PENDAFTARAN */}
          {role === "Petugas Pendaftaran" && (
            <>
              <Link to="/dashboard" className="hover:text-blue-400">
                Pendaftaran Berobat
              </Link>
              <Link to="/patients" className="hover:text-blue-400">
                Data Master Pasien
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Profil User Active */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold">{user.name || "User"}</p>
          <span className="text-xs bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
            {role || "Guest"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
