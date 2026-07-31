const db = require('../config/db');

const sendSuccess = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({ success: false, message, errors });
};

// Ambil semua data dokter
const getAllDoctors = async (req, res) => {
    try {
        const query = `
            SELECT 
                d.id, 
                d.user_id, 
                d.polyclinic_id, 
                d.specialization,
                u.name AS doctor_name,
                p.name AS polyclinic_name
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN polyclinics p ON d.polyclinic_id = p.id
        `;
        const [doctors] = await db.query(query);
        return sendSuccess(res, 200, 'Berhasil mengambil data dokter', doctors);
    } catch (error) {
        console.error('Error getAllDoctors:', error);
        return sendError(res, 500, 'Terjadi kesalahan pada server');
    }
};

module.exports = {
    getAllDoctors
};