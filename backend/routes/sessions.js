const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Session = require('../models/Session')
const User = require('../models/User')

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

// Session book karo
router.post('/book', auth, async (req, res) => {
    try {
        const { teacherId, skill, date, time } = req.body

        if (teacherId === req.user.id) {
            return res.status(400).json({ message: 'Apne aap se session book nahi kar sakte!' })
        }

        const session = new Session({
            teacher: teacherId,
            student: req.user.id,
            skill, date, time
        })
        await session.save()

        res.status(201).json({ message: 'Session book ho gaya!', session })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Apne sessions dekho
router.get('/my', auth, async (req, res) => {
    try {
        const sessions = await Session.find({
            $or: [{ teacher: req.user.id }, { student: req.user.id }]
        }).populate('teacher', 'name email').populate('student', 'name email')
        res.json(sessions)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Session complete karo + credits transfer
router.put('/complete/:id', auth, async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
        if (!session) return res.status(404).json({ message: 'Session nahi mila' })

        session.status = 'completed'
        await session.save()

        // Teacher ko 5 credits do
        await User.findByIdAndUpdate(session.teacher, { $inc: { credits: 5 } })
        // Student ke 5 credits katao
        await User.findByIdAndUpdate(session.student, { $inc: { credits: -5 } })

        res.json({ message: 'Session complete! Credits transfer ho gaye!' })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Rating do
router.put('/rate/:id', auth, async (req, res) => {
    try {
        const { rating, review } = req.body
        const session = await Session.findById(req.params.id)

        if (!session) return res.status(404).json({ message: 'Session nahi mila' })
        if (session.status !== 'completed') {
            return res.status(400).json({ message: 'Pehle session complete karo!' })
        }

        session.rating = rating
        session.review = review
        await session.save()

        res.json({ message: 'Rating de di!', session })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router