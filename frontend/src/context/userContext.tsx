import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the request data
interface UserData {
    name: string;
    email: string;
}

// Define the context value type
interface UserDataContextType {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

// Create the context
const UserDataContext = createContext<UserDataContextType | undefined>(
    undefined
);

// Create a provider component
export function UserDataProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<UserData>({
        name: "",
        email: "",
    });

    return (
        <UserDataContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserDataContext.Provider>
    );
}

// Custom hook to use the context
export function useUserData() {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error(
            "useUserData must be used within a UserData"
        );
    }
    return context;
}
