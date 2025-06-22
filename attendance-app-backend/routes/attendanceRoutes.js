const express = require('express');
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'No token, access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
}

// Mark attendance
router.post('/mark', auth, async (req, res) => {
    try {
        const newAttendance = new Attendance({ userId: req.user.userId });
        await newAttendance.save();
        res.json({ message: 'Attendance marked' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View attendance
router.get('/my', auth, async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.user.userId });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
