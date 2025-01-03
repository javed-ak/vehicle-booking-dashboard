import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/config';

const AddVehicle = () => {
    const [vehicleName, setVehicleName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicleName || !image) {
            setError('Please fill in all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('vehicleName', vehicleName);
        formData.append('image', image);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/admin/vehicle`,
                formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.status === 200) {
                setVehicleName('');
                setImage(null);
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
            setError('An error occurred while adding the vehicle.');
        }
    };

    return (
        <div className='flex h-screen justify-center items-center bg-slate-100'>
            <div className="max-w-96 shadow-lg p-8 bg-white rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Add Vehicle</h2>
                {error && <p className="text-red-500">{error}</p>}
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

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium">Vehicle Image</label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                            className="w-full border rounded-md p-2"
                            accept="image/*"
                            required
                        />
                    </div>
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
