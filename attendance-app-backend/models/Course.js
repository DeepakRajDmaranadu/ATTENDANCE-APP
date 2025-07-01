const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },

    principal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Official', // assuming you have a User model
        default: null
    },

    hod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Official',
        default: null
    }
});

module.exports = mongoose.model('Course', courseSchema);
