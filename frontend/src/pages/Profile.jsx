import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Profile() {
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [skillsToTeach, setSkillsToTeach] = useState([])
    const [skillsToLearn, setSkillsToLearn] = useState([])
    const [teachInput, setTeachInput] = useState('')
    const [learnInput, setLearnInput] = useState('')
    const [credits, setCredits] = useState(0)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/profile/me', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setName(res.data.name)
                setBio(res.data.bio)
                setCredits(res.data.credits)
                setSkillsToTeach(res.data.skillsToTeach || [])
                setSkillsToLearn(res.data.skillsToLearn || [])
            } catch (err) {
                console.log(err)
            }
        }
        fetchProfile()
    }, [])

    const addTeachSkill = () => {
        if (teachInput.trim()) {
            setSkillsToTeach([...skillsToTeach, teachInput.trim()])
            setTeachInput('')
        }
    }

    const addLearnSkill = () => {
        if (learnInput.trim()) {
            setSkillsToLearn([...skillsToLearn, learnInput.trim()])
            setLearnInput('')
        }
    }

    const removeTeachSkill = (i) => setSkillsToTeach(skillsToTeach.filter((_, idx) => idx !== i))
    const removeLearnSkill = (i) => setSkillsToLearn(skillsToLearn.filter((_, idx) => idx !== i))

    const updateProfile = async () => {
        try {
            await axios.put('http://localhost:5000/api/profile/update', {
                name, bio, skillsToTeach, skillsToLearn
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage('Profile save ho gaya! ✅')
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setMessage('Error aa gaya!')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 text-sm hover:text-teal-600">← Home</button>
                <h1 className="font-semibold text-gray-800">My Profile</h1>
                <button onClick={logout} className="text-gray-500 text-sm hover:text-red-500 flex items-center gap-1">
                    Logout →
                </button>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Avatar */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-2xl mx-auto mb-2">
                        {name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                    <p className="text-gray-400 text-sm">Profile initials</p>
                </div>

                {message && <p className="text-teal-600 text-center mb-4 text-sm">{message}</p>}

                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
                    <h2 className="font-semibold text-gray-800 mb-4">Basic Info</h2>

                    <div className="mb-4">
                        <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-sm text-gray-600 mb-1 block">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>

                    {/* Credits */}
                    <div className="bg-teal-50 rounded-lg px-4 py-3 flex items-center justify-between">
                        <span className="text-sm text-gray-600">My Credits</span>
                        <span className="text-teal-600 font-bold text-lg">{credits} 💰</span>
                    </div>
                </div>

                {/* Skills I Can Teach */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
                    <h2 className="font-semibold text-teal-600 mb-4">🎓 Skills I Can Teach</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {skillsToTeach.map((s, i) => (
                            <span key={i} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {s}
                                <button onClick={() => removeTeachSkill(i)} className="text-teal-400 hover:text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. JavaScript, Guitar, Photography..."
                            value={teachInput}
                            onChange={(e) => setTeachInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTeachSkill()}
                            className="flex-1 border border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                        <button onClick={addTeachSkill} className="bg-teal-600 text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-teal-700 text-lg">+</button>
                    </div>
                </div>

                {/* Skills I Want to Learn */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                    <h2 className="font-semibold text-orange-500 mb-4">📚 Skills I Want to Learn</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {skillsToLearn.map((s, i) => (
                            <span key={i} className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {s}
                                <button onClick={() => removeLearnSkill(i)} className="text-orange-300 hover:text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. Python, Cooking, Graphic Design..."
                            value={learnInput}
                            onChange={(e) => setLearnInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addLearnSkill()}
                            className="flex-1 border border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                        <button onClick={addLearnSkill} className="bg-orange-500 text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-orange-600 text-lg">+</button>
                    </div>
                </div>

                <button
                    onClick={updateProfile}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 flex items-center justify-center gap-2"
                >
                    💾 Save Profile
                </button>
            </div>
        </div>
    )
}

export default Profile