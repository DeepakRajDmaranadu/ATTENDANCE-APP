const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'hod','principal','admin'], default: 'student' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null }

});

module.exports = mongoose.model('User', userSchema);
