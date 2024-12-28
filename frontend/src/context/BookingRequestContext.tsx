import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the request data
interface RequestData {
    vehicle:    string;
    dateTime:   string;
    firstName:  string;
    lastName:   string;
    email:      string;
    phone:      string;
    pickup:     string;
    dropoff:    string
    note:       string;
}

// Define the context value type
interface RequestDataContextType {
    requestData: RequestData;
    setRequestData: React.Dispatch<React.SetStateAction<RequestData>>;
}

// Create the context
const RequestDataContext = createContext<RequestDataContextType | undefined>(
    undefined
);

// Create a provider component
export function RequestDataProvider({ children }: { children: ReactNode }) {
    const [requestData, setRequestData] = useState<RequestData>({
        vehicle: "",
        dateTime: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        pickup: "",
        dropoff: "",
        note: "",
    });

    return (
        <RequestDataContext.Provider value={{ requestData, setRequestData }}>
            {children}
        </RequestDataContext.Provider>
    );
}

// Custom hook to use the context
export function useRequestData() {
    const context = useContext(RequestDataContext);
    if (!context) {
        throw new Error(
            "useRequestData must be used within a RequestDataProvider"
        );
    }
    return context;
}
