import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            const user = loginWithToken(token);
            if (user && user.role) {
                if (user.role === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/user', { replace: true });
                }
            } else {
                console.error("OAuth redirect error: User or role is missing after login.");
                navigate('/login', { replace: true });
            }
        } else {
            console.error("OAuth redirect error: No token found in URL.");
            navigate('/login', { replace: true });
        }
    // The dependency array is correct. loginWithToken is now stable.
    }, [location, navigate, loginWithToken]);

    return <div>Processing login...</div>;
};

export default OAuth2RedirectHandler;
