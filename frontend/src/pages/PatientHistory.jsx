import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PatientHistory = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Memanggil API backend (GET /api/medical-records)
        const res = await api.get("/medical-records");
        
        // Ambil data dari response
        const data = res.data?.data || res.data || [];
        setRecords(data);
      } catch (err) {
        console.error("Gagal mengambil data dari DB:", err);
        setErrorMessage(
          err.response?.data?.message || "Gagal terhubung ke database / Server API."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "32px", fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header & Tombol Kembali */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#ffffff" }}>📋 Kumpulan Rekam Medis & Riwayat Pasien</h2>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8" }}>
            Daftar seluruh rekam medis, resep obat, dan tindakan pasien dari Database.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#334155",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ⬅ Kembali ke Dashboard
        </button>
      </div>

      {/* Tampilan Loading / Error */}
      {loading ? (
        <p style={{ color: "#ffffff" }}>Memuat data dari database...</p>
      ) : errorMessage ? (
        <div style={{ padding: "16px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "8px" }}>
          ⚠️ {errorMessage}
        </div>
      ) : (
        <div style={{ overflowX: "auto", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px", color: "#334155" }}>No. RM / Pasien</th>
                <th style={{ padding: "12px", color: "#334155" }}>Tanggal</th>
                <th style={{ padding: "12px", color: "#334155" }}>Keluhan (Subjective)</th>
                <th style={{ padding: "12px", color: "#334155" }}>Diagnosis (Assessment)</th>
                <th style={{ padding: "12px", color: "#334155" }}>Resep Obat</th>
                <th style={{ padding: "12px", color: "#334155" }}>Tindakan / Plan</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
                    Belum ada data rekam medis di database.
                  </td>
                </tr>
              ) : (
                records.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {/* Nama & No RM */}
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: "600", color: "#2563eb" }}>
                        {item.mr_number || `RM-00${item.patient_id}`}
                      </div>
                      <div style={{ fontWeight: "500", color: "#1e293b" }}>
                        {item.patient_name || item.patient?.name || `Pasien ID ${item.patient_id}`}
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td style={{ padding: "12px", color: "#475569" }}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-"}
                    </td>

                    {/* Subjective */}
                    <td style={{ padding: "12px", color: "#475569" }}>
                      {item.subjective || "-"}
                    </td>

                    {/* Assessment / Diagnosis */}
                    <td style={{ padding: "12px", fontWeight: "600", color: "#1e293b" }}>
                      {item.assessment || "-"}
                    </td>

                    {/* Resep Obat */}
                    <td style={{ padding: "12px", color: "#059669", fontWeight: "500" }}>
                      {item.prescription || item.medicine_name || "-"}
                    </td>

                    {/* Tindakan / Plan */}
                    <td style={{ padding: "12px", color: "#475569" }}>
                      {item.treatment || item.treatment_name || item.plan || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;