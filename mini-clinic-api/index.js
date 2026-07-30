const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Selamat datang di API Mini Clinic Service!',
        status: 'Server Berjalan dengan Baik'
    });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});