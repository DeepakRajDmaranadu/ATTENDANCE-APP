const express = require('express');
const jwt=require('jsonwebtoken')
const router = express.Router();
const User = require('../models/User');
const Course=require('../models/Course');
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

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};


router.get('/all', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find({})
        console.log("users ======== ", users)
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/courses', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await Course.find({})
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/courses', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;

        const existingCourse = await Course.findOne({ name });
        if (existingCourse) return res.status(400).json({ message: 'Course already exists' });

        const newCourse = new Course({ name });
        await newCourse.save();

        res.json({ message: 'Course created', course: newCourse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/registerOfficial',async(req,res)=>{
    const {username,password,role} = req.body;
    const hasedPassword =await bcrypt.hashSync(password, 10);
    const official = new Official({
        username,
        password:hasedPassword,
        role
    });
    official.save()
    .then(() => res.json({ message: 'Official registered' }))
    .catch(err => res.status(500).json({ error: err.message }));
})
module.exports = router;