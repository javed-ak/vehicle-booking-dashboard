import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdmin } from "@/hooks";
import { X } from "lucide-react";
import { useState } from "react";
import Modal from 'react-modal';
import axios from 'axios';
import { BACKEND_URL } from "@/config";
import Loader from "../Loader";
import { Button } from "@/components/ui/button";

export default function AdminManagement() {
    // @ts-ignore
    const { loading, adminData } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const openModal = () => {
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setError("");
        setSuccess("");
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

            if (!response.data.error) {
                setSuccess("Admin added successfully!");
                setAdminName("");
                setAdminEmail("");
                setAdminPassword("");
                setError("");
            }
            else {
                if (response.data.error) {
                    setError(response.data.error);
                }
            }
        } catch (error) {
            console.error("Error adding admin:", error);
            setError("An error occurred while adding the admin.");
        }
    };

    return (
        <div className="p-6 overflow-y-auto flex-grow">
            {/* Booking Requests */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Admin
                        <Button className="text-white bg-blue-400 hover:cursor-pointer hover:bg-blue-700"
                            onClick={openModal}
                        >Add Admin</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <Loader /> : <div className="space-y-4 text-lg">
                        {adminData.map((admin: any) => (
                            <div
                                className="flex justify-between items-center px-4 py-2 border-b border-gray-200"
                            >{admin.name}
                                <p className="text-slate-400 text-md">{admin.email}</p>
                            </div>
                        ))}
                    </div>}
                </CardContent>
            </Card>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add Admin Modal"
                className="w-full border border-gray-300 rounded-lg bg-transparent relative z-10"
                overlayClassName="fixed inset-0 bg-transparent flex justify-center items-center z-50"

            >
                <div className="flex h-screen justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="w-96 shadow-lg p-8 bg-white rounded-lg relative">
                        <X size={36} className=" hover:cursor-pointer absolute
                        right-5 top-4"
                            onClick={closeModal}
                        />
                        <br />
                        <h2 className="text-2xl font-bold mb-6 text-center">Add New Admin
                        </h2>
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


                            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                            {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}


                            <button
                                type="submit"
                                className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                Add Admin
                            </button>
                        </form>
                    </div>

                </div>
            </Modal>
        </div>
    )
}

