const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const Official = require('../models/Official');

const router = express.Router();

// Middleware to verify token

// Middleware to check if user is admin


// Register new user
router.post('/register', async (req, res) => {
    const { username, password, role, course } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role, course });
        await newUser.save();
        res.json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        let userType = 'user'; // default: User collection

        if (!user) {
            user = await Official.findOne({ username });
            userType = 'official';
        }

        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id, role: user.role, source: userType },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            role: user.role,
            source: userType, // 'user' or 'official'
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users (admin only)


module.exports = router;
