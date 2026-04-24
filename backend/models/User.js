const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skillsToTeach: [String],
    skillsToLearn: [String],
    credits: { type: Number, default: 0 },
    bio: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)