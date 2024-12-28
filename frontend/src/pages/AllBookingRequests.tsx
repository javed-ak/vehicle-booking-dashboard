import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

export default function AllBookingRequests() {
    const { loading, dashboardData } = useDashboard();

    // States for filtering
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [vehicleFilter, setVehicleFilter] = useState<string>("");

    // Filtered data based on selected date and vehicle name
    const filteredData = dashboardData.filter((request) => {
        const matchesDate =
            !selectedDate ||
            new Date(request.dateTime).toDateString() === selectedDate.toDateString();
        const matchesVehicle =
            !vehicleFilter || request.vehicle.toLowerCase().includes(vehicleFilter.toLowerCase());
        return matchesDate && matchesVehicle;
    });

    // Extract unique dates and vehicles for calendar and filtering
    const bookingDates = dashboardData.map((request) => new Date(request.dateTime));
    const uniqueDates = Array.from(
        new Set(bookingDates.map((date) => date.toDateString()))
    ).map((date) => new Date(date));
    const uniqueVehicles = Array.from(
        new Set(dashboardData.map((request) => request.vehicle))
    );

    return (
        <div className="p-6 overflow-y-auto flex-grow">
            {/* Booking Requests */}
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Booking Requests</CardTitle>
                    {/* Vehicle Filter Dropdown */}
                    <select
                        className="p-2 border border-gray-300 rounded text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={vehicleFilter}
                        onChange={(e) => setVehicleFilter(e.target.value)}
                    >
                        <option value="">Filter by Vehicle</option>
                        {uniqueVehicles.map((vehicle) => (
                            <option key={vehicle} value={vehicle}>
                                {vehicle}
                            </option>
                        ))}
                    </select>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredData.map((request) => (
                            <Link key={request.id} to={`/booking/${request.id}`}>
                                <div className="flex justify-between items-center p-4 my-4 bg-gray-100 rounded">
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
                                                    ? "text-orange-400 border-orange-400 hover:bg-orange-50"
                                                    : request.status === "Approved"
                                                        ? "text-green-500 border-green-500 hover:bg-green-50"
                                                        : "text-red-500 border-red-500 hover:bg-red-50"
                                                }`}
                                        >
                                            {request.status}
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
