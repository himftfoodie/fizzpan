import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children, requiredRole }) {
    const auth = useAuth();
    const location = useLocation();

    // Handle case when useAuth returns undefined
    if (!auth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const { user, loading } = auth;

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate page based on current role
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else {
            return <Navigate to="/user" replace />;
        }
    }

    return children;
}