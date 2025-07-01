const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Official = require('../models/Official');
const bcrypt = require('bcryptjs');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

const ishod = (req, res, next) => {
    if (req.user.role !== 'hod') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
// Get courses assigned to logged-in HOD
router.get('/my-courses', authenticateToken,ishod, async (req, res) => {
    try {
        console.log("user id = "+req.user.userId)
        const courses = await Course.find({hod: req.user.userId }).select('name')
        console.log("my courses = "+courses)
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;