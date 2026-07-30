const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 1. Controller Register
const register = async (req, res) => {
    const { role_id, name, username, password } = req.body;

    if (!role_id || !name || !username || !password) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (role_id, name, username, password) VALUES (?, ?, ?, ?)',
            [role_id, name, username, hashedPassword]
        );

        return res.status(201).json({ message: 'User berhasil didaftarkan!' });
    } catch (error) {
        console.error('Error Register:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi!' });
    }

    try {
        const [users] = await db.query(
            `SELECT users.*, roles.name AS role_name 
             FROM users 
             LEFT JOIN roles ON users.role_id = roles.id 
             WHERE users.username = ?`,
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Tidak Ditemukan!' });
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Username atau password salah!' });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role_name 
            },
            process.env.JWT_SECRET || 'secretkey123',
            { expiresIn: '1d' }
        );

        return res.status(200).json({
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
        return res.status(500).json({ message: 'Terjadi kesalahan server saat login.' });
    }
};

module.exports = { login, register };