import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");
            const savedToken = localStorage.getItem("token");

            if(savedUser && savedToken !== "undefined") {
                setUser(JSON.parse(savedUser));
            }
            if(savedToken && savedToken !== "undefined") {
                setToken(savedToken);
            }
        } catch (error) {
            console.log("Error loading user from localStorage ", error);
        }
    }, []);

    const login = (user, token) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
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