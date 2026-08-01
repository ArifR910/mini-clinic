const db = require('../config/db');

exports.createPrescription = async (req, res) => {
  try {
    const { medical_record_id, items } = req.body;

    if (!medical_record_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Data resep obat tidak valid." });
    }

    const values = items.map(item => [
      medical_record_id,
      item.medicine_name,
      item.dosage || '-',
      item.instructions || item.instruction || '-'
    ]);

    const query = "INSERT INTO prescriptions (medical_record_id, medicine_name, dosage, instructions) VALUES ?";

    db.query(query, [values], (err, result) => {
      if (err) {
        console.error("Gagal insert prescriptions:", err);
        return res.status(500).json({ message: "Gagal menyimpan resep obat.", error: err });
      }
      return res.status(201).json({ message: "Resep obat berhasil disimpan!" });
    });

  } catch (error) {
    console.error("Error prescriptions:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};