const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/register', register);

router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Akses profil berhasil!',
        user: req.user
    });
});

module.exports = router;