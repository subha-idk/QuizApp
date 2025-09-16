import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them back to that page after they log in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If the route is for admins only, check the user's role
    if (adminOnly && user?.role !== 'admin') {
        // Redirect non-admins to the user homepage
        return <Navigate to="/user" replace />;
    }

    return children;
};

export default ProtectedRoute;
