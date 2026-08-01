import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const MedicalRecord = () => {
  const navigate = useNavigate();
  const { queueId } = useParams();

  const auth = useContext(AuthContext);
  const user = auth?.user || null;

  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [initialComplaint, setInitialComplaint] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    registration_id: "",
    subjective: "",
    objective_bp_sys: "",
    objective_bp_dia: "",
    objective_temp: "",
    objective_weight: "",
    objective_height: "",
    assessment: "",
    plan: "",
    actions: "",
  });

  const [prescriptions, setPrescriptions] = useState([
    { medicine_name: "", dosage: "", instructions: "" },
  ]);

  // Helper Konversi Jenis Kelamin
  const formatGender = (gender) => {
    if (!gender) return "-";
    const g = gender.toString().toUpperCase();
    if (g === "L" || g === "MALE" || g === "LAKI-LAKI") return "Laki-laki";
    if (g === "P" || g === "FEMALE" || g === "PEREMPUAN") return "Perempuan";
    return gender;
  };

  // Helper Hitung Umur dari Tanggal Lahir
  const calculateAge = (dobString) => {
    if (!dobString) return "-";
    const birthDate = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return isNaN(age) ? "-" : `${age} Tahun`;
  };

  useEffect(() => {
    const fetchQueueDetail = async () => {
      if (!queueId) return;
      try {
        const response = await api.get("/queues");
        const queuesList = response.data?.data || response.data || [];

        if (Array.isArray(queuesList)) {
          const currentQueue = queuesList.find(
            (item) => Number(item.id) === Number(queueId)
          );

          if (currentQueue) {
            console.log("Data Antrean Ditemukan:", currentQueue);

            const reg =
              currentQueue.registration || currentQueue.Registration || {};
            const rawPatient =
              currentQueue.patient ||
              currentQueue.Patient ||
              reg.patient ||
              reg.Patient ||
              null;

            setPatientInfo(rawPatient);

            const complaint =
              currentQueue.complaint ||
              currentQueue.initial_complaint ||
              reg.complaint ||
              "-";
            setInitialComplaint(complaint);

            const pId =
              currentQueue.patient_id || rawPatient?.id || reg.patient_id || "";
            const rId =
              currentQueue.registration_id || reg.id || currentQueue.id || "";

            setFormData((prev) => ({
              ...prev,
              patient_id: pId,
              registration_id: rId,
              subjective: "",
            }));
          } else {
            console.error("Antrean ID " + queueId + " tidak ditemukan.");
          }
        }
      } catch (err) {
        console.error("Gagal mengambil daftar antrean:", err);
      }
    };

    fetchQueueDetail();
  }, [queueId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrescriptionChange = (index, e) => {
    const values = [...prescriptions];
    values[index][e.target.name] = e.target.value;
    setPrescriptions(values);
  };

  const addPrescriptionRow = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine_name: "", dosage: "", instructions: "" },
    ]);
  };

  const removePrescriptionRow = (index) => {
    const values = [...prescriptions];
    values.splice(index, 1);
    setPrescriptions(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.registration_id || !formData.patient_id) {
      alert("Data pasien/antrean belum terisi! Mohon periksa kembali.");
      return;
    }

    const doctorId = user?.id || user?.user_id || user?.doctor_id;

    if (!doctorId) {
      alert("ID Dokter tidak ditemukan. Silakan re-login.");
      return;
    }

    const validPrescriptions = prescriptions.filter(
      (item) => item.medicine_name && item.medicine_name.trim() !== ""
    );

    setLoading(true);

    try {
      const res = await api.post("/medical-records", {
        registration_id: Number(formData.registration_id),
        patient_id: Number(formData.patient_id),
        doctor_id: Number(doctorId),
        subjective: formData.subjective,
        systolic: Number(formData.objective_bp_sys) || null,
        diastolic: Number(formData.objective_bp_dia) || null,
        body_temperature: Number(formData.objective_temp) || null,
        weight: Number(formData.objective_weight) || null,
        height: Number(formData.objective_height) || null,
        assessment: formData.assessment,
        plan: formData.plan,
        actions: formData.actions,
        prescriptions: validPrescriptions,
      });

      if (res.data?.success) {
        alert("Pemeriksaan Dokter, Resep Obat, & Tindakan berhasil disimpan!");
        navigate("/queues");
      } else {
        alert(res.data?.message || "Gagal menyimpan rekam medis.");
      }
    } catch (err) {
      console.error("Gagal menyimpan rekam medis:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat menyimpan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
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
          <button
            onClick={() => navigate("/queues")}
            style={{
              padding: "10px 18px",
              backgroundColor: "#ffffff",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            ← Kembali ke Antrean
          </button>
          <h2
            style={{
              color: "#0f172a",
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            🩺 Form Pemeriksaan Dokter (SOAP)
          </h2>
        </div>

        {/* Grid Layout 2 Kolom */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* KOLOM KIRI: Profil Pasien & Keluhan Awal */}
          <div style={{ position: "sticky", top: "24px" }}>
            <div style={{ ...cardStyle, borderLeft: "4px solid #2563eb" }}>
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#0f172a",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "10px",
                }}
              >
                👤 Data Pasien
              </h3>

              {patientInfo ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <span style={labelStyle}>Nama Lengkap</span>
                    <p style={detailTextStyle}>
                      {patientInfo.name || patientInfo.patient_name || "-"}
                    </p>
                  </div>

                  <div>
                    <span style={labelStyle}>Jenis Kelamin</span>
                    <p style={detailTextStyle}>
                      {formatGender(
                        patientInfo.gender || patientInfo.jenis_kelamin
                      )}
                    </p>
                  </div>

                  <div>
                    <span style={labelStyle}>Umur Pasien</span>
                    <p style={detailTextStyle}>
                      {calculateAge(patientInfo.birth_date || patientInfo.dob)}
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                  Memuat data pasien...
                </p>
              )}
            </div>

            {/* Card Keluhan Awal */}
            <div style={{ ...cardStyle, borderLeft: "4px solid #f59e0b" }}>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#b45309",
                }}
              >
                📝 Keluhan Awal Saat Daftar
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#334155",
                  fontStyle: "italic",
                  backgroundColor: "#fef3c7",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #fde68a",
                }}
              >
                "{initialComplaint}"
              </p>
            </div>
          </div>

          {/* KOLOM KANAN: Form SOAP */}
          <div>
            <form onSubmit={handleSubmit}>
              {/* Section 1: Subjective */}
              <div style={cardStyle}>
                <h3 style={titleStyle}>
                  1. Subjective (S) - Hasil Anamnesis Dokter
                </h3>
                <textarea
                  name="subjective"
                  rows="3"
                  placeholder="Hasil wawancara medis / keluhan detail pasien..."
                  value={formData.subjective}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                />
              </div>

              {/* Section 2: Objective */}
              <div style={cardStyle}>
                <h3 style={titleStyle}>2. Objective (O) - Tanda-Tanda Vital</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Tekanan Darah (Sys / Dia)</label>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="number"
                        name="objective_bp_sys"
                        placeholder="Sys (120)"
                        value={formData.objective_bp_sys}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                      <span style={{ color: "#64748b", fontWeight: "bold" }}>/</span>
                      <input
                        type="number"
                        name="objective_bp_dia"
                        placeholder="Dia (80)"
                        value={formData.objective_bp_dia}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Suhu Tubuh (°C)</label>
                    <input
                      type="text"
                      name="objective_temp"
                      placeholder="Contoh: 36.5"
                      value={formData.objective_temp}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Berat Badan (kg)</label>
                    <input
                      type="number"
                      name="objective_weight"
                      placeholder="Contoh: 65"
                      value={formData.objective_weight}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      name="objective_height"
                      placeholder="Contoh: 170"
                      value={formData.objective_height}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Assessment */}
              <div style={cardStyle}>
                <h3 style={titleStyle}>3. Assessment (A) - Diagnosa</h3>
                <textarea
                  name="assessment"
                  rows="2"
                  placeholder="Diagnosa penyakit / kondisi pasien..."
                  value={formData.assessment}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
                />
              </div>

              {/* Section 4: Plan */}
              <div style={cardStyle}>
                <h3 style={titleStyle}>
                  4. Plan (P) - Rencana Terapi & Tindakan
                </h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Rencana Terapi</label>
                  <textarea
                    name="plan"
                    rows="2"
                    placeholder="Rencana perawatan atau saran edukasi ke pasien..."
                    value={formData.plan}
                    onChange={handleChange}
                    style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Tindakan Medis yang Dilakukan</label>
                  <input
                    type="text"
                    name="actions"
                    placeholder="Contoh: Injeksi Vitamin, Pembersihan Luka, dll."
                    value={formData.actions}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Section 5: Resep Obat */}
              <div style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3 style={{ ...titleStyle, margin: 0 }}>
                    💊 Resep Obat Pasien
                  </h3>
                  <button
                    type="button"
                    onClick={addPrescriptionRow}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: "#16a34a",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    + Tambah Obat
                  </button>
                </div>

                {prescriptions.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "12px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      name="medicine_name"
                      placeholder="Nama Obat"
                      value={item.medicine_name}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <input
                      type="text"
                      name="dosage"
                      placeholder="Dosis (ex: 500mg)"
                      value={item.dosage}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="text"
                      name="instructions"
                      placeholder="Aturan (ex: 3x1 sesudah makan)"
                      value={item.instructions}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    {prescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrescriptionRow(index)}
                        style={{
                          padding: "10px 14px",
                          backgroundColor: "#fef2f2",
                          color: "#dc2626",
                          border: "1px solid #fca5a5",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "13px",
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  backgroundColor: loading ? "#94a3b8" : "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                }}
              >
                {loading
                  ? "Menyimpan Data..."
                  : "Simpan Pemeriksaan & Selesaikan Antrean"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
  marginBottom: "20px",
  textAlign: "left",
};

const titleStyle = {
  marginTop: 0,
  marginBottom: "16px",
  fontSize: "16px",
  fontWeight: "700",
  color: "#0f172a",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: "#475569",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  textAlign: "left",
};

const detailTextStyle = {
  margin: 0,
  fontSize: "15px",
  fontWeight: "600",
  color: "#0f172a",
  textAlign: "left",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  fontSize: "14px",
  color: "#ffffff",
  outline: "none",
  textAlign: "left",
};

export default MedicalRecord;