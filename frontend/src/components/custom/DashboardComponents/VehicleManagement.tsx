import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVehicle } from "@/hooks";
import { Pen, X } from "lucide-react";
import Modal from 'react-modal';
import axios from 'axios';
import { BACKEND_URL } from "@/config";
import Loader from "../Loader";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function VehicleManagement() {
    // @ts-ignore
    const { loading, vehicles } = useVehicle();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [vehicleName, setVehicleName] = useState('');
    const [editVehicleName, setEditVehicleName] = useState('');
    const [editVehicleId, setEditVehicleId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Add Vehicle Modal Logic
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Edit Vehicle Modal Logic
    const openEditModal = (vehicle: any) => {
        setEditVehicleId(vehicle.id);
        setEditVehicleName(vehicle.name);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (vehicleName === '') {
            setError('Vehicle Name cannot be empty');
            return;
        }
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/admin/vehicle`, {
                name: vehicleName
            });
            if (response.status === 200) {
                setVehicleName('');
                setError('');
                setSuccess(response.data.msg);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
            setError('An error occurred while adding the vehicle.');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/v1/admin/vehicle/${id}`);
            if (response.status === 200) {
                toast.success("Vehicle Deleted Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch (error) {
            toast.error("Error Deleting Vehicle", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editVehicleName === '') {
            setError('Vehicle Name cannot be empty');
            return;
        }
        try {
            const response = await axios.put(`${BACKEND_URL}/api/v1/admin/vehicle/${editVehicleId}`, {
                name: editVehicleName
            });
            if (response.status === 200) {
                setEditVehicleName('');
                setSuccess(response.data.msg);
                setIsEditModalOpen(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating vehicle:', error);
            setError('An error occurred while updating the vehicle.');
        }
    };

    return (
        <div className="p-6 overflow-y-auto flex-grow">
            {/* Booking Requests */}
            <ToastContainer />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Vehicle
                        <Button className="text-white hover:cursor-pointer" onClick={openModal}>
                            Add Vehicle
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <Loader /> : (
                        <div className="space-y-4">
                            {vehicles.map((vehicle: any) => (
                                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                                    {vehicle.name}
                                    <div className='flex justify-center items-center gap-5'>
                                        <Button onClick={() => openEditModal(vehicle)} className="text-white">Edit</Button>
                                        <Trash2Icon className="text-red-500 cursor-pointer" onClick={() => handleDelete(vehicle.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Vehicle Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add Admin Modal"
                className="w-full border border-gray-300 rounded-lg bg-transparent relative z-10"
                overlayClassName="fixed inset-0 bg-transparent flex justify-center items-center z-50"
            >
                <div className="flex h-screen justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="w-96 shadow-lg p-8 bg-white rounded-lg relative">
                        <X size={36} className="hover:cursor-pointer absolute right-5 top-4" onClick={closeModal} />
                        <br />
                        <h2 className="text-2xl font-bold mb-6 text-center">Add New Vehicle</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="vehicleName" className="block text-sm font-medium">Vehicle Name</label>
                                <input
                                    type="text"
                                    id="vehicleName"
                                    value={vehicleName}
                                    onChange={(e) => setVehicleName(e.target.value)}
                                    className="w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            {success && <p className="text-green-500 text-center">{success}</p>}
                            <button
                                type="submit"
                                className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                Add Vehicle
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>

            {/* Edit Vehicle Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit Vehicle Modal"
                className="w-full border border-gray-300 rounded-lg bg-transparent relative z-10"
                overlayClassName="fixed inset-0 bg-transparent flex justify-center items-center z-50"
            >
                <div className="flex h-screen justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="w-96 shadow-lg p-8 bg-white rounded-lg relative">
                        <X size={36} className="hover:cursor-pointer absolute right-5 top-4" onClick={closeEditModal} />
                        <br />
                        <h2 className="text-2xl font-bold mb-6 text-center">Edit Vehicle</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="editVehicleName" className="block text-sm font-medium">Vehicle Name</label>
                                <input
                                    type="text"
                                    id="editVehicleName"
                                    value={editVehicleName}
                                    onChange={(e) => setEditVehicleName(e.target.value)}
                                    className="w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            {success && <p className="text-green-500 text-center">{success}</p>}
                            <button
                                type="submit"
                                className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
