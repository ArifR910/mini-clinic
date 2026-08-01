const express = require('express');
const router = express.Router();
const {
    createMedicalRecord,
    getPatientMedicalHistory
} = require('../controllers/medicalRecordController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.post(
    '/', 
    verifyToken, 
    checkRole(['Admin', 'Dokter']), 
    createMedicalRecord
);

router.get(
    '/patient/:patient_id', 
    verifyToken, 
    checkRole(['Admin', 'Dokter', 'Petugas Pendaftaran']), 
    getPatientMedicalHistory
);

module.exports = router;