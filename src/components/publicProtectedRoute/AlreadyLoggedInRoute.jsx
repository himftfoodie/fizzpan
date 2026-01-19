import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function AlreadyLoggedInRoute({ children }) {
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

    // Jika sudah login, redirect ke halaman yang sesuai
    if (user) {
        // Cek dari state atau default ke halaman sesuai role
        const from = location.state?.from?.pathname;
        if (from) {
            return <Navigate to={from} replace />;
        }

        // Redirect berdasarkan role
        const redirectPath = user.role === 'admin' ? '/admin' : '/user';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}