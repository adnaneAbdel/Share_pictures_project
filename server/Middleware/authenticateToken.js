const jwt = require('jsonwebtoken');
const { verifyToken } = require('../Controllers/jwt'); // Adjust path as per your project structure

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = { userId: decoded.id }; // Assuming decoded object has 'id' field
        next();
    } catch (err) {
        console.error('Error decoding token:', err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
