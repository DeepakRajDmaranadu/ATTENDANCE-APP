const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['faculty', 'hod', 'principal']},
})

module.exports = mongoose.model('Official', Schema);