const express = require('express');
const router = express.Router();
const {
    getAllRegistrations,
    createRegistration,
    updateRegistrationStatus
} = require('../controllers/registrationController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, getAllRegistrations);
router.post('/', verifyToken, createRegistration);
router.put('/:id', verifyToken, updateRegistrationStatus);

module.exports = router;