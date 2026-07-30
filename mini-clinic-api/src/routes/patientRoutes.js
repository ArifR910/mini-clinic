const express = require('express');
const router = express.Router();
const {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Seluruh rute diproteksi dengan verifyToken
router.get('/', verifyToken, getAllPatients);
router.get('/:id', verifyToken, getPatientById);
router.post('/', verifyToken, createPatient);
router.put('/:id', verifyToken, updatePatient);
router.delete('/:id', verifyToken, deletePatient);

module.exports = router;