import { NavLink, useNavigate } from "react-router-dom"

function Layout({ children }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    const linkClass = ({ isActive }) =>
        `block px-4 py-3 rounded-xl transition ${
            isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        }`

    const mobileLinkClass = ({ isActive }) =>
        `text-sm px-3 py-2 rounded-lg ${
            isActive
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
        }`

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">

            <aside className="w-64 bg-white/80 backdrop-blur-xl shadow-xl p-6 hidden lg:flex flex-col justify-between border-r border-white">

                <div>
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-blue-600">
                            Asha AI
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Memory Companion
                        </p>
                    </div>

                    <nav className="space-y-3">
                        <NavLink to="/dashboard" className={linkClass}>
                            🏠 Dashboard
                        </NavLink>

                        <NavLink to="/assistant" className={linkClass}>
                            🤖 AI Assistant
                        </NavLink>

                        <NavLink to="/timeline" className={linkClass}>
                            🧠 Memories
                        </NavLink>

                        <NavLink to="/reminders" className={linkClass}>
                            💊 Medicines
                        </NavLink>
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition"
                >
                    Logout
                </button>
            </aside>

            <main className="flex-1">

                <div className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur shadow-md p-4">

                    <div className="flex justify-between items-center mb-3">
                        <h1 className="text-xl font-bold text-blue-600">
                            Asha AI
                        </h1>

                        <button
                            onClick={handleLogout}
                            className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                        <NavLink to="/dashboard" className={mobileLinkClass}>
                            🏠 Dashboard
                        </NavLink>

                        <NavLink to="/assistant" className={mobileLinkClass}>
                            🤖 Assistant
                        </NavLink>

                        <NavLink to="/timeline" className={mobileLinkClass}>
                            🧠 Memories
                        </NavLink>

                        <NavLink to="/reminders" className={mobileLinkClass}>
                            💊 Medicines
                        </NavLink>
                    </div>

                </div>

                {children}
            </main>

        </div>
    )
}

export default Layout