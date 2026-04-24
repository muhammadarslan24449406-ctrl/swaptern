const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Message = require('../models/Message')

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

// Purani messages dekho
router.get('/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 })
        res.json(messages)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router