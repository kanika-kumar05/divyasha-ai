import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Register() {

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {

        if (!name || !email || !password) {
            alert("Please fill all fields")
            return
        }

        try {

            setLoading(true)

            await API.post("/register", {
                name,
                email,
                password
            })

            alert("Registration successful!")

            navigate("/login")

        } catch (error) {

            console.log(error)

            alert(
                error.response?.data?.detail ||
                "Registration failed"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 px-4">

            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-300 rounded-full blur-3xl opacity-30"></div>

            <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-pink-300 rounded-full blur-3xl opacity-30"></div>

            <div className="absolute top-[40%] left-[60%] w-[200px] h-[200px] bg-purple-200 rounded-full blur-3xl opacity-20"></div>

            <div className="w-full flex items-center justify-center z-10">

                <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white">

                    <div className="text-center">

                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg">
                            🤍
                        </div>

                        <h1 className="text-4xl font-bold mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Create Account
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Start your journey with Asha AI
                        </p>

                    </div>

                    <div className="mt-8 space-y-4">

                        <input
                            type="text"
                            placeholder="Full name"
                            className="w-full p-4 border rounded-2xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full p-4 border rounded-2xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-4 border rounded-2xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className={`w-full p-4 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-2xl hover:-translate-y-1"
                            }`}
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>

                    </div>

                    <p className="text-center text-gray-600 mt-6">

                        Already have an account?{" "}

                        <button
                            onClick={() => navigate("/login")}
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            Login
                        </button>

                    </p>

                </div>

            </div>

        </div>
    )
}

export default Register