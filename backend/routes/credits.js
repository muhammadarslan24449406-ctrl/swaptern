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

// Apna balance dekho
router.get('/balance', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name credits')
        res.json({ name: user.name, credits: user.credits })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Credits earn karo (session padhane ke baad)
router.post('/earn', auth, async (req, res) => {
    try {
        const { amount } = req.body
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { credits: amount } },
            { new: true }
        ).select('name credits')

        res.json({ message: `${amount} credits mile!`, credits: user.credits })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Credits kharch karo (session lene ke baad)
router.post('/spend', auth, async (req, res) => {
    try {
        const { amount } = req.body
        const user = await User.findById(req.user.id)

        if (user.credits < amount) {
            return res.status(400).json({ message: 'Credits kam hain!' })
        }

        user.credits -= amount
        await user.save()

        res.json({ message: `${amount} credits kharch hue!`, credits: user.credits })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router