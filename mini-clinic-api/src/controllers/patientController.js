const db = require("../config/db");

const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

// 1. GET (Ambil Semua Pasien + Search & Pagination)
const getAllPatients = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    const [patients] = await db.query(
      `SELECT * FROM patients 
             WHERE name LIKE ? OR nik LIKE ? OR mr_number LIKE ?
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
      [
        searchQuery,
        searchQuery,
        searchQuery,
        parseInt(limit),
        parseInt(offset),
      ],
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM patients 
             WHERE name LIKE ? OR nik LIKE ? OR mr_number LIKE ?`,
      [searchQuery, searchQuery, searchQuery],
    );

    return sendSuccess(res, 200, "Berhasil mengambil data pasien", {
      patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error getAllPatients:", error);
    return sendError(res, 500, "Terjadi kesalahan pada server");
  }
};

// 2. GET (Detail Pasien)
const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const [patients] = await db.query("SELECT * FROM patients WHERE id = ?", [
      id,
    ]);
    if (patients.length === 0) {
      return sendError(res, 404, "Data pasien tidak ditemukan");
    }
    return sendSuccess(
      res,
      200,
      "Berhasil mengambil detail pasien",
      patients[0],
    );
  } catch (error) {
    console.error("Error getPatientById:", error);
    return sendError(res, 500, "Terjadi kesalahan pada server");
  }
};

// 3. POST (Tambah Pasien)
const createPatient = async (req, res) => {
  const { nik, name, birth_date, gender, address, phone } = req.body;

  if (!nik || !name || !birth_date || !gender) {
    return sendError(
      res,
      400,
      "NIK, Nama, Tanggal Lahir, dan Jenis Kelamin wajib diisi!",
    );
  }

  try {
    const [existing] = await db.query("SELECT id FROM patients WHERE nik = ?", [
      nik,
    ]);
    if (existing.length > 0) {
      return sendError(res, 400, "NIK sudah terdaftar!");
    }

    const year = new Date().getFullYear();
    const [lastPatient] = await db.query(
      "SELECT id FROM patients ORDER BY id DESC LIMIT 1",
    );
    const nextId = lastPatient.length > 0 ? lastPatient[0].id + 1 : 1;
    const mr_number = `RM-${year}-${String(nextId).padStart(4, "0")}`;

    const [result] = await db.query(
      `INSERT INTO patients (mr_number, nik, name, birth_date, gender, address, phone) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        mr_number,
        nik,
        name,
        birth_date,
        gender,
        address || null,
        phone || null,
      ],
    );

    return sendSuccess(res, 201, "Pasien berhasil ditambahkan", {
      id: result.insertId,
      mr_number,
    });
  } catch (error) {
    console.error("Error createPatient:", error);
    return sendError(res, 500, "Gagal menambahkan pasien.");
  }
};

// 4. PUT (Ubah Pasien)
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { nik, name, birth_date, gender, address, phone } = req.body;

  try {
    const [patients] = await db.query("SELECT * FROM patients WHERE id = ?", [
      id,
    ]);
    if (patients.length === 0) {
      return sendError(res, 404, "Data pasien tidak ditemukan");
    }

    await db.query(
      "UPDATE patients SET nik = ?, name = ?, birth_date = ?, gender = ?, address = ?, phone = ? WHERE id = ?",
      [nik, name, birth_date, gender, address, phone, id],
    );

    return sendSuccess(res, 200, "Data pasien berhasil diperbarui");
  } catch (error) {
    console.error("Error updatePatient:", error);
    return sendError(
      res,
      500,
      "Terjadi kesalahan saat memperbarui data pasien",
    );
  }
};

// 5. DELETE (Hapus Pasien)
const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const [patients] = await db.query("SELECT * FROM patients WHERE id = ?", [
      id,
    ]);
    if (patients.length === 0) {
      return sendError(res, 404, "Data pasien tidak ditemukan");
    }

    await db.query("DELETE FROM patients WHERE id = ?", [id]);
    return sendSuccess(res, 200, "Data pasien berhasil dihapus");
  } catch (error) {
    console.error("Error deletePatient:", error);
    return sendError(res, 500, "Terjadi kesalahan saat menghapus data pasien");
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
