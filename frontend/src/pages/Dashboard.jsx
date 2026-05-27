import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import API from "../services/api"
import Layout from "../components/Layout"

function Dashboard() {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [memoryCount, setMemoryCount] = useState(0)
    const [medicineCount, setMedicineCount] = useState(0)
    const [pendingCount, setPendingCount] = useState(0)
    const [emotionCount, setEmotionCount] = useState(0)

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await API.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setUser(response.data)

            const memoriesResponse = await API.get(`/memories/${response.data.id}`)
            setMemoryCount(memoriesResponse.data.length)

            const medicinesResponse = await API.get(`/medicines/${response.data.id}`)
            setMedicineCount(medicinesResponse.data.length)

            const pendingMedicines = medicinesResponse.data.filter(
                (medicine) => !medicine.taken_status
            )
            setPendingCount(pendingMedicines.length)

            const emotionMemories = memoriesResponse.data.filter(
                (memory) => memory.category === "emotion"
            )
            setEmotionCount(emotionMemories.length)

        } catch (error) {
            console.log(error)
            localStorage.removeItem("token")
            navigate("/login")
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <Layout>
            <div className="p-8">

                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-8 flex justify-between items-center border border-white">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-700">
                            Welcome back, {user?.name} 👋
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Your intelligent healthcare and memory companion.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-white border text-gray-700 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition"
                    >
                        ↪ Logout
                    </button>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

                    <div
                         onClick={() => navigate("/timeline")}
                         className="bg-white/90 p-6 rounded-2xl shadow-lg border-b-4 border-blue-600 hover:-translate-y-1 hover:shadow-2xl transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xs font-bold text-gray-500 uppercase">
                                    Total Memories
                                </h2>

                                <p className="text-4xl font-bold text-gray-900 mt-4">
                                    {memoryCount}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    logged in total
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                                🧠
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate("/reminders")}
                        className="bg-white/90 p-6 rounded-2xl shadow-lg border-b-4 border-green-500 hover:-translate-y-1 hover:shadow-2xl transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xs font-bold text-gray-500 uppercase">
                                    Medicines
                                </h2>

                                <p className="text-4xl font-bold text-gray-900 mt-4">
                                    {medicineCount}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    prescribed
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                                💊
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate("/reminders")}
                        className="bg-white/90 p-6 rounded-2xl shadow-lg border-b-4 border-pink-500 hover:-translate-y-1 hover:shadow-2xl transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xs font-bold text-gray-500 uppercase">
                                    Pending Meds
                                </h2>

                                <p className="text-4xl font-bold text-gray-900 mt-4">
                                    {pendingCount}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    to take today
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-2xl">
                                ⏰
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => navigate("/timeline")}
                        className="bg-white/90 p-6 rounded-2xl shadow-lg border-b-4 border-purple-600 hover:-translate-y-1 hover:shadow-2xl transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xs font-bold text-gray-500 uppercase">
                                    Emotions
                                </h2>

                                <p className="text-4xl font-bold text-gray-900 mt-4">
                                    {emotionCount}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    moods recorded
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                                🤍
                            </div>
                        </div>
                    </div>

                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-5">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div
                        onClick={() => navigate("/reminders")}
                        className="bg-white/90 p-6 rounded-2xl shadow-lg border-t-4 border-blue-600 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold text-gray-900">
                                Medicine Reminders
                            </h2>
                            <span className="text-2xl">💊</span>
                        </div>

                        <p className="text-gray-600 mt-4 leading-relaxed">
                            Track your daily medicines and stay on top of your health.
                        </p>

                        <p className="text-blue-700 font-semibold mt-5">
                            View Reminders →
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/timeline")}
                        className="bg-white/90 p-6 rounded-2xl shadow-lg border-t-4 border-purple-600 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold text-gray-900">
                                Memory Timeline
                            </h2>
                            <span className="text-2xl">🗓️</span>
                        </div>

                        <p className="text-gray-600 mt-4 leading-relaxed">
                            View your daily memory logs and reflect on your experiences.
                        </p>

                        <p className="text-purple-700 font-semibold mt-5">
                            Go to Timeline →
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/assistant")}
                        className="bg-white/90 p-6 rounded-2xl shadow-lg border-t-4 border-indigo-600 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold text-gray-900">
                                AI Assistant
                            </h2>
                            <span className="text-2xl">💬</span>
                        </div>

                        <p className="text-gray-600 mt-4 leading-relaxed">
                            Ask memory-related questions to your personal AI companion.
                        </p>

                        <p className="text-indigo-700 font-semibold mt-5">
                            Chat with AI →
                        </p>
                    </div>

                </div>

            </div>
        </Layout>
    )
}

export default Dashboard