import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Passwords match nahi kar rahe!')
            return
        }
        try {
            await axios.post('https://swaptern-production.up.railway.app/api/auth/register', { name, email, password })
            navigate('/login')
        } catch (err) {
            setError('Register nahi hua, dobara try karo!')
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left - Green Side */}
            <div className="hidden md:flex w-1/2 bg-teal-600 flex-col items-center justify-center p-12 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6">SW</div>
                <h2 className="text-3xl font-bold mb-4">Swaptern</h2>
                <p className="text-teal-100 text-center text-lg">Join a community where everyone is both a teacher and a learner. Exchange skills, earn credits, and grow together.</p>
            </div>

            {/* Right - Form Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12">
                <Link to="/" className="text-gray-500 text-sm mb-8 flex items-center gap-1 hover:text-teal-600">
                    ← Back to Home
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome</h1>
                <p className="text-gray-500 mb-8">Sign in to your account or create a new one</p>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
                    <Link to="/login" className="flex-1 py-2 rounded-md text-gray-500 font-medium text-sm text-center hover:text-gray-700">Log In</Link>
                    <button className="flex-1 py-2 rounded-md bg-white text-gray-800 font-medium text-sm shadow-sm">Sign Up</button>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">👤</span>
                        <input
                            type="text"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">✉</span>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                        <input
                            type="password"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                        <input
                            type="password"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-200 pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>
                </div>

                <button
                    onClick={handleRegister}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 text-sm"
                >
                    Create Account
                </button>
            </div>
        </div>
    )
}

export default Register