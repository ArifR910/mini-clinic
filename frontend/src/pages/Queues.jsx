import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "./Navbar";

const Queues = () => {
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Ambil data User & Role saat ini
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const role = user?.role;
  // Cek izin akses berdasarkan role
  const isFrontOffice = role === "Admin" || role === "Petugas Pendaftaran";
  const isDoctor = role === "Admin" || role === "Dokter";

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const res = await api.get("/queues");
      if (res.data.success) {
        setQueues(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data antrean:", err);
      setErrorMsg("Gagal memuat data antrean.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleStatusChange = async (queueId, newStatus) => {
    try {
      const res = await api.put(`/queues/${queueId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        fetchQueues();
      }
    } catch (err) {
      console.error("Gagal update status:", err);
      alert(err.response?.data?.message || "Gagal memperbarui status antrean");
    }
  };

  // Helper Badge Status
  const getStatusBadge = (status) => {
    let bg = "#f1f5f9";
    let color = "#475569";

    if (status === "Dipanggil") {
      bg = "#fef3c7";
      color = "#d97706";
    } else if (status === "Selesai") {
      bg = "#dcfce7";
      color = "#15803d";
    } else if (status === "Batal") {
      bg = "#fee2e2";
      color = "#b91c1c";
    }

    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "12px",
          backgroundColor: bg,
          color: color,
          fontWeight: "700",
          fontSize: "12px",
          display: "inline-block",
        }}
      >
        {status || "Menunggu"}
      </span>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <Navbar />

      <main style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Card Utama */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            padding: "24px",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Manajemen Antrean Klinik Hari Ini
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Pantau pemanggilan dan status antrean pemeriksaan pasien secara real-time.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Tabel Antrean */}
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Memuat antrean...
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                borderRadius: "8px",
                border: "1px solid #f1f5f9",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f8fafc",
                      borderBottom: "2px solid #e2e8f0",
                      color: "#475569",
                      fontWeight: "600",
                    }}
                  >
                    <th style={{ padding: "12px 16px" }}>No. Antrean</th>
                    <th style={{ padding: "12px 16px" }}>Nama Pasien</th>
                    <th style={{ padding: "12px 16px" }}>Poli</th>
                    <th style={{ padding: "12px 16px" }}>Keluhan</th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Status Antrean
                    </th>
                    <th style={{ padding: "12px 16px" }}>Aksi Pemanggilan</th>
                  </tr>
                </thead>
                <tbody>
                  {queues.length > 0 ? (
                    queues.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              fontWeight: "700",
                              color: "#2563eb",
                              backgroundColor: "#eff6ff",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "13px",
                            }}
                          >
                            {item.queue_number || "-"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          {item.patient_name}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#334155" }}>
                          {item.polyclinic_name || "Poli Umum"}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>
                          {item.complaint ||
                            item.initial_complaint ||
                            item.registration?.complaint ||
                            item.registration?.initial_complaint ||
                            "-"}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          {getStatusBadge(item.status)}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            {/* 1. STATUS: MENUNGGU -> Hanya Petugas Pendaftaran & Admin */}
                            {item.status === "Menunggu" && (
                              <>
                                {isFrontOffice ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleStatusChange(item.id, "Dipanggil")
                                      }
                                      style={buttonStyle("#d97706")}
                                    >
                                      📢 Panggil Pasien
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusChange(item.id, "Batal")
                                      }
                                      style={buttonStyle("#dc2626")}
                                    >
                                      ❌ Batal
                                    </button>
                                  </>
                                ) : (
                                  <span
                                    style={{ color: "#64748b", fontSize: "13px" }}
                                  >
                                    Menunggu Petugas
                                  </span>
                                )}
                              </>
                            )}

                            {/* 2. STATUS: DIPANGGIL -> Hanya Dokter & Admin */}
                            {item.status === "Dipanggil" && (
                              <>
                                {isDoctor ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigate(`/medical-records/new/${item.id}`)
                                      }
                                      style={buttonStyle("#16a34a")}
                                    >
                                      🩺 Periksa Pasien
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusChange(item.id, "Batal")
                                      }
                                      style={buttonStyle("#dc2626")}
                                    >
                                      ❌ Batal
                                    </button>
                                  </>
                                ) : (
                                  <span
                                    style={{
                                      color: "#d97706",
                                      fontWeight: "600",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Sedang Diperiksa Dokter...
                                  </span>
                                )}
                              </>
                            )}

                            {/* 3. STATUS TERAKHIR -> Semua Role Bisa Lihat */}
                            {item.status === "Selesai" && (
                              <span
                                style={{
                                  color: "#16a34a",
                                  fontWeight: "600",
                                  fontSize: "13px",
                                }}
                              >
                                ✓ Selesai Dilayani
                              </span>
                            )}
                            {item.status === "Batal" && (
                              <span
                                style={{
                                  color: "#dc2626",
                                  fontWeight: "600",
                                  fontSize: "13px",
                                }}
                              >
                                ✕ Dibatalkan
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "32px",
                          color: "#94a3b8",
                        }}
                      >
                        Belum ada antrean berjalan hari ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper button style
const buttonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: "#ffffff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
});

export default Queues;