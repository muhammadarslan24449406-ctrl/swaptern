import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Credits() {
    const [balance, setBalance] = useState(0)
    const [sessions, setSessions] = useState([])
    const [activeTab, setActiveTab] = useState('received')
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const currentUser = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        fetchBalance()
        fetchSessions()
    }, [])

    const fetchBalance = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/credits/balance', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setBalance(res.data.credits)
        } catch (err) { console.log(err) }
    }

    const fetchSessions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/sessions/my', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSessions(res.data)
        } catch (err) { console.log(err) }
    }

    const completedSessions = sessions.filter(s => s.status === 'completed')
    const receivedReviews = completedSessions.filter(s => s.teacher?._id === currentUser?.id && s.rating > 0)
    const givenReviews = completedSessions.filter(s => s.student?._id === currentUser?.id && s.rating > 0)
    const pendingReviews = completedSessions.filter(s => s.rating === 0)

    const avgRating = receivedReviews.length > 0
        ? (receivedReviews.reduce((sum, s) => sum + s.rating, 0) / receivedReviews.length).toFixed(1)
        : 'N/A'

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 text-sm hover:text-teal-600">← Back to Home</button>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">💰 Credits & Reviews</h1>
                <p className="text-gray-500 text-sm mb-6">Earn credits by teaching, spend them to learn, and build trust through reviews.</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Available Credits', value: balance, icon: '💰' },
                        { label: 'Credits Earned', value: completedSessions.filter(s => s.teacher?._id === currentUser?.id).length * 5, icon: '📈' },
                        { label: 'Credits Spent', value: completedSessions.filter(s => s.student?._id === currentUser?.id).length * 5, icon: '⏱' },
                        { label: 'Avg Rating', value: avgRating, icon: '⭐' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                            <p className="text-xs text-gray-400 mb-1">{stat.icon} {stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* How Credits Work */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                    <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">🎁 How Credits Work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <p className="text-2xl mb-2">🏅</p>
                            <p className="font-semibold text-gray-800 text-sm">Sign Up Bonus</p>
                            <p className="text-gray-500 text-xs mt-1">New users get <span className="text-teal-600 font-semibold">5 free credits</span> to start learning</p>
                        </div>
                        <div className="bg-teal-50 rounded-xl p-4 text-center">
                            <p className="text-2xl mb-2">📈</p>
                            <p className="font-semibold text-gray-800 text-sm">Teach & Earn</p>
                            <p className="text-gray-500 text-xs mt-1"><span className="text-teal-600 font-semibold">1 hour teaching = 1 credit</span> earned</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                            <p className="text-2xl mb-2">💸</p>
                            <p className="font-semibold text-gray-800 text-sm">Learn & Spend</p>
                            <p className="text-gray-500 text-xs mt-1">Use credits to <span className="text-orange-500 font-semibold">book learning sessions</span></p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
                    {[
                        { key: 'received', label: `Received (${receivedReviews.length})` },
                        { key: 'given', label: `Given (${givenReviews.length})` },
                        { key: 'pending', label: `Pending` },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-md text-sm font-medium ${activeTab === tab.key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Reviews */}
                {activeTab === 'received' && (
                    <div>
                        {receivedReviews.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                <p className="text-4xl mb-3">⭐</p>
                                <p className="font-semibold text-gray-700">No reviews yet</p>
                                <p className="text-gray-400 text-sm">Complete sessions and get reviewed by your partners!</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {receivedReviews.map((s, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-semibold text-gray-800">{s.skill}</p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star} className={star <= s.rating ? 'text-yellow-400' : 'text-gray-200'}>⭐</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm">{s.review}</p>
                                        <p className="text-gray-400 text-xs mt-2">By: {s.student?.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'given' && (
                    <div>
                        {givenReviews.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                <p className="text-4xl mb-3">➤</p>
                                <p className="font-semibold text-gray-700">No reviews given</p>
                                <p className="text-gray-400 text-sm">Leave feedback after completing sessions.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {givenReviews.map((s, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                                        <p className="font-semibold text-gray-800">{s.skill}</p>
                                        <p className="text-gray-500 text-sm">{s.review}</p>
                                        <p className="text-gray-400 text-xs mt-2">To: {s.teacher?.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pending' && (
                    <div>
                        {pendingReviews.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                <p className="text-4xl mb-3">⭐</p>
                                <p className="font-semibold text-gray-700">All caught up!</p>
                                <p className="text-gray-400 text-sm">You've reviewed all your completed sessions.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {pendingReviews.map((s, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800">{s.skill}</p>
                                            <p className="text-gray-500 text-sm">{s.teacher?.name}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/sessions')}
                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
                                        >
                                            Rate
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Credits