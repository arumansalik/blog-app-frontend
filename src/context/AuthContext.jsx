import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");
            const savedToken = localStorage.getItem("token");

            if(savedUser && savedToken) {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
            }
        } catch (error) {
            console.log("Error loading user from localStorage ", error);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }, []);

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};