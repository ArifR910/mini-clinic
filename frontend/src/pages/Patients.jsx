import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "./Navbar";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State User & Role Authorization
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const role = user?.role;
  const isAdmin = role === "Admin";
  const isPetugas = role === "Petugas Pendaftaran";

  // State Modal Detail
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State Modal Registrasi Pasien Baru
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    birth_date: "",
    gender: "L",
    address: "",
    phone: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  // State Modal Edit Pasien
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    nik: "",
    name: "",
    birth_date: "",
    gender: "L",
    address: "",
    phone: "",
  });
  const [editErrorMsg, setEditErrorMsg] = useState("");

  // Fetch Data Pasien
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/patients?search=${search}&page=${page}&limit=5`
      );
      if (res.data.success) {
        setPatients(res.data.data.patients);
        setTotalPages(res.data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Gagal mengambil data pasien:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, page]);

  // Handle Form Input Tambah
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Pasien Baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await api.post("/patients", formData);
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          nik: "",
          name: "",
          birth_date: "",
          gender: "L",
          address: "",
          phone: "",
        });
        fetchPatients();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menambahkan pasien");
    }
  };

  // Handle Buka Modal Edit
  const handleOpenEdit = (pt) => {
    setEditErrorMsg("");
    setEditFormData({
      id: pt.id,
      nik: pt.nik,
      name: pt.name,
      birth_date: pt.birth_date ? pt.birth_date.split("T")[0] : "",
      gender: pt.gender || "L",
      address: pt.address || "",
      phone: pt.phone || "",
    });
    setShowEditModal(true);
  };

  // Submit Update Pasien
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setEditErrorMsg("");
    try {
      const res = await api.put(`/patients/${editFormData.id}`, editFormData);
      if (res.data.success) {
        setShowEditModal(false);
        fetchPatients();
      }
    } catch (err) {
      setEditErrorMsg(
        err.response?.data?.message || "Gagal memperbarui pasien"
      );
    }
  };

  // Handle Delete Pasien
  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pasien ${name}?`)) {
      try {
        const res = await api.delete(`/patients/${id}`);
        if (res.data.success) {
          fetchPatients();
        }
      } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus data pasien");
      }
    }
  };

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
          {/* Header & Controls */}
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
                Data Pasien
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Kelola pendaftaran dan riwayat informasi data master pasien.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="🔍 Cari nama, NIK, No. RM..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                  width: "260px",
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                }}
              />

              {(isAdmin || isPetugas) && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  + Tambah Pasien Baru
                </button>
              )}
            </div>
          </div>

          {/* Tabel Pasien Modern */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b", fontSize: "14px" }}>
              Memuat data pasien...
            </div>
          ) : (
            <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
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
                    <th style={{ padding: "12px 16px" }}>No. RM</th>
                    <th style={{ padding: "12px 16px" }}>NIK</th>
                    <th style={{ padding: "12px 16px" }}>Nama Pasien</th>
                    <th style={{ padding: "12px 16px" }}>Tgl Lahir</th>
                    <th style={{ padding: "12px 16px" }}>L/P</th>
                    <th style={{ padding: "12px 16px" }}>No. HP</th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    patients.map((pt) => (
                      <tr
                        key={pt.id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          transition: "background-color 0.15s ease",
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
                              fontSize: "12px",
                            }}
                          >
                            {pt.mr_number}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#334155" }}>{pt.nik}</td>
                        <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0f172a" }}>
                          {pt.name}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>
                          {pt.birth_date ? pt.birth_date.split("T")[0] : "-"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              backgroundColor: pt.gender === "L" ? "#e0f2fe" : "#fce7f3",
                              color: pt.gender === "L" ? "#0369a1" : "#be185d",
                              fontWeight: "700",
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "12px",
                            }}
                          >
                            {pt.gender}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#64748b" }}>{pt.phone || "-"}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                            <button
                              onClick={() => {
                                setSelectedPatient(pt);
                                setShowDetailModal(true);
                              }}
                              style={actionBtnStyle("#f1f5f9", "#334155")}
                            >
                              Detail
                            </button>

                            {(isAdmin || isPetugas) && (
                              <button
                                onClick={() => handleOpenEdit(pt)}
                                style={actionBtnStyle("#fef3c7", "#d97706")}
                              >
                                Edit
                              </button>
                            )}

                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(pt.id, pt.name)}
                                style={actionBtnStyle("#fee2e2", "#dc2626")}
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                        Tidak ada data pasien yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <span>
              Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                style={paginationBtnStyle(page <= 1)}
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                style={paginationBtnStyle(page >= totalPages)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL REGISTRASI PASIEN BARU */}
      {showModal && (
        <ModalOverlay onClose={() => setShowModal(false)}>
          <ModalHeader title="Form Registrasi Pasien Baru" onClose={() => setShowModal(false)} />
          {errorMsg && <ErrorMessage text={errorMsg} />}
          <form onSubmit={handleSubmit}>
            <FormInput label="NIK *" type="text" name="nik" value={formData.nik} onChange={handleChange} required />
            <FormInput label="Nama Lengkap *" type="text" name="name" value={formData.name} onChange={handleChange} required />
            <FormInput label="Tanggal Lahir *" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
            
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Jenis Kelamin *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <FormInput label="No. HP" type="text" name="phone" value={formData.phone} onChange={handleChange} />
            
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Alamat</label>
              <textarea name="address" value={formData.address} onChange={handleChange} style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} />
            </div>

            <ModalActions onCancel={() => setShowModal(false)} submitText="Simpan Pasien" />
          </form>
        </ModalOverlay>
      )}

      {/* MODAL EDIT PASIEN */}
      {showEditModal && (
        <ModalOverlay onClose={() => setShowEditModal(false)}>
          <ModalHeader title="Edit Data Pasien" onClose={() => setShowEditModal(false)} />
          {editErrorMsg && <ErrorMessage text={editErrorMsg} />}
          <form onSubmit={handleUpdateSubmit}>
            <FormInput
              label="NIK *"
              type="text"
              value={editFormData.nik}
              onChange={(e) => setEditFormData({ ...editFormData, nik: e.target.value })}
              required
            />
            <FormInput
              label="Nama Lengkap *"
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
            />
            <FormInput
              label="Tanggal Lahir *"
              type="date"
              value={editFormData.birth_date}
              onChange={(e) => setEditFormData({ ...editFormData, birth_date: e.target.value })}
              required
            />

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Jenis Kelamin *</label>
              <select
                value={editFormData.gender}
                onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                style={inputStyle}
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <FormInput
              label="No. HP"
              type="text"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Alamat</label>
              <textarea
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
              />
            </div>

            <ModalActions onCancel={() => setShowEditModal(false)} submitText="Simpan Perubahan" />
          </form>
        </ModalOverlay>
      )}

      {/* MODAL DETAIL PASIEN */}
      {showDetailModal && selectedPatient && (
        <ModalOverlay onClose={() => setShowDetailModal(false)}>
          <ModalHeader title="Detail Pasien" onClose={() => setShowDetailModal(false)} />
          <div style={{ fontSize: "14px", display: "flex", flexDirection: "column", gap: "10px", color: "#334155" }}>
            <DetailRow label="No. Rekam Medis" value={selectedPatient.mr_number} isHighlight />
            <DetailRow label="NIK" value={selectedPatient.nik} />
            <DetailRow label="Nama Lengkap" value={selectedPatient.name} />
            <DetailRow label="Tanggal Lahir" value={selectedPatient.birth_date ? selectedPatient.birth_date.split("T")[0] : "-"} />
            <DetailRow label="Jenis Kelamin" value={selectedPatient.gender === "L" ? "Laki-laki" : "Perempuan"} />
            <DetailRow label="No. Handphone" value={selectedPatient.phone || "-"} />
            <DetailRow label="Alamat Tempat Tinggal" value={selectedPatient.address || "-"} />
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setShowDetailModal(false)} style={cancelBtnStyle}>
              Tutup
            </button>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};

/* --- SUB-KOMPONEN STYLED & MODULAR --- */

const ModalOverlay = ({ children, onClose }) => (
  <div
    onClick={onClose}
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
        maxWidth: "460px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      {children}
    </div>
  </div>
);

const ModalHeader = ({ title, onClose }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{title}</h3>
    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#94a3b8" }}>
      ✕
    </button>
  </div>
);

const FormInput = ({ label, type, name, value, onChange, required = false }) => (
  <div style={{ marginBottom: "14px" }}>
    <label style={labelStyle}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} style={inputStyle} />
  </div>
);

const DetailRow = ({ label, value, isHighlight = false }) => (
  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
    <span style={{ color: "#64748b" }}>{label}</span>
    <span style={{ fontWeight: isHighlight ? "700" : "600", color: isHighlight ? "#2563eb" : "#0f172a" }}>{value}</span>
  </div>
);

const ErrorMessage = ({ text }) => (
  <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", marginBottom: "14px" }}>
    ⚠️ {text}
  </div>
);

const ModalActions = ({ onCancel, submitText }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
    <button type="button" onClick={onCancel} style={cancelBtnStyle}>
      Batal
    </button>
    <button type="submit" style={submitBtnStyle}>
      {submitText}
    </button>
  </div>
);

/* --- HELPER STYLES --- */
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", boxSizing: "border-box" };
const actionBtnStyle = (bgColor, textColor) => ({ backgroundColor: bgColor, color: textColor, border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" });
const paginationBtnStyle = (disabled) => ({ padding: "6px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: disabled ? "#f1f5f9" : "#ffffff", color: disabled ? "#94a3b8" : "#334155", cursor: disabled ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "600" });
const cancelBtnStyle = { backgroundColor: "#f1f5f9", color: "#475569", border: "none", padding: "9px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" };
const submitBtnStyle = { backgroundColor: "#2563eb", color: "#ffffff", border: "none", padding: "9px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" };

export default Patients;