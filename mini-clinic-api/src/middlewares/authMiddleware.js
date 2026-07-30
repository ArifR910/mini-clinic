const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak! Token tidak ditemukan.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
        
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluarsa!' });
    }
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Akses dilarang! Peran Anda tidak memiliki izin untuk fitur ini.' 
            });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };