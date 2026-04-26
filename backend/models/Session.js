const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    rating: { type: Number, default: 0 },
    review: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('Session', sessionSchema)