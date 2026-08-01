const express = require("express");
const router = express.Router();
const {
  createMedicalRecord,
  getPatientMedicalHistory,
  getAllMedicalRecords,
} = require("../controllers/medicalRecordController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

router.get("/", getAllMedicalRecords);

router.post(
  "/",
  verifyToken,
  checkRole(["Admin", "Dokter"]),
  createMedicalRecord,
);

router.get(
  "/patient/:patient_id",
  verifyToken,
  checkRole(["Admin", "Dokter", "Petugas Pendaftaran"]),
  getPatientMedicalHistory,
);

router.get("/patients/:patient_id/history", getPatientMedicalHistory);

module.exports = router;
