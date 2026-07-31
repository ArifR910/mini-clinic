const db = require("../config/db");

const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

// 1. GET (Ambil semua pendaftaran)
const getAllRegistrations = async (req, res) => {
  try {
    const query = `
            SELECT 
                r.id, r.polyclinic_id, r.visit_date, r.payment_type, r.initial_complaint, r.status, r.created_at,
                p.id AS patient_id, p.mr_number, p.name AS patient_name,
                d.id AS doctor_id, d.specialization AS doctor_specialization, u.name AS doctor_user_name,
                poly.name AS polyclinic_name,
                q.queue_number, q.status AS queue_status
            FROM registrations r
            JOIN patients p ON r.patient_id = p.id
            JOIN doctors d ON r.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            LEFT JOIN polyclinics poly ON r.polyclinic_id = poly.id
            LEFT JOIN queues q ON q.registration_id = r.id
            ORDER BY r.created_at DESC
        `;
    const [registrations] = await db.query(query);
    return sendSuccess(
      res,
      200,
      "Berhasil mengambil data pendaftaran",
      registrations,
    );
  } catch (error) {
    console.error("Error getAllRegistrations:", error);
    return sendError(res, 500, "Terjadi kesalahan pada server");
  }
};

// 2. POST (Daftarkan pasien)
const createRegistration = async (req, res) => {
  const {
    patient_id,
    doctor_id,
    polyclinic_id,
    visit_date,
    payment_type,
    initial_complaint,
  } = req.body;

  if (
    !patient_id ||
    !doctor_id ||
    !polyclinic_id ||
    !visit_date ||
    !initial_complaint
  ) {
    return sendError(
      res,
      400,
      "Pasien, Dokter, Poliklinik ID, Tanggal Kunjungan, dan Keluhan Awal wajib diisi!",
    );
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Pastikan payment_type terisi dengan benar (Gunakan nilai dari body)
    const finalPaymentType = payment_type ? payment_type : "Umum";

    const [regResult] = await connection.query(
      `INSERT INTO registrations (patient_id, doctor_id, polyclinic_id, visit_date, payment_type, initial_complaint) 
             VALUES (?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        doctor_id,
        polyclinic_id,
        visit_date,
        finalPaymentType,
        initial_complaint,
      ],
    );

    const registrationId = regResult.insertId;

    const [todayQueues] = await connection.query(
      `SELECT COUNT(*) AS total FROM registrations WHERE DATE(created_at) = CURDATE()`,
    );
    const queueCount = todayQueues[0].total;
    const queueNumber = `A${String(queueCount).padStart(3, "0")}`;

    await connection.query(
      `INSERT INTO queues (registration_id, queue_number, status) VALUES (?, ?, ?)`,
      [registrationId, queueNumber, "Menunggu"],
    );

    await connection.commit();

    return sendSuccess(res, 201, "Pendaftaran pasien berhasil dibuat", {
      registration_id: registrationId,
      queue_number: queueNumber,
      status: "Menunggu",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error createRegistration:", error);
    return sendError(res, 500, "Gagal membuat pendaftaran pasien");
  } finally {
    connection.release();
  }
};

// 3. PUT (Ubah status pendaftaran)
const updateRegistrationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "Menunggu",
    "Check In",
    "Dipanggil",
    "Pemeriksaan",
    "Selesai",
    "Dibatalkan",
  ];
  if (!validStatuses.includes(status)) {
    return sendError(res, 400, "Status tidak valid!");
  }

  try {
    const [exist] = await db.query(
      "SELECT id FROM registrations WHERE id = ?",
      [id],
    );
    if (exist.length === 0) {
      return sendError(res, 404, "Data pendaftaran tidak ditemukan");
    }

    await db.query("UPDATE registrations SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    await db.query("UPDATE queues SET status = ? WHERE registration_id = ?", [
      status,
      id,
    ]);

    return sendSuccess(
      res,
      200,
      `Status pendaftaran berhasil diperbarui menjadi ${status}`,
    );
  } catch (error) {
    console.error("Error updateRegistrationStatus:", error);
    return sendError(res, 500, "Gagal memperbarui status pendaftaran");
  }
};

module.exports = {
  getAllRegistrations,
  createRegistration,
  updateRegistrationStatus,
};
