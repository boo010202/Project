const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Session หมดอายุ กรุณาล็อกอินใหม่' });
        }
        req.user = user;
        next();
    });
};