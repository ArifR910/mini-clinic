const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');

// Endpoint: POST /api/treatments
router.post('/', treatmentController.createTreatment);

module.exports = router;