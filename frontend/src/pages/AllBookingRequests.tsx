import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks";
import { useState } from "react";
import Modal from "@/components/ui/Model";
import { toast, ToastContainer } from "react-toastify";
import { Cross } from "lucide-react";
import { useBookingData } from "@/context/setBooking";

export default function AllBookingRequests() {
    const { loading, dashboardData, handleBookingAction, updateBookingDetails } = useDashboard();
    const { bookingData, setBookingData } = useBookingData();
    // States for filtering
    const [vehicleFilter, setVehicleFilter] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [prepTime, setPrepTime] = useState<string>("0");
    // State for the selected booking (for popup and edit)
    const [isEditing, setIsEditing] = useState(false); // State to track edit mode

    // Editable fields state
    const [editableFields, setEditableFields] = useState({
        dateTime: "",
        prepTime: 0,
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const requestsPerPage = 20;

    const [statusFilter, setStatusFilter] = useState<string>("");

    const filteredData = dashboardData.filter((request) => {
        const matchesVehicle =
            !vehicleFilter || request.vehicle.toLowerCase().includes(vehicleFilter.toLowerCase());
        const matchesSearch =
            !searchQuery ||
            `${request.firstName} ${request.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            request.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            !statusFilter || request.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesVehicle && matchesSearch && matchesStatus;
    });


    const uniqueVehicles = Array.from(
        new Set(dashboardData.map((request) => request.vehicle))
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / requestsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * requestsPerPage,
        currentPage * requestsPerPage
    );

    // Handle input change for editable fields
    const handleFieldChange = (e) => {
        if (e.target.name === "prepTime") {
            setEditableFields({
                ...editableFields,
                [e.target.name]: parseInt(e.target.value),
            });
        } else {
            setEditableFields({
                ...editableFields,
                [e.target.name]: e.target.value,
            });
        }
    };

    // Save the updated data to the database
    const saveChanges = async () => {
        if (bookingData) {
            await updateBookingDetails(bookingData.id, editableFields);
            // @ts-ignore
            bookingData.prepTime = editableFields.prepTime || bookingData.prepTime;
            // @ts-ignore
            bookingData.dateTime = editableFields.dateTime || bookingData.dateTime;
            // @ts-ignore
            bookingData.vehicle = editableFields.vehicle || bookingData.vehicle;
            // @ts-ignore
            bookingData.pickup = editableFields.pickup || bookingData.pickup;
            // @ts-ignore
            bookingData.dropoff = editableFields.dropoff || bookingData.dropoff;

            toast.success("Request saved successfully!");
            setIsEditing(false); // Exit edit mode
            // setBookingData(null); // Close the modal

        }
    };

    const handleAction = async (id, action, prepTime) => {
        setPrepTime("0");
        await handleBookingAction(id, action, parseInt(prepTime));
        toast.success(`Booking ${action.toLowerCase()} successfully!`);
        setBookingData(null);
    };

    // Show loading spinner if data is still loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orangeColor border-solid"></div>
            </div>
        );
    }

    return (
        <div className="p-6 overflow-y-auto flex-grow">
            <ToastContainer position="top-right" />
            <Card>
                <CardHeader className="grid grid-cols-3 items-center space-x-4">
                    <CardTitle>Booking Requests</CardTitle>

                    {/* Search Input */}
                    <input
                        type="text"
                        className="p-2 border border-gray-300 rounded text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by name or vehicle"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Vehicle and Status Filter Dropdown */}
                    <select
                        className="p-2 border border-gray-300 rounded text-sm w-48 focus:outline-none"
                        value={vehicleFilter || statusFilter} // Dynamically show the active filter
                        onChange={(e) => {
                            const value = e.target.value;
                            if (["Canceled", "Pending", "Accepted", "Rejected"].includes(value)) {
                                setStatusFilter(value); // Update status filter
                                setVehicleFilter(""); // Clear vehicle filter
                            } else {
                                setVehicleFilter(value); // Update vehicle filter
                                setStatusFilter(""); // Clear status filter
                            }
                        }}
                    >
                        {/* Default option */}
                        <option value="">Filter by</option>

                        {/* Vehicle options */}
                        <optgroup label="Vehicles">
                            {uniqueVehicles.map((vehicle) => (
                                <option key={vehicle} value={vehicle}>
                                    {vehicle}
                                </option>
                            ))}
                        </optgroup>

                        {/* Status options */}
                        <optgroup label="Status">
                            <option value="Canceled">Canceled</option>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </optgroup>
                    </select>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {currentData.map((request) => (
                            <div
                                key={request.id}
                                className="flex justify-between items-center p-4 my-4 bg-gray-100 rounded cursor-pointer"
                                onClick={() => {
                                    // @ts-ignore
                                    setBookingData(request);
                                    setPrepTime(String(request.prepTime));
                                    setEditableFields({
                                        dateTime: request.dateTime,
                                        // @ts-ignore
                                        prepTime: request.prepTime
                                    }); // Set editable fields
                                }}
                            >
                                <div>
                                    <div className="font-semibold">
                                        {request.firstName} {request.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">{request.vehicle}</div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm font-medium">{request.dateTime}</div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`${request.status === "Pending"
                                            ? "bg-orangeColor text-white hover:bg-orange-50"
                                            : request.status === "Accepted"
                                                ? "text-white bg-green-600 hover:border-green-600"
                                                : "bg-red-600 text-white border-red-500 hover:bg-red-50"
                                            }`}
                                    >
                                        {request.status}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                >
                    Previous
                </Button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                >
                    Next
                </Button>
            </div>

            {/* Popup for Selected Booking */}
            {bookingData && (
                <Modal
                    isOpen={bookingData}
                    onClose={() => {
                        setBookingData(null);
                        setIsEditing(false); // Exit edit mode when modal is closed
                    }}
                    title={isEditing ? "Modify Booking" : "Booking Details"}
                >
                    <div className="p-4 space-y-4 border-t-4 border-orangeColor">

                        {/* Show editable fields for other data except name, email, and phone number */}

                        <div>
                            <strong>Name:</strong> {bookingData.firstName} {bookingData.lastName}
                        </div>
                        <div>
                            <strong>Email:</strong> {bookingData.email}
                        </div>
                        <div>
                            <strong>Phone Number:</strong> {bookingData.phone}
                        </div>
                        <div>
                            <strong>Vehicle: </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    id="vehicle"
                                    name="vehicle"
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded"
                                    value={editableFields.vehicle || bookingData.vehicle}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                bookingData.vehicle
                            )}
                        </div>
                        <div>
                            {!isEditing ? (
                                <div>
                                    <strong>Date/Time:</strong> {bookingData.dateTime}
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="dateTime" className="block text-sm font-medium">
                                        <strong>Date/Time:</strong>
                                    </label>
                                    <input
                                        type="text"
                                        id="dateTime"
                                        name="dateTime"
                                        className="mt-1 p-2 block w-full border border-gray-300 rounded"
                                        value={editableFields.dateTime || bookingData.dateTime}
                                        onChange={handleFieldChange}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <strong>Pick-up Location: </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    id="pickup"
                                    name="pickup"
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded"
                                    value={editableFields.pickup || bookingData.pickup}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                bookingData.pickup
                            )}
                        </div>
                        <div>
                            <strong>Drop-off Location: </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    id="dropoff"
                                    name="dropoff"
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded"
                                    value={editableFields.dropoff || bookingData.dropoff}
                                    onChange={handleFieldChange}
                                />
                            ) : (
                                bookingData.dropoff
                            )}
                        </div>
                        <div>
                            <strong>Preparation Time (hrs.): </strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    id="prepTime"
                                    name="prepTime"
                                    className="mt-1 p-2 block w-full border border-gray-300 rounded"
                                    // @ts-ignore
                                    value={prepTime}
                                    onChange={(e) => {
                                        setPrepTime(e.target.value)
                                        handleFieldChange(e)
                                    }}
                                />
                            ) : (
                                bookingData.prepTime
                            )}
                        </div>
                        <div>
                            <strong>Status:</strong> {bookingData.status}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4 mt-4">
                            {!isEditing ? (
                                <>
                                    {bookingData.status === "Pending" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-white bg-orangeColor border-orangeColor hover:text-orangeColor"
                                                onClick={() => handleAction(bookingData.id, "Accepted", prepTime)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-orangeColor border-orangeColor hover:bg-orangeColor hover:text-white"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Modify
                                            </Button>
                                        </>
                                    )}
                                    {bookingData.status === "Accepted" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-orangeColor border-orangeColor hover:bg-orangeColor hover:text-white"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Modify
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-white bg-black border-black hover:bg-slate-50"
                                                onClick={() => handleAction(bookingData.id, "Canceled")}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                    {(bookingData.status === "Pending") && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-white bg-black border-black hover:bg-slate-50"
                                            onClick={() => handleAction(bookingData.id, "Rejected")}
                                        >
                                            Reject
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-white bg-black border-black hover:bg-slate-50"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-white bg-orangeColor border-orangeColor hover:text-orangeColor"
                                        onClick={saveChanges}
                                    >
                                        Save
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
