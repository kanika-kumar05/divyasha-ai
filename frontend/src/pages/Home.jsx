import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-sky-100 px-4">
      <div className="text-center bg-white/85 border border-slate-200 shadow-xl rounded-3xl p-10 max-w-xl w-full">
        <h1 className="text-5xl font-bold text-blue-600">
          Welcome to Divyasha
        </h1>

        <p className="mt-5 text-lg text-gray-600">
          Your AI-powered memory companion
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-white text-base font-semibold shadow-lg transition hover:bg-blue-700"
        >
          Let&apos;s go
        </button>
      </div>
    </div>
  )
}

export default Home