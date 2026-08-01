const db = require('../config/db');

exports.createTreatment = async (req, res) => {
  try {
    const { medical_record_id, treatment_name, notes } = req.body;

    if (!medical_record_id || !treatment_name) {
      return res.status(400).json({ message: "Data tindakan medis tidak lengkap." });
    }

    const query = "INSERT INTO treatments (medical_record_id, treatment_name, notes) VALUES (?, ?, ?)";
    
    db.query(query, [medical_record_id, treatment_name, notes || "-"], (err, result) => {
      if (err) {
        console.error("Gagal insert treatments:", err);
        return res.status(500).json({ message: "Gagal menyimpan tindakan medis." });
      }
      res.status(201).json({ message: "Tindakan medis berhasil disimpan!" });
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};