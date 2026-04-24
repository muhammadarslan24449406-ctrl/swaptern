const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware - token check karo
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ message: 'Token nahi hai' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ message: 'Token galat hai' })
    }
}

// Apna profile dekho
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Profile update karo
router.put('/update', auth, async (req, res) => {
    try {
        const { name, skillsToTeach, skillsToLearn, bio } = req.body

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, skillsToTeach, skillsToLearn, bio },
            { new: true }
        ).select('-password')

        res.json({ message: 'Profile update ho gaya!', user })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router