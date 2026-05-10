import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Search() {
    const [skill, setSkill] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        searchUsers()
    }, [])

    const searchUsers = async (skillQuery = '') => {
        setLoading(true)
        try {
            const res = await axios.get(`http://localhost:5000/api/users/search?skill=${skillQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(res.data)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const handleSearch = () => searchUsers(skill)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 text-sm hover:text-teal-600 flex items-center gap-1 mb-3">
                    ← Back to Home
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Skill Profiles</h1>
                <p className="text-gray-500 text-sm">Browse community members and find your perfect skill exchange partner.</p>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Search Bar */}
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 relative">
                        <span className="absolute left-3 top-3 text-gray-400 text-sm">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, skill, or location..."
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full border border-gray-200 pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 text-sm font-medium"
                    >
                        Search
                    </button>
                </div>

                {loading && <p className="text-center text-gray-400 text-sm py-8">Loading...</p>}

                {!loading && users.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8">Koi user nahi mila</p>
                )}

                {/* User Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                        <div key={user._id} className="bg-white rounded-xl border border-gray-100 p-5">
                            {/* User Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                                    {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm">{user.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Beginner</span>
                                        <span className="text-xs text-teal-600">🌐 Online</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            {user.bio && <p className="text-gray-500 text-xs mb-3">{user.bio}</p>}

                            {/* Can Teach */}
                            {user.skillsToTeach?.length > 0 && (
                                <div className="mb-2">
                                    <p className="text-xs text-gray-400 mb-1">Can Teach</p>
                                    <div className="flex flex-wrap gap-1">
                                        {user.skillsToTeach.map((s, i) => (
                                            <span key={i} className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Wants to Learn */}
                            {user.skillsToLearn?.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-400 mb-1">Wants to Learn</p>
                                    <div className="flex flex-wrap gap-1">
                                        {user.skillsToLearn.map((s, i) => (
                                            <span key={i} className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-xs">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message Button */}
                            <button
                                onClick={() => navigate('/chat')}
                                className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center justify-center gap-2"
                            >
                                💬 Message
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Search