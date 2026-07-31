import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Registrations = () => {
  const navigate = useNavigate();

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

  // Fetch Master Data (Pasien & Dokter) untuk isi Dropdown Form
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
        ← Kembali
      </button>

      <h2>Pendaftaran Berobat & Antrean</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Daftar Berobat Baru
        </button>
      </div>

      {/* Tabel Data Pendaftaran */}
      {loading ? (
        <p>Memuat data pendaftaran...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", color: "#333" }}>
              <th>No. Antrean</th>
              <th>Nama Pasien</th>
              <th>Tgl Berobat</th>
              <th>Dokter / Spesialis</th>
              <th>Jenis Pembayaran</th>
              <th>Keluhan</th>
              <th>Status Antrean</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <tr key={reg.id}>
                  <td>
                    <strong style={{ fontSize: "1.1em", color: "#2563eb" }}>
                      {reg.queue_number || "-"}
                    </strong>
                  </td>
                  <td>{reg.patient_name || reg.patient_id}</td>
                  <td>{reg.visit_date ? reg.visit_date.split("T")[0] : "-"}</td>
                  <td>
                    {reg.doctor_specialization ||
                      reg.doctor_name ||
                      `Dokter ID: ${reg.doctor_id}`}
                  </td>
                  <td>{reg.payment_type}</td>
                  <td>{reg.initial_complaint || "-"}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor:
                          reg.status === "Dipanggil"
                            ? "#fef08a"
                            : reg.status === "Selesai"
                              ? "#bbf7d0"
                              : "#e5e7eb",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                    >
                      {reg.status || "Menunggu"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Belum ada data pendaftaran berobat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal Form Pendaftaran */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              color: "#333",
              padding: "20px",
              borderRadius: "8px",
              width: "450px",
            }}
          >
            <h3>Form Pendaftaran Berobat</h3>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Pilih Pasien *</label>
                <select
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_id: e.target.value })
                  }
                  required
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="">-- Pilih Pasien --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (RM: {p.mr_number} - NIK: {p.nik})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>Pilih Dokter / Spesialis *</label>
                <select
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleDoctorChange}
                  required
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="">-- Pilih Dokter --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.doctor_name || d.specialization} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>Tanggal Berobat *</label>
                <input
                  type="date"
                  name="visit_date"
                  value={formData.visit_date}
                  onChange={(e) =>
                    setFormData({ ...formData, visit_date: e.target.value })
                  }
                  required
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>Jenis Pembayaran *</label>
                <select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_type: e.target.value })
                  }
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="Umum">Umum</option>
                  <option value="BPJS">BPJS</option>
                  <option value="Asuransi">Asuransi</option>
                </select>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>Keluhan Utama</label>
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
                  style={{ width: "100%", padding: "6px" }}
                ></textarea>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button type="button" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
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

export default Registrations;
