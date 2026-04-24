const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check karo email pehle se hai ya nahi
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email pehle se registered hai' })
        }

        // Password encrypt karo
        const hashedPassword = await bcrypt.hash(password, 10)

        // User banao
        const user = new User({ name, email, password: hashedPassword })
        await user.save()

        res.status(201).json({ message: 'User register ho gaya!' })

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // User dhundo
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Email ya password galat hai' })
        }

        // Password check karo
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ya password galat hai' })
        }

        // Token banao
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } })

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

module.exports = router