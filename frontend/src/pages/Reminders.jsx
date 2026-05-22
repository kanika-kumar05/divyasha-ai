import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import API from "../services/api"

function Reminders() {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    const [medicines, setMedicines] = useState([])

    const [medicineName, setMedicineName] = useState("")

    const [dosage, setDosage] = useState("")

    const [reminderTime, setReminderTime] = useState("")

    const fetchUserAndMedicines = async () => {

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

            const medicineResponse = await API.get(
                `/medicines/${userResponse.data.id}`
            )

            setMedicines(medicineResponse.data)

        } catch (error) {

            console.log(error)

            localStorage.removeItem("token")

            navigate("/login")
        }
    }

    useEffect(() => {

        fetchUserAndMedicines()

    }, [])

    const addMedicine = async () => {

        if (!medicineName || !dosage || !reminderTime || !user) {
            alert("Please fill all fields")
            return
        }

        try {

            await API.post(
                "/medicines",
                {
                    user_id: user.id,
                    medicine_name: medicineName,
                    dosage: dosage,
                    reminder_time: reminderTime
                }
            )

            setMedicineName("")
            setDosage("")
            setReminderTime("")

            fetchUserAndMedicines()

        } catch (error) {

            console.log(error)

            alert("Failed to add medicine")
        }
    }

    const toggleStatus = async (medicine) => {

        try {

            await API.put(
                `/medicines/${medicine.id}/status`,
                {
                    taken_status: !medicine.taken_status
                }
            )

            fetchUserAndMedicines()

        } catch (error) {

            console.log(error)

            alert("Failed to update status")
        }
    }

    const deleteMedicine = async (medicineId) => {

        try {

            await API.delete(
                `/medicines/${medicineId}`
            )

            fetchUserAndMedicines()

        } catch (error) {

            console.log(error)

            alert("Failed to delete medicine")
        }
    }

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-8">

                    <div>
                        <h1 className="text-4xl font-bold text-blue-600">
                            Medicine Reminders
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Manage daily medicine schedule for {user?.name}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-700 text-white px-5 py-2 rounded-lg"
                    >
                        Back to Dashboard
                    </button>

                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">

                    <h2 className="text-2xl font-bold mb-4">
                        Add Medicine
                    </h2>

                    <div className="grid grid-cols-3 gap-4">

                        <input
                            type="text"
                            placeholder="Medicine Name"
                            className="p-3 border rounded-lg"
                            value={medicineName}
                            onChange={(e) => setMedicineName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Dosage e.g. 1 tablet"
                            className="p-3 border rounded-lg"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                        />

                        <input
                            type="time"
                            className="p-3 border rounded-lg"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                        />

                    </div>

                    <button
                        onClick={addMedicine}
                        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        Add Medicine
                    </button>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {medicines.length === 0 && (

                        <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-500">
                            No medicines added yet.
                        </div>
                    )}

                    {medicines.map((medicine) => (

                        <div
                            key={medicine.id}
                            className="bg-white p-6 rounded-2xl shadow-lg"
                        >

                            <div className="flex justify-between items-start">

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {medicine.medicine_name}
                                    </h2>

                                    <p className="text-gray-600 mt-2">
                                        Dosage: {medicine.dosage}
                                    </p>

                                    <p className="text-gray-600">
                                        Time: {medicine.reminder_time}
                                    </p>

                                    <p
                                        className={`mt-3 font-semibold ${
                                            medicine.taken_status
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {
                                            medicine.taken_status
                                                ? "Taken"
                                                : "Pending"
                                        }
                                    </p>
                                </div>

                                <button
                                    onClick={() => deleteMedicine(medicine.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                            <button
                                onClick={() => toggleStatus(medicine)}
                                className={`mt-5 px-5 py-2 rounded-lg text-white ${
                                    medicine.taken_status
                                        ? "bg-yellow-500"
                                        : "bg-green-600"
                                }`}
                            >
                                {
                                    medicine.taken_status
                                        ? "Mark Pending"
                                        : "Mark Taken"
                                }
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}

export default Reminders