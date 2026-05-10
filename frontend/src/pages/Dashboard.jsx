import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    const cards = [
        { icon: '👤', title: 'Skill Profiles', desc: 'Browse community members and find your perfect skill exchange partner.', path: '/search' },
        { icon: '💬', title: 'Messages', desc: 'Connect with matched users through real-time 1-to-1 messaging.', path: '/chat' },
        { icon: '📅', title: 'Session Booking', desc: 'Schedule and manage your skill exchange sessions.', path: '/sessions' },
        { icon: '⭐', title: 'Credits & Reviews', desc: 'Earn credits by teaching. Spend them to learn. Build trust through reviews.', path: '/credits' },
        { icon: '👤', title: 'My Profile', desc: 'Update your profile, skills, and preferences.', path: '/profile' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">SW</div>
                    <span className="font-bold text-gray-800">Swaptern</span>
                </div>
                <button onClick={logout} className="text-gray-500 text-sm hover:text-red-500">Logout →</button>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(card.path)}
                            className="bg-white rounded-xl border border-gray-100 p-6 cursor-pointer hover:border-teal-300 hover:shadow-md transition-all"
                        >
                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-xl mb-4">{card.icon}</div>
                            <h2 className="font-semibold text-gray-800 mb-2">{card.title}</h2>
                            <p className="text-gray-500 text-sm">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard