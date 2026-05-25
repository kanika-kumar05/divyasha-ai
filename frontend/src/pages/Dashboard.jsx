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

            const response = await API.get(
                "/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

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
            <div className="p-10">

                <div className="flex justify-between items-center">

                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl">

                        <h1 className="text-3xl md:text-5xl font-bold">
                            Welcome back, {user?.name} 👋
                        </h1>

                        <p className="mt-4 text-blue-100 text-lg">
                            Your intelligent healthcare and memory companion.
                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">

                    <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white">
                        <h2 className="text-gray-500 text-sm">Total Memories</h2>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {memoryCount}
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white">
                        <h2 className="text-gray-500 text-sm">Medicines</h2>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {medicineCount}
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white">
                        <h2 className="text-gray-500 text-sm">Pending Medicines</h2>
                        <p className="text-3xl font-bold text-red-500 mt-2">
                            {pendingCount}
                        </p>
                    </div>

                    <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white">
                        <h2 className="text-gray-500 text-sm">Emotion Memories</h2>
                        <p className="text-3xl font-bold text-pink-500 mt-2">
                            {emotionCount}
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                    <div
                        onClick={() => navigate("/reminders")}
                        className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-white hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                        <h2 className="text-xl font-bold">
                            Medicine Reminders
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Track daily medicines.
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/timeline")}
                        className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-white hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                        <h2 className="text-xl font-bold">
                            Memory Timeline
                        </h2>

                        <p className="text-gray-600 mt-2">
                            View daily memory logs.
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/assistant")}
                        className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-white hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                        <h2 className="text-xl font-bold">
                            AI Assistant
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Ask memory-related questions.
                        </p>
                    </div>

                </div>

            </div>
        </Layout>
    )
}

export default Dashboard