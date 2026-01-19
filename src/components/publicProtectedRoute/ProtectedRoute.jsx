import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading while checking auth
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
        return <Navigate to="/user" replace />;
    }

    return children;
}