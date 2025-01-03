import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/config';

const AddVehicle = () => {
    const [vehicleName, setVehicleName] = useState('');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
            setError('An error occurred while adding the vehicle.');
        }
    };

    return (
        <div className='flex h-screen justify-center items-center bg-slate-100'>
            <div className="w-96 shadow-lg p-8 bg-white rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Add Vehicle</h2>
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
                        className="w-full bg-blue-500 text-white py-2 rounded-md"
                    >
                        Add Vehicle
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVehicle;
