import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Queues = () => {
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      const res = await api.put(`/queues/${queueId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchQueues();
      }
    } catch (err) {
      console.error("Gagal update status:", err);
      alert(err.response?.data?.message || "Gagal memperbarui status antrean");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "15px",
          padding: "6px 12px",
          cursor: "pointer",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        ← Kembali ke Dashboard
      </button>

      <h2>Manajemen Antrean Klinik Hari Ini</h2>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {loading ? (
        <p>Memuat antrean...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", color: "#333" }}>
              <th>No. Antrean</th>
              <th>Nama Pasien</th>
              <th>Poli</th>
              <th>Keluhan</th>
              <th>Status Antrean</th>
              <th>Aksi Pemanggilan</th>
            </tr>
          </thead>
          <tbody>
            {queues.length > 0 ? (
              queues.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong style={{ fontSize: "1.2em", color: "#2563eb" }}>
                      {item.queue_number || "-"}
                    </strong>
                  </td>
                  <td>{item.patient_name}</td>
                  <td>{item.polyclinic_name || "Poli Umum"}</td>
                  <td>{item.initial_complaint || "-"}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor:
                          item.status === "Dipanggil"
                            ? "#fef08a"
                            : item.status === "Selesai"
                            ? "#bbf7d0"
                            : item.status === "Batal"
                            ? "#fecaca"
                            : "#e5e7eb",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                    >
                      {item.status || "Menunggu"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {/* Status: Menunggu -> Panggil atau Batal */}
                      {item.status === "Menunggu" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(item.id, "Dipanggil")}
                            style={{
                              backgroundColor: "#eab308",
                              color: "#fff",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            📢 Panggil Pasien
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, "Batal")}
                            style={{
                              backgroundColor: "#ef4444",
                              color: "#fff",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            ❌ Batal
                          </button>
                        </>
                      )}

                      {/* Status: Dipanggil -> Selesaikan atau Batal */}
                      {item.status === "Dipanggil" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(item.id, "Selesai")}
                            style={{
                              backgroundColor: "#22c55e",
                              color: "#fff",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            ✅ Selesaikan
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, "Batal")}
                            style={{
                              backgroundColor: "#ef4444",
                              color: "#fff",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            ❌ Batal
                          </button>
                        </>
                      )}

                      {/* Status Terakhir */}
                      {item.status === "Selesai" && (
                        <span style={{ color: "#16a34a", fontWeight: "500" }}>
                          ✓ Selesai Dilayani
                        </span>
                      )}
                      {item.status === "Batal" && (
                        <span style={{ color: "#dc2626", fontWeight: "500" }}>
                          ✗ Dibatalkan
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Belum ada antrean berjalan hari ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Queues;