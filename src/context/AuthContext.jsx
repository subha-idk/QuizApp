import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loginUser } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = () => {
            if (token) {
                try {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    setUser({
                        username: decodedToken.sub,
                        role: (decodedToken.role || 'user').toLowerCase()
                    });
                } catch (error) {
                    console.error("Invalid or expired token:", error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        validateToken();
    }, [token]);

    const login = async (credentials) => {
        const { data } = await loginUser(credentials);
        localStorage.setItem('token', data.jwt); 
        setToken(data.jwt);
        const newUser = {
            username: data.username,
            role: data.role.toLowerCase()
        };
        setUser(newUser);
        return newUser; 
    };

    // FIX: Wrap the function in useCallback to prevent it from being recreated on every render.
    const loginWithToken = useCallback((oauthToken) => {
        localStorage.setItem('token', oauthToken);
        setToken(oauthToken);
        const decodedToken = JSON.parse(atob(oauthToken.split('.')[1]));
        const newUser = {
            username: decodedToken.sub,
            role: (decodedToken.role || 'user').toLowerCase()
        };
        setUser(newUser);
        return newUser;
    }, []); // Empty dependency array means the function is created only once.

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        logout,
        loginWithToken,
        isAuthenticated: !!token,
        loading
    };

    if (loading) {
        return <div>Loading Application...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
