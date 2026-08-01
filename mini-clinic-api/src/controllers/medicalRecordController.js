const db = require("../config/db");

const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

const createMedicalRecord = async (req, res) => {
  const {
    patient_id,
    registration_id,
    doctor_id,
    subjective,
    systolic,
    diastolic,
    body_temperature,
    temperature,
    weight,
    height,
    assessment,
    plan,
    actions,
    prescriptions,
  } = req.body;

  if (!patient_id || !registration_id) {
    return sendError(res, 400, "patient_id dan registration_id wajib diisi!");
  }

  try {
    const tempValue = body_temperature || temperature || null;

    // 1. INSERT KE MEDICAL_RECORDS (Disesuaikan persis dengan phpMyAdmin)
    const [recordResult] = await db.query(
      `INSERT INTO medical_records 
      (registration_id, patient_id, doctor_id, subjective, systolic, diastolic, body_temperature, weight, height, assessment, plan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registration_id,
        patient_id,
        doctor_id || 1,
        subjective || "-",
        systolic || null,
        diastolic || null,
        tempValue,
        weight || null,
        height || null,
        assessment || "-",
        plan || "-",
      ],
    );

    const medicalRecordId = recordResult.insertId;

    // 2. INSERT KE TREATMENTS (Tindakan)
    if (actions && typeof actions === "string" && actions.trim() !== "") {
      await db.query(
        `INSERT INTO treatments (medical_record_id, treatment_name, notes) 
         VALUES (?, ?, ?)`,
        [medicalRecordId, actions, plan || "-"],
      );
    }

    // 3. INSERT KE PRESCRIPTIONS (Resep Obat)
    if (
      prescriptions &&
      Array.isArray(prescriptions) &&
      prescriptions.length > 0
    ) {
      for (const item of prescriptions) {
        // Cek jika properti medicine_name / medicineName diisi
        const medicineName = item.medicine_name || item.medicineName;
        if (medicineName && medicineName.trim() !== "") {
          await db.query(
            `INSERT INTO prescriptions (medical_record_id, medicine_name, dosage, instructions) 
             VALUES (?, ?, ?, ?)`,
            [
              medicalRecordId,
              medicineName,
              item.dosage || "-",
              item.instructions || item.instruction || "-",
            ],
          );
        }
      }
    }

    // 4. UPDATE STATUS ANTREAN & REGISTRASI
    if (registration_id) {
      await db.query(
        "UPDATE registrations SET status = 'Selesai' WHERE id = ?",
        [registration_id],
      );
      await db.query(
        "UPDATE queues SET status = 'Selesai' WHERE registration_id = ?",
        [registration_id],
      );
    }

    return sendSuccess(
      res,
      201,
      "Pemeriksaan Dokter, Tindakan & Resep berhasil disimpan!",
      { medical_record_id: medicalRecordId },
    );
  } catch (error) {
    console.error("=== ERROR MYSQL ===", error);
    return sendError(
      res,
      500,
      "Gagal menyimpan rekam medis",
      error.sqlMessage || error.message,
    );
  }
};

const getAllMedicalRecords = async (req, res) => {
  try {
    const query = `
      SELECT 
        mr.id,
        mr.patient_id,
        mr.created_at,
        mr.subjective,
        mr.assessment,
        mr.plan,
        p.name AS patient_name,
        p.mr_number,
        GROUP_CONCAT(DISTINCT pr.medicine_name SEPARATOR ', ') AS prescription,
        GROUP_CONCAT(DISTINCT tr.treatment_name SEPARATOR ', ') AS treatment
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      LEFT JOIN prescriptions pr ON mr.id = pr.medical_record_id
      LEFT JOIN treatments tr ON mr.id = tr.medical_record_id
      GROUP BY mr.id
      ORDER BY mr.created_at DESC
    `;

    const [records] = await db.query(query);

    return sendSuccess(
      res,
      200,
      "Berhasil mengambil seluruh data rekam medis",
      records,
    );
  } catch (error) {
    console.error("Error getAllMedicalRecords:", error);
    return sendError(res, 500, "Gagal mengambil rekam medis", error.message);
  }
};

const getPatientMedicalHistory = async (req, res) => {
  const { patient_id } = req.params;

  try {
    const query = `
      SELECT 
        mr.*, 
        p.name AS patient_name,
        d.name AS doctor_name
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      LEFT JOIN doctors d ON mr.doctor_id = d.id
      WHERE mr.patient_id = ?
      ORDER BY mr.created_at DESC
    `;
    const [history] = await db.query(query, [patient_id]);

    return sendSuccess(
      res,
      200,
      "Berhasil mengambil riwayat rekam medis pasien",
      history,
    );
  } catch (error) {
    console.error("Error getPatientMedicalHistory:", error);
    return sendError(res, 500, "Gagal mengambil riwayat rekam medis pasien");
  }
};

module.exports = {
  createMedicalRecord,
  getPatientMedicalHistory,
  getAllMedicalRecords,
};
