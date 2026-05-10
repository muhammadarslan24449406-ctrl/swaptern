import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Sessions() {
    const [sessions, setSessions] = useState([])
    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [activeTab, setActiveTab] = useState('upcoming')
    const [form, setForm] = useState({ teacherId: '', skill: '', date: '', time: '10:00 AM' })
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchSessions()
        fetchUsers()
    }, [])

    const fetchSessions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/sessions/my', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSessions(res.data)
        } catch (err) { console.log(err) }
    }

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users/search', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(res.data)
        } catch (err) { console.log(err) }
    }

    const bookSession = async () => {
        try {
            await axios.post('http://localhost:5000/api/sessions/book', form, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setShowModal(false)
            fetchSessions()
        } catch (err) { console.log(err) }
    }

    const completeSession = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/sessions/complete/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchSessions()
        } catch (err) { console.log(err) }
    }

    const upcoming = sessions.filter(s => s.status === 'pending')
    const completed = sessions.filter(s => s.status === 'completed')

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-teal-600 text-sm">← Back to Home</button>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-1"
                >
                    + Book Session
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">📅 Session Booking</h1>
                <p className="text-gray-500 text-sm mb-6">Schedule and manage your skill exchange sessions.</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Upcoming', value: upcoming.length, icon: '📅' },
                        { label: 'Pending Requests', value: upcoming.length, icon: '⏳' },
                        { label: 'Completed', value: completed.length, icon: '✅' },
                        { label: 'Total', value: sessions.length, icon: '👥' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                            <p className="text-xs text-gray-400 mb-1">{stat.icon} {stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
                    {['upcoming', 'history'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md text-sm font-medium capitalize ${activeTab === tab ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                        >
                            {tab === 'upcoming' ? 'Upcoming' : 'History'}
                        </button>
                    ))}
                </div>

                {/* Sessions List */}
                {activeTab === 'upcoming' && (
                    <div>
                        {upcoming.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                <p className="text-4xl mb-3">📅</p>
                                <p className="font-semibold text-gray-700">No upcoming sessions</p>
                                <p className="text-gray-400 text-sm mb-4">Book a session to start exchanging skills!</p>
                                <button onClick={() => setShowModal(true)} className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-teal-700">+ Book Session</button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {upcoming.map((session) => (
                                    <div key={session._id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800">{session.skill}</p>
                                            <p className="text-sm text-gray-500">Teacher: {session.teacher?.name}</p>
                                            <p className="text-sm text-gray-400">{session.date} — {session.time}</p>
                                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
                                        </div>
                                        <button
                                            onClick={() => completeSession(session._id)}
                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
                                        >
                                            Complete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div>
                        {completed.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                <p className="text-4xl mb-3">✅</p>
                                <p className="font-semibold text-gray-700">No past sessions</p>
                                <p className="text-gray-400 text-sm">Completed sessions will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {completed.map((session) => (
                                    <div key={session._id} className="bg-white rounded-xl border border-gray-100 p-5">
                                        <p className="font-semibold text-gray-800">{session.skill}</p>
                                        <p className="text-sm text-gray-500">Teacher: {session.teacher?.name}</p>
                                        <p className="text-sm text-gray-400">{session.date} — {session.time}</p>
                                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Completed ✅</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Book Session Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-gray-800 text-lg">Book a Skill Exchange Session</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-gray-600 mb-1 block">Partner</label>
                            <select
                                value={form.teacherId}
                                onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="">Select a partner</option>
                                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-gray-600 mb-1 block">Skill</label>
                            <input
                                type="text"
                                placeholder="e.g. React, Python..."
                                value={form.skill}
                                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-gray-600 mb-1 block">Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-gray-600 mb-1 block">Time</label>
                            <select
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                className="w-full border border-gray-200 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={bookSession}
                            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 flex items-center justify-center gap-2"
                        >
                            📅 Book Session
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sessions