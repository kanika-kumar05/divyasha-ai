import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import API from "../services/api"

function Dashboard() {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)

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
        <div className="min-h-screen bg-gray-100 p-10">

            <div className="flex justify-between items-center">

                <div>
                    <h1 className="text-4xl font-bold text-blue-600">
                        Asha AI Dashboard
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Welcome, {user?.name}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg"
                >
                    Logout
                </button>

            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">

                <div
                    onClick={() => navigate("/reminders")}
                    className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl"
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
                    className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl"
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
                    className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl"
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
    )
}

export default Dashboard