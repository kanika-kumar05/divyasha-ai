import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Assistant from "./pages/Assistant"
import Reminders from "./pages/Reminders"

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/login" />
    }

    return children
}

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assistant"
                    element={
                        <ProtectedRoute>
                            <Assistant />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reminders"
                    element={
                        <ProtectedRoute>
                            <Reminders />
                        </ProtectedRoute>
                    }
                />

            </Routes>


        </BrowserRouter>
    )
}

export default App