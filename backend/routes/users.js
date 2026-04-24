const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Sab users dekho ya skill se search karo
router.get('/search', async (req, res) => {
    try {
        const { skill } = req.query

        let query = {}
        if (skill) {
            query = {
                skillsToTeach: { $regex: skill, $options: 'i' }
            }
        }

        const users = await User.find(query).select('-password')
        res.json(users)

    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// Kisi ek user ki profile dekho
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) return res.status(404).json({ message: 'User nahi mila' })
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router