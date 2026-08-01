const db = require('../config/db');

const sendSuccess = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({ success: false, message, errors });
};

// GET (Ringkasan Statistik Dashboard)
const getDashboardStats = async (req, res) => {
    try {
        const [[{ total_patients }]] = await db.query(
            'SELECT COUNT(*) AS total_patients FROM patients'
        );

        const [[{ total_patients_today }]] = await db.query(
            'SELECT COUNT(*) AS total_patients_today FROM registrations WHERE DATE(visit_date) = CURDATE() OR DATE(created_at) = CURDATE()'
        );

        const [[{ total_queues_today }]] = await db.query(
            'SELECT COUNT(*) AS total_queues_today FROM queues WHERE DATE(created_at) = CURDATE()'
        );

        const [[{ total_waiting }]] = await db.query(
            'SELECT COUNT(*) AS total_waiting FROM queues WHERE status = "Menunggu" AND DATE(created_at) = CURDATE()'
        );

        const [[{ total_calling }]] = await db.query(
            'SELECT COUNT(*) AS total_calling FROM queues WHERE status = "Dipanggil" AND DATE(created_at) = CURDATE()'
        );

        const [[{ total_completed }]] = await db.query(
            'SELECT COUNT(*) AS total_completed FROM queues WHERE status = "Selesai" AND DATE(created_at) = CURDATE()'
        );

        return sendSuccess(res, 200, 'Berhasil mengambil statistik dashboard', {
            total_patients,
            total_patients_today,
            total_queues_today,
            total_waiting,
            total_calling,
            total_completed
        });
    } catch (error) {
        console.error('Error getDashboardStats:', error);
        return sendError(res, 500, 'Gagal mengambil statistik dashboard');
    }
};

module.exports = {
    getDashboardStats
};