import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "./Navbar";

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
          err.response?.data?.message ||
            "Gagal terhubung ke database / Server API."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Navbar Atas */}
      <Navbar />

      {/* Main Container */}
      <div
        style={{
          padding: "32px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header & Tombol Kembali */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              📋 Kumpulan Rekam Medis & Riwayat Pasien
            </h2>
            <p
              style={{
                margin: "4px 0 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Daftar seluruh rekam medis, resep obat, dan tindakan pasien dari Database.
            </p>
          </div>
        </div>

        {/* Tampilan Loading / Error / Table */}
        {loading ? (
          <div style={{ color: "#64748b", padding: "20px 0" }}>
            Memuat data dari database...
          </div>
        ) : errorMessage ? (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              borderRadius: "8px",
              border: "1px solid #fca5a5",
            }}
          >
            ⚠️ {errorMessage}
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0",
                  }}
                >
                  <th style={thStyle}>No. RM / Pasien</th>
                  <th style={thStyle}>Tanggal</th>
                  <th style={thStyle}>Keluhan (Subjective)</th>
                  <th style={thStyle}>Diagnosis (Assessment)</th>
                  <th style={thStyle}>Resep Obat</th>
                  <th style={thStyle}>Tindakan / Plan</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      Belum ada data rekam medis di database.
                    </td>
                  </tr>
                ) : (
                  records.map((item) => (
                    <tr
                      key={item.id}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      {/* Nama & No RM */}
                      <td style={tdStyle}>
                        <div style={{ fontWeight: "700", color: "#2563eb" }}>
                          {item.mr_number || `RM-00${item.patient_id}`}
                        </div>
                        <div style={{ fontWeight: "600", color: "#0f172a" }}>
                          {item.patient_name ||
                            item.patient?.name ||
                            `Pasien ID ${item.patient_id}`}
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td style={{ ...tdStyle, color: "#475569" }}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>

                      {/* Subjective */}
                      <td style={{ ...tdStyle, color: "#475569" }}>
                        {item.subjective || "-"}
                      </td>

                      {/* Assessment / Diagnosis */}
                      <td
                        style={{
                          ...tdStyle,
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        {item.assessment || "-"}
                      </td>

                      {/* Resep Obat */}
                      <td
                        style={{
                          ...tdStyle,
                          color: "#16a34a",
                          fontWeight: "600",
                        }}
                      >
                        {item.prescription || item.medicine_name || "-"}
                      </td>

                      {/* Tindakan / Plan */}
                      <td style={{ ...tdStyle, color: "#475569" }}>
                        {item.treatment ||
                          item.treatment_name ||
                          item.plan ||
                          "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- STYLES HELPER --- */
const thStyle = {
  padding: "14px 16px",
  color: "#334155",
  fontWeight: "700",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "14px 16px",
  verticalAlign: "top",
};

export default PatientHistory;