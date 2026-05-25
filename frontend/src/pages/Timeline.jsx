import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import API from "../services/api"
import Layout from "../components/Layout"

function Timeline() {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [memories, setMemories] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const categoryStyles = {
        medicine: { label: "💊 Medicine", color: "bg-green-100 text-green-700" },
        family: { label: "👨‍👩‍👧 Family", color: "bg-purple-100 text-purple-700" },
        emotion: { label: "😊 Emotion", color: "bg-pink-100 text-pink-700" },
        appointment: { label: "📅 Appointment", color: "bg-yellow-100 text-yellow-700" },
        routine: { label: "🏃 Routine", color: "bg-blue-100 text-blue-700" },
        health: { label: "🩺 Health", color: "bg-red-100 text-red-700" },
        emergency: { label: "🚨 Emergency", color: "bg-red-200 text-red-800" },
        sleep: { label: "😴 Sleep", color: "bg-indigo-100 text-indigo-700" },
        food: { label: "🍲 Food", color: "bg-orange-100 text-orange-700" },
        exercise: { label: "🏋️ Exercise", color: "bg-teal-100 text-teal-700" },
        memory: { label: "🧠 Memory", color: "bg-cyan-100 text-cyan-700" },
        reminder: { label: "⏰ Reminder", color: "bg-amber-100 text-amber-700" },
        social: { label: "💬 Social", color: "bg-sky-100 text-sky-700" },
        personal: { label: "🌸 Personal", color: "bg-rose-100 text-rose-700" },
        general: { label: "📌 General", color: "bg-gray-100 text-gray-700" }
    }

    const fetchUserAndTimeline = async () => {
        try {
            const token = localStorage.getItem("token")

            const userResponse = await API.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setUser(userResponse.data)

            const memoriesResponse = await API.get(
                `/memories/${userResponse.data.id}`
            )

            setMemories(memoriesResponse.data)

        } catch (error) {
            console.log(error)
            localStorage.removeItem("token")
            navigate("/login")
        }
    }

    useEffect(() => {
        fetchUserAndTimeline()
    }, [])

    const filteredMemories = memories.filter((memory) =>
        memory.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    return (
        <Layout>
            <div className="p-8">
                <div className="max-w-5xl mx-auto">

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-blue-600">
                                Memory Timeline
                            </h1>

                            <p className="text-gray-600 mt-2">
                                Important memories for {user?.name}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-gray-700 text-white px-5 py-2 rounded-lg"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    {memories.length === 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                            <p className="text-5xl mb-4">🧠</p>

                            <h2 className="text-xl font-bold text-gray-700">
                                No memories saved yet
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Save important moments from the AI Assistant.
                            </p>
                        </div>
                    )}

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search memories..."
                            className="w-full p-4 rounded-2xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filteredMemories.length === 0 && memories.length > 0 && (
                        <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-white text-center text-gray-500">
                            No matching memories found.
                        </div>
                    )}

                    <div className="space-y-6">
                        {filteredMemories.map((memory) => {
                            const style =
                                categoryStyles[memory.category] ||
                                categoryStyles.general

                            return (
                                <div
                                    key={memory.id}
                                    className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-white border-l-4 border-blue-600"
                                >
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${style.color}`}
                                    >
                                        {style.label}
                                    </span>

                                    <h2 className="text-xl font-bold text-gray-800 mt-4">
                                        {memory.title}
                                    </h2>

                                    <p className="mt-3 text-gray-700 bg-gray-50 p-4 rounded-xl">
                                        {memory.content}
                                    </p>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default Timeline