const db = require('../config/db');

const sendSuccess = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({ success: false, message, errors });
};

const getPolyPrefix = (polyId) => {
    const prefixes = { 1: 'A', 2: 'B', 3: 'C' };
    return prefixes[polyId] || 'A';
};

// 1. POST (Generate Nomor Antrean Baru)
const createQueue = async (req, res) => {
    const { registration_id } = req.body;

    if (!registration_id) {
        return sendError(res, 400, 'registration_id wajib diisi!');
    }

    try {
        const [regResult] = await db.query(
            'SELECT polyclinic_id FROM registrations WHERE id = ?',
            [registration_id]
        );

        if (regResult.length === 0) {
            return sendError(res, 404, 'Data pendaftaran tidak ditemukan');
        }

        const polyclinic_id = regResult[0].polyclinic_id;

        const [existing] = await db.query(
            'SELECT * FROM queues WHERE registration_id = ?',
            [registration_id]
        );

        if (existing.length > 0) {
            return sendError(res, 400, 'Nomor antrean untuk pendaftaran ini sudah dibuat!', existing[0]);
        }

        const [countResult] = await db.query(
            `SELECT COUNT(q.id) as total 
             FROM queues q
             JOIN registrations r ON q.registration_id = r.id
             WHERE r.polyclinic_id = ? AND DATE(q.created_at) = CURDATE()`,
            [polyclinic_id]
        );

        const totalToday = countResult[0].total + 1;
        const prefix = getPolyPrefix(polyclinic_id);
        const queue_number = `${prefix}${String(totalToday).padStart(3, '0')}`; // Contoh: A001

        const [result] = await db.query(
            'INSERT INTO queues (registration_id, queue_number, status) VALUES (?, ?, "Menunggu")',
            [registration_id, queue_number]
        );

        return sendSuccess(res, 201, 'Nomor antrean berhasil dibuat', {
            queue_id: result.insertId,
            registration_id,
            queue_number,
            status: 'Menunggu'
        });
    } catch (error) {
        console.error('Error createQueue:', error);
        return sendError(res, 500, 'Gagal membuat nomor antrean');
    }
};

// 2. GET (Daftar Antrean Hari Ini)
const getTodayQueues = async (req, res) => {
    try {
        const query = `
            SELECT 
                q.id, q.registration_id, q.queue_number, q.status, q.created_at,
                r.visit_date, r.payment_type, r.initial_complaint,
                p.id AS patient_id, p.name AS patient_name, p.mr_number,
                poly.id AS polyclinic_id, poly.name AS polyclinic_name
            FROM queues q
            JOIN registrations r ON q.registration_id = r.id
            JOIN patients p ON r.patient_id = p.id
            LEFT JOIN polyclinics poly ON r.polyclinic_id = poly.id
            WHERE DATE(q.created_at) = CURDATE()
            ORDER BY q.id ASC
        `;
        const [queues] = await db.query(query);
        return sendSuccess(res, 200, 'Berhasil mengambil daftar antrean hari ini', queues);
    } catch (error) {
        console.error('Error getTodayQueues:', error);
        return sendError(res, 500, 'Terjadi kesalahan pada server');
    }
};

// 3. PUT (Panggil atau Ubah Status Antrean)
const updateQueueStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Menunggu', 'Dipanggil', 'Dilayani', 'Selesai', 'Batal'];
    if (!status || !validStatuses.includes(status)) {
        return sendError(res, 400, `Status tidak valid! Pilihan status: ${validStatuses.join(', ')}`);
    }

    try {
        const [result] = await db.query(
            'UPDATE queues SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return sendError(res, 404, 'Data antrean tidak ditemukan');
        }

        return sendSuccess(res, 200, `Status antrean berhasil diubah menjadi ${status}`);
    } catch (error) {
        console.error('Error updateQueueStatus:', error);
        return sendError(res, 500, 'Gagal memperbarui status antrean');
    }
};

module.exports = {
    createQueue,
    getTodayQueues,
    updateQueueStatus
};