const db = require('../config/db');

const sendSuccess = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({ success: false, message, errors });
};

// 1. POST (Simpan hasil rekam medis dokter)
const createMedicalRecord = async (req, res) => {
    const { 
        registration_id, 
        patient_id, 
        doctor_id, 
        subjective, 
        systolic, 
        diastolic, 
        body_temperature, 
        weight, 
        height, 
        assessment, 
        plan 
    } = req.body;

    if (!registration_id || !patient_id || !doctor_id || !assessment) {
        return sendError(res, 400, 'registration_id, patient_id, doctor_id, dan assessment (diagnosa) wajib diisi!');
    }

    try {
        const [result] = await db.query(
            `INSERT INTO medical_records 
            (registration_id, patient_id, doctor_id, subjective, systolic, diastolic, body_temperature, weight, height, assessment, plan) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                registration_id, 
                patient_id, 
                doctor_id, 
                subjective || null, 
                systolic || null, 
                diastolic || null, 
                body_temperature || null, 
                weight || null, 
                height || null, 
                assessment, 
                plan || null
            ]
        );

        await db.query('UPDATE registrations SET status = "Selesai" WHERE id = ?', [registration_id]);

        return sendSuccess(res, 201, 'Rekam medis berhasil disimpan dan status pendaftaran selesai', {
            medical_record_id: result.insertId
        });
    } catch (error) {
        console.error('Error createMedicalRecord:', error);
        return sendError(res, 500, 'Gagal menyimpan rekam medis');
    }
};

// 2. GET (Riwayat Rekam Medis Pasien)
const getPatientMedicalHistory = async (req, res) => {
    const { patient_id } = req.params;

    try {
        const query = `
            SELECT 
                mr.id, mr.subjective, mr.systolic, mr.diastolic, mr.body_temperature, 
                mr.weight, mr.height, mr.assessment, mr.plan, mr.created_at,
                r.visit_date, r.initial_complaint, r.payment_type,
                p.name AS patient_name, p.mr_number,
                u.name AS doctor_name
            FROM medical_records mr
            JOIN registrations r ON mr.registration_id = r.id
            JOIN patients p ON mr.patient_id = p.id
            JOIN doctors d ON mr.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            WHERE mr.patient_id = ?
            ORDER BY mr.created_at DESC
        `;
        const [history] = await db.query(query, [patient_id]);
        return sendSuccess(res, 200, 'Berhasil mengambil riwayat rekam medis pasien', history);
    } catch (error) {
        console.error('Error getPatientMedicalHistory:', error);
        return sendError(res, 500, 'Terjadi kesalahan pada server');
    }
};

module.exports = {
    createMedicalRecord,
    getPatientMedicalHistory
};