import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the request data
interface BookingData {
    vehicle: string;
    dateTime: string;
    firstName: string;
    lastName: string;
    email: string;
    prepTime?: number;
    phone: string;
    pickup: string;
    dropoff: string
    note: string;
}

// Define the context value type
interface BookingDataContextType {
    bookingData: BookingData;
    setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

// Create the context
const BookingDataContext = createContext<BookingDataContextType | undefined>(
    undefined
);

// Create a provider component
export function BookingDataProvider({ children }: { children: ReactNode }) {
    const [bookingData, setBookingData] = useState<BookingData>({
        vehicle: "",
        dateTime: "",
        firstName: "",
        lastName: "",
        email: "",
        prepTime: 0,
        phone: "",
        pickup: "",
        dropoff: "",
        note: "",
    });

    return (
        <BookingDataContext.Provider value={{ bookingData, setBookingData }}>
            {children}
        </BookingDataContext.Provider>
    );
}

// Custom hook to use the context
export function useBookingData() {
    const context = useContext(BookingDataContext);
    if (!context) {
        throw new Error(
            "useBookingData must be used within a BookingDataProvider"
        );
    }
    return context;
}
