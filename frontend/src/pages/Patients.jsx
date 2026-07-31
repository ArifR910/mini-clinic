import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        `/patients?search=${search}&page=${page}&limit=5`,
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
        err.response?.data?.message || "Gagal memperbarui pasien",
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
    <div style={{ padding: "20px" }}>
      {/* Tombol Kembali ke Dashboard */}
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
      <h2>Manajemen Pasien</h2>

      {/* Baris Pencarian & Tombol Tambah */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Cari nama, NIK, atau No. RM..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: "8px", width: "300px" }}
        />
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Tambah Pasien Baru
        </button>
      </div>

      {/* Tabel Pasien */}
      {loading ? (
        <p>Memuat data pasien...</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", color: "#333" }}>
              <th>No. RM</th>
              <th>NIK</th>
              <th>Nama Pasien</th>
              <th>Tgl Lahir</th>
              <th>L/P</th>
              <th>No. HP</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((pt) => (
                <tr key={pt.id}>
                  <td>
                    <strong>{pt.mr_number}</strong>
                  </td>
                  <td>{pt.nik}</td>
                  <td>{pt.name}</td>
                  <td>{pt.birth_date ? pt.birth_date.split("T")[0] : "-"}</td>
                  <td>{pt.gender}</td>
                  <td>{pt.phone || "-"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => {
                          setSelectedPatient(pt);
                          setShowDetailModal(true);
                        }}
                        style={{ cursor: "pointer", padding: "4px 8px" }}
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleOpenEdit(pt)}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "#fff",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pt.id, pt.name)}
                        style={{
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Tidak ada data pasien
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {/* Modal Registrasi Pasien Baru */}
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
              width: "400px",
            }}
          >
            <h3>Form Registrasi Pasien Baru</h3>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>NIK *</label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Nama Lengkap *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Tanggal Lahir *</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Jenis Kelamin *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>No. HP</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Alamat</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
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
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pasien */}
      {showEditModal && (
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
              width: "400px",
            }}
          >
            <h3>Edit Data Pasien</h3>
            {editErrorMsg && <p style={{ color: "red" }}>{editErrorMsg}</p>}
            <form onSubmit={handleUpdateSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>NIK *</label>
                <input
                  type="text"
                  value={editFormData.nik}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, nik: e.target.value })
                  }
                  required
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Nama Lengkap *</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Tanggal Lahir *</label>
                <input
                  type="date"
                  value={editFormData.birth_date}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      birth_date: e.target.value,
                    })
                  }
                  required
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Jenis Kelamin *</label>
                <select
                  value={editFormData.gender}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, gender: e.target.value })
                  }
                  style={{ width: "100%", padding: "6px" }}
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>No. HP</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  style={{ width: "100%", padding: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Alamat</label>
                <textarea
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
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
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Pasien */}
      {showDetailModal && selectedPatient && (
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
              width: "400px",
            }}
          >
            <h3>Detail Pasien</h3>
            <hr style={{ marginBottom: "15px" }} />
            <p>
              <strong>No. RM:</strong> {selectedPatient.mr_number}
            </p>
            <p>
              <strong>NIK:</strong> {selectedPatient.nik}
            </p>
            <p>
              <strong>Nama:</strong> {selectedPatient.name}
            </p>
            <p>
              <strong>Tgl Lahir:</strong>{" "}
              {selectedPatient.birth_date
                ? selectedPatient.birth_date.split("T")[0]
                : "-"}
            </p>
            <p>
              <strong>Jenis Kelamin:</strong>{" "}
              {selectedPatient.gender === "L" ? "Laki-laki" : "Perempuan"}
            </p>
            <p>
              <strong>No. HP:</strong> {selectedPatient.phone || "-"}
            </p>
            <p>
              <strong>Alamat:</strong> {selectedPatient.address || "-"}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "15px",
              }}
            >
              <button
                onClick={() => setShowDetailModal(false)}
                style={{ padding: "6px 12px", cursor: "pointer" }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
