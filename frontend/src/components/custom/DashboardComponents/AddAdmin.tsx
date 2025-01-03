import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";

export default function AddAdmin() {
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!adminName || !adminEmail || !adminPassword) {
            setError("All fields are required!");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/admin/signup`, {
                name: adminName,
                email: adminEmail,
                password: adminPassword,
            });

            if (response.status === 200) {
                setSuccess("Admin added successfully!");
                setAdminName("");
                setAdminEmail("");
                setAdminPassword("");
                setError("");
            }
        } catch (error) {
            console.error("Error adding admin:", error);
            setError("An error occurred while adding the admin.");
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-slate-100">

            <div className="w-96 shadow-lg p-8 bg-white rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Admin</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="adminName" className="block text-gray-700 font-semibold">
                            Name
                        </label>
                        <input
                            type="text"
                            id="adminName"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label htmlFor="adminEmail" className="block text-gray-700 font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            id="adminEmail"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label htmlFor="adminPassword" className="block text-gray-700 font-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            id="adminPassword"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>


                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-4">{success}</p>}


                    <button
                        type="submit"
                        className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        Add Admin
                    </button>
                </form>
            </div>
        </div>
    );
}
