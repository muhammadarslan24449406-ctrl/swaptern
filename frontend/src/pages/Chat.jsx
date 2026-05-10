import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'

const socket = io('http://localhost:5000')

function Chat() {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [search, setSearch] = useState('')
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const currentUser = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        fetchUsers()
        socket.emit('join', currentUser?.id)

        socket.on('receiveMessage', (msg) => {
            setMessages((prev) => [...prev, msg])
        })

        return () => socket.off('receiveMessage')
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/search', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(res.data.filter(u => u._id !== currentUser?.id))
        } catch (err) {
            console.log(err)
        }
    }

    const openChat = async (user) => {
        setSelectedUser(user)
        try {
            const res = await axios.get(`http://localhost:5000/api/chat/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessages(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedUser) return
        socket.emit('sendMessage', {
            senderId: currentUser?.id,
            receiverId: selectedUser._id,
            message: newMessage
        })
        setNewMessage('')
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-teal-600">←</button>
                <span className="text-lg font-semibold text-gray-800">💬 Messages</span>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left - Users List */}
                <div className="w-full md:w-80 bg-white border-r border-gray-100 flex flex-col">
                    <div className="p-4">
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border border-gray-200 pl-8 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-4xl mb-2">💬</p>
                                <p className="text-gray-400 text-sm">No conversations yet</p>
                                <p className="text-gray-300 text-xs">Search for users to start chatting</p>
                            </div>
                        )}
                        {filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => openChat(user)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 ${selectedUser?._id === user._id ? 'bg-teal-50' : ''}`}
                            >
                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">
                                    {user.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                                    <p className="text-gray-400 text-xs">{user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right - Chat Window */}
                <div className="hidden md:flex flex-1 flex-col">
                    {!selectedUser ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-3xl mb-4">💬</div>
                            <h3 className="font-semibold text-gray-700">Select a conversation</h3>
                            <p className="text-gray-400 text-sm">Choose a user to start messaging</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                                <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                                    {selectedUser.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{selectedUser.name}</p>
                                    <p className="text-green-500 text-xs">Online</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
                                {messages.length === 0 && (
                                    <p className="text-center text-gray-300 text-sm mt-8">Koi message nahi — pehla message bhejo!</p>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender === currentUser?.id ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    className="flex-1 border border-gray-200 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-teal-600 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-teal-700"
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Chat