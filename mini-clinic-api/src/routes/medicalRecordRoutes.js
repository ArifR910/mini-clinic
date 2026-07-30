const express = require('express');
const router = express.Router();
const {
    createMedicalRecord,
    getPatientMedicalHistory
} = require('../controllers/medicalRecordController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createMedicalRecord);
router.get('/patient/:patient_id', verifyToken, getPatientMedicalHistory);

module.exports = router;