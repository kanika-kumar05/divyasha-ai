import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import API from "../services/api"

function Timeline() {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    const [chats, setChats] = useState([])

    const fetchUserAndTimeline = async () => {

        try {
            const token = localStorage.getItem("token")

            const userResponse = await API.get(
                "/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setUser(userResponse.data)

            const memoriesResponse = await API.get(
                `/memories/${userResponse.data.id}`
            )

            setChats(memoriesResponse.data)

        } catch (error) {
            console.log(error)

            localStorage.removeItem("token")

            navigate("/login")
        }
    }

    useEffect(() => {
        fetchUserAndTimeline()
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-8">

                    <div>
                        <h1 className="text-4xl font-bold text-blue-600">
                            Memory Timeline
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Memory journal for {user?.name}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-700 text-white px-5 py-2 rounded-lg"
                    >
                        Back to Dashboard
                    </button>

                </div>

                {chats.length === 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-500">
                        No memories found yet. Start chatting with Asha AI.
                    </div>
                )}

                <div className="space-y-6">

                    {chats.map((chat) => (

                        <div
                            key={chat.id}
                            className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-600"
                        >

                            <div className="mb-4">

                                <p className="text-sm text-gray-500">
                                    Memory #{chat.id}
                                </p>

                                <h2 className="text-xl font-bold text-gray-800 mt-1">
                                    User Memory
                                </h2>

                                <p className="mt-2 text-gray-700 bg-blue-50 p-4 rounded-xl">
                                    {chat.content}
                                </p>

                            </div>

                            <div>

                                <h2 className="text-xl font-bold text-gray-800">
                                    Category
                                </h2>

                                <p className="mt-2 text-gray-700 bg-gray-100 p-4 rounded-xl">
                                    {chat.category}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}

export default Timeline