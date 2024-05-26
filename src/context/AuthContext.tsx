"use client";

import { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

type User = {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
}

const AuthContext = createContext< { user: User | null, handleLogout: () => void } | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    // const router = useRouter();

    useEffect(() => {
        // fetch the user details from your authentication provider
        // set the user here
    }, []);

    const handleLogout = () => {
        // logout the user. Clear the user from the state
    }

    return (
        <AuthContext.Provider value={{ user, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

// hook to use the auth context
export const useAuth = () => useContext(AuthContext);

