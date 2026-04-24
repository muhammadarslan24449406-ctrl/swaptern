const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connect ho gaya!'))
    .catch((err) => console.log('MongoDB error:', err))
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)
const profileRoutes = require('./routes/profile')
app.use('/api/profile', profileRoutes)
const userRoutes = require('./routes/users')
app.use('/api/users', userRoutes)
app.get('/', (req, res) => {
    res.json({ message: 'Server chal raha hai!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server port ${PORT} pe chal raha hai`)
})