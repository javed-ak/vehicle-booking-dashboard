import React, { createContext, useContext, useState, ReactNode } from "react";

interface ShowNext {
    show: boolean
}

interface ShowNextContextType {
    showNext: ShowNext;
    setShowNext: React.Dispatch<React.SetStateAction<ShowNext>>;
}

const ShowNextContext = createContext<ShowNextContextType | undefined>(
    undefined
);

// Create a provider component
export function ShowNextProvider({ children }: { children: ReactNode }) {
    const [showNext, setShowNext] = useState<ShowNext>({
        show: false
    });

    return (
        <ShowNextContext.Provider value={{ showNext, setShowNext }}>
            {children}
        </ShowNextContext.Provider>
    );
}

// Custom hook to use the context
export function useShowNext() {
    const context = useContext(ShowNextContext);
    if (!context) {
        throw new Error(
            "useRequestData must be used within a RequestDataProvider"
        );
    }
    return context;
}
