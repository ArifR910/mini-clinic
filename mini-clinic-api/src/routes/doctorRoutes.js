const express = require('express');
const router = express.Router();
const { getAllDoctors } = require('../controllers/doctorController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, getAllDoctors);

module.exports = router;