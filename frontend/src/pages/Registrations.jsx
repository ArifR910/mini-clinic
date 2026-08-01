import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "./Navbar";

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    polyclinic_id: "",
    visit_date: new Date().toISOString().split("T")[0],
    payment_type: "Umum",
    initial_complaint: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Daftar Pendaftaran & Antrean
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/registrations");
      if (res.data.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data pendaftaran:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Master Data (Pasien & Dokter)
  const fetchMasterData = async () => {
    try {
      const resPatients = await api.get("/patients?limit=100");
      if (resPatients.data.success) {
        setPatients(resPatients.data.data.patients);
      }

      const resDoctors = await api.get("/doctors");
      if (resDoctors.data.success) {
        setDoctors(resDoctors.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data master:", err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchMasterData();
  }, []);

  // Handle Perubahan Dokter
  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const selectedDoc = doctors.find((d) => d.id === parseInt(docId));

    setFormData({
      ...formData,
      doctor_id: docId,
      polyclinic_id: selectedDoc ? selectedDoc.polyclinic_id : "",
    });
  };

  // Submit Pendaftaran Berobat
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await api.post("/registrations", formData);
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          patient_id: "",
          doctor_id: "",
          polyclinic_id: "",
          visit_date: new Date().toISOString().split("T")[0],
          payment_type: "Umum",
          initial_complaint: "",
        });
        fetchRegistrations();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal mendaftarkan pasien");
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
        {/* Container Utama */}
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
                Pendaftaran Berobat
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Kelola antrean dan pendaftaran pasien ke unit pelayanan/poliklinik.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              + Daftar Berobat Baru
            </button>
          </div>

          {/* Tabel Pendaftaran */}
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Memuat data pendaftaran...
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
                    <th style={{ padding: "12px 16px" }}>Tgl Berobat</th>
                    <th style={{ padding: "12px 16px" }}>Dokter / Spesialis</th>
                    <th style={{ padding: "12px 16px" }}>Jenis Pembayaran</th>
                    <th style={{ padding: "12px 16px" }}>Keluhan</th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Status Antrean
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <tr
                        key={reg.id}
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
                            {reg.queue_number || "-"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          {reg.patient_name || reg.patient_id}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>
                          {reg.visit_date ? reg.visit_date.split("T")[0] : "-"}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#334155" }}>
                          {reg.doctor_specialization ||
                            reg.doctor_name ||
                            `Dokter ID: ${reg.doctor_id}`}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#334155" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#475569",
                              backgroundColor: "#f8fafc",
                            }}
                          >
                            {reg.payment_type}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>
                          {reg.initial_complaint || "-"}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          {getStatusBadge(reg.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          textAlign: "center",
                          padding: "32px",
                          color: "#94a3b8",
                        }}
                      >
                        Belum ada data pendaftaran berobat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL FORM PENDAFTARAN */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Form Pendaftaran Berobat
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "14px",
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Pilih Pasien *</label>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_id: e.target.value })
                  }
                  required
                  style={inputStyle}
                >
                  <option value="">-- Pilih Pasien --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (RM: {p.mr_number} - NIK: {p.nik})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Pilih Dokter / Spesialis *</label>
                <select
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleDoctorChange}
                  required
                  style={inputStyle}
                >
                  <option value="">-- Pilih Dokter --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.doctor_name || d.specialization} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Tanggal Berobat *</label>
                <input
                  type="date"
                  name="visit_date"
                  value={formData.visit_date}
                  onChange={(e) =>
                    setFormData({ ...formData, visit_date: e.target.value })
                  }
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Jenis Pembayaran *</label>
                <select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_type: e.target.value })
                  }
                  style={inputStyle}
                >
                  <option value="Umum">Umum</option>
                  <option value="BPJS">BPJS</option>
                  <option value="Asuransi">Asuransi</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Keluhan Utama</label>
                <textarea
                  name="initial_complaint"
                  value={formData.initial_complaint}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initial_complaint: e.target.value,
                    })
                  }
                  placeholder="Contoh: Pusing, demam 2 hari..."
                  style={{
                    ...inputStyle,
                    minHeight: "70px",
                    resize: "vertical",
                  }}
                ></textarea>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    padding: "9px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                  }}
                >
                  Daftar & Cetak Antrean
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- HELPER STYLES --- */
const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  color: "#475569",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",
  color: "#0f172a",
};

export default Registrations;