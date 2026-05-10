import { useNavigate } from 'react-router-dom'

function Landing() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">SW</div>
                    <span className="font-bold text-gray-800 text-lg">Swaptern</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-gray-600 hover:text-teal-600 text-sm">Features</a>
                    <a href="#how" className="text-gray-600 hover:text-teal-600 text-sm">How it Works</a>
                    <a href="#about" className="text-gray-600 hover:text-teal-600 text-sm">About</a>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <button onClick={() => navigate('/login')} className="text-gray-700 text-sm font-medium hover:text-teal-600">Log In</button>
                    <button onClick={() => navigate('/register')} className="bg-teal-600 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700">Sign Up Free</button>
                </div>
            </nav>

            {/* Hero */}
            <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 md:py-20 max-w-7xl mx-auto gap-8">
                <div className="w-full md:max-w-xl text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600 mb-6">
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        Community Powered Learning
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Learn Skills. <span className="text-teal-600">Teach Skills.</span><br />
                        <span className="text-orange-500">Grow Together.</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg mb-8">Join a community where everyone is both a teacher and a learner. Exchange skills, earn credits, and unlock your potential.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <button onClick={() => navigate('/register')} className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700">
                            Get Started Free →
                        </button>
                        <button onClick={() => navigate('/search')} className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">
                            Explore Skills
                        </button>
                    </div>
                    <p className="text-gray-400 text-sm mt-6">👥 2,500+ skill exchanges completed</p>
                </div>
                <div className="w-full md:w-96 h-48 md:h-80 bg-teal-50 rounded-2xl flex items-center justify-center text-6xl">
                    👥
                </div>
            </section>

            {/* Features */}
            <section id="features" className="bg-gray-50 py-16 px-6 md:px-8">
                <div className="max-w-6xl mx-auto text-center mb-12">
                    <p className="text-orange-500 font-semibold text-sm mb-2">FEATURES</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Everything You Need to Exchange Skills</h2>
                    <p className="text-gray-500 mt-3 text-sm md:text-base">From skill matching to credit-based exchanges, we've built the complete toolkit.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[
                        { icon: '👤', title: 'Skill Profiles', desc: 'Create your profile, showcase skills you can teach, and list what you want to learn.' },
                        { icon: '🧠', title: 'Smart Matching', desc: 'Find the perfect skill exchange partners based on compatibility.' },
                        { icon: '🔍', title: 'Skill Search', desc: 'Search and filter skills by type, experience level, and availability.' },
                        { icon: '💬', title: 'Chat System', desc: 'Connect with matched users through real-time 1-to-1 messaging.' },
                        { icon: '📅', title: 'Session Booking', desc: 'Schedule skill exchange sessions with integrated calendar.' },
                        { icon: '⭐', title: 'Credits & Reviews', desc: 'Earn credits by teaching. Spend them to learn. Build trust through reviews.' },
                    ].map((f, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-xl mb-4">{f.icon}</div>
                            <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                            <p className="text-gray-500 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section id="how" className="py-16 px-6 md:px-8">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <p className="text-orange-500 font-semibold text-sm mb-2">HOW IT WORKS</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Start Exchanging in 3 Simple Steps</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {[
                        { num: '01', title: 'Create Profile', desc: 'Sign up and add the skills you can teach and want to learn.' },
                        { num: '02', title: 'Get Matched', desc: 'Our system analyzes your profile and finds the best skill exchange partners.' },
                        { num: '03', title: 'Exchange & Grow', desc: 'Book sessions, exchange skills, earn credits, and level up!' },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">{s.num}</div>
                            <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
                            <p className="text-gray-500 text-sm">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-teal-600 mx-4 md:mx-8 rounded-2xl py-16 text-center mb-12 px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Start Exchanging Skills?</h2>
                <p className="text-teal-100 mb-6 text-sm md:text-base">Join thousands of learners and teachers. Your next skill is one exchange away.</p>
                <button onClick={() => navigate('/register')} className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600">
                    Join Swaptern Today →
                </button>
            </section>

            {/* Footer */}
            <footer className="flex flex-col md:flex-row items-center justify-between px-6 md:px-8 py-6 border-t border-gray-100 gap-4 text-center md:text-left">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">SW</div>
                    <span className="font-bold text-gray-800">Swaptern</span>
                </div>
                <p className="text-gray-400 text-sm">© 2026 Swaptern. All rights reserved.</p>
                <div className="flex gap-6 text-sm text-gray-500">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                </div>
            </footer>
        </div>
    )
}

export default Landing