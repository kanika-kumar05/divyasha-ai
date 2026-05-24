import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Assistant() {
    const navigate = useNavigate()

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [listening, setListening] = useState(false)
    const [voiceMode, setVoiceMode] = useState(false)

    const fetchUserAndChats = async () => {
        try {
            const token = localStorage.getItem("token")

            const userResponse = await API.get("/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setUser(userResponse.data)

            const chatsResponse = await API.get(`/chats/${userResponse.data.id}`)

            const formattedChats = []

            chatsResponse.data.forEach((chat) => {
                formattedChats.push({
                    sender: "user",
                    text: chat.message
                })

                formattedChats.push({
                    sender: "bot",
                    text: chat.response
                })
            })

            setMessages(formattedChats)

        } catch (error) {
            console.log(error)
            localStorage.removeItem("token")
            navigate("/login")
        }
    }

    useEffect(() => {
        fetchUserAndChats()
    }, [])

    const sendMessage = async () => {
        if (!message.trim() || !user || loading) return

        const currentMessage = message

        const userMsg = {
            sender: "user",
            text: currentMessage
        }

        setMessages((prev) => [...prev, userMsg])
        setMessage("")
        setLoading(true)

        try {
            const response = await API.post("/chat", {
                user_id: user.id,
                message: currentMessage
            })

            const botMsg = {
                sender: "bot",
                text: response.data.reply
            }

            setMessages((prev) => [...prev, botMsg])
            if (voiceMode) {
                const speech = new SpeechSynthesisUtterance(
                    response.data.reply
                )

                speech.lang = "en-US"
                speech.rate = 0.95
                speech.pitch = 1.2

                const voices = window.speechSynthesis.getVoices()

                const femaleVoice = voices.find(
                    (voice) =>
                        voice.name.includes("Female") ||
                        voice.name.includes("Samantha") ||
                        voice.name.includes("Zira") ||
                        voice.name.includes("Google US English")
                )

                if (femaleVoice) {
                    speech.voice = femaleVoice
                }

                window.speechSynthesis.speak(speech)
            }

        } catch (error) {
            console.log(error)

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Something went wrong. Please try again."
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const clearChat = () => {
        setMessages([])
    }

    const saveMemory = async (text) => {
    if (!user) return

    const category = prompt(
    "Enter category: medicine, family, emotion, appointment, routine, health, emergency, sleep, food, exercise, memory, reminder, social, personal, general"
)

    if (!category) return

    try {
        await API.post("/memories", {
            user_id: user.id,
            title: "Saved Memory",
            content: text,
            category: category.toLowerCase()
        })

        alert("Memory remembered successfully")

    } catch (error) {
        console.log(error)
        alert("Failed to save memory")
    }
}

    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            alert("Speech Recognition not supported")
            return
        }

        const recognition = new SpeechRecognition()

        recognition.lang = "en-US"

        recognition.start()

        setListening(true)

        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript

            setMessage(transcript)
            setVoiceMode(true)

            setListening(false)
        }

        recognition.onerror = () => {
            setListening(false)
        }

        recognition.onend = () => {
            setListening(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600">
                            Asha AI Assistant
                        </h1>

                        <p className="text-gray-600 mt-2">
                            {user ? `Chatting as ${user.name}` : "Loading user..."}
                        </p>
                    </div>

                    <button
                        onClick={clearChat}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                    >
                        Clear Screen
                    </button>
                </div>

                <div className="h-[430px] overflow-y-auto border rounded-2xl p-5 mt-6 bg-gray-50">

                    {messages.length === 0 && !loading && (
                        <div className="text-center mt-28">
                            <p className="text-5xl mb-4">🧠</p>
                            <h2 className="text-xl font-semibold text-gray-700">
                                No conversation yet
                            </h2>
                            <p className="text-gray-400 mt-2">
                                Ask Asha AI about medicines, memories, family, or daily help.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-5 flex ${
                                msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[75%] ${
                                    msg.sender === "user"
                                        ? "items-end"
                                        : "items-start"
                                } flex flex-col`}
                            >
                                <div
                                    className={`p-4 rounded-2xl shadow-sm leading-relaxed ${
                                        msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-sm"
                                            : "bg-white text-gray-800 border rounded-bl-sm"
                                    }`}
                                >
                                    {msg.text}
                                </div>

                                {msg.sender === "user" && (
                                    <button
                                        onClick={() => saveMemory(msg.text)}
                                        className="mt-2 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition"
                                    >
                                        🧠 Remember This
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-white border text-gray-600 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                                <span className="mr-2">Asha AI is thinking</span>
                                <span className="animate-pulse">...</span>
                            </div>
                        </div>
                    )}

                </div>

                <div className="flex gap-3 mt-4">

                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage()
                            }
                        }}
                    />

                    <button
                        onClick={startListening}
                        className={`w-14 h-14 flex items-center justify-center rounded-full text-white text-2xl shadow-lg transition-all duration-300 ${
                            listening
                                ? "bg-red-500 scale-110 animate-pulse"
                                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105"
                        }`}
                    >
                        🎤
                    </button>

                    <button
                        onClick={() => {
                            setVoiceMode(false)
                            sendMessage()
                        }}
                        disabled={loading}
                        className={`px-6 rounded-xl text-white transition ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Wait..." : "Send"}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Assistant