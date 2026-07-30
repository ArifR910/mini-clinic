const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username dan password wajib diisi!'
        });
    }

    try {
        const [users] = await db.query(
            `SELECT u.id, u.name, u.username, u.password, u.role_id, r.name as role_name 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.username = ?`,
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Username atau password salah!' });
        }

        const user = users[0];

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Username atau password salah!' });
        }

        const payload = {
            id: user.id,
            name: user.name,
            username: user.username,
            role_id: user.role_id,
            role_name: user.role_name
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        });

        return res.json({
            message: 'Login berhasil!',
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role_name
            }
        });

    } catch (error) {
        console.error('Error Login:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

module.exports = { login };