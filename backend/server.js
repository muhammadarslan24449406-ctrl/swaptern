const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' }
})

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connect ho gaya!'))
    .catch((err) => console.log('MongoDB error:', err))

const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const userRoutes = require('./routes/users')
const creditRoutes = require('./routes/credits')
const sessionRoutes = require('./routes/sessions')
const chatRoutes = require('./routes/chat')

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/users', userRoutes)
app.use('/api/credits', creditRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/chat', chatRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'Server chal raha hai!' })
})

// Socket.io - Real time chat
const Message = require('./models/Message')

io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userId) => {
        socket.join(userId)
        console.log(`User ${userId} room mein aa gaya`)
    })

    socket.on('sendMessage', async (data) => {
        const { senderId, receiverId, message } = data

        const newMessage = new Message({ sender: senderId, receiver: receiverId, message })
        await newMessage.save()

        io.to(receiverId).emit('receiveMessage', newMessage)
        io.to(senderId).emit('receiveMessage', newMessage)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server port ${PORT} pe chal raha hai`)
})