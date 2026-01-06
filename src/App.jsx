import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/publicProtectedRoute/ProtectedRoute';
import AlreadyLoggedInRoute from './components/publicProtectedRoute/AlreadyLoggedInRoute';

// Import pages
import Login from './pages/autentikasi/Login';
import Register from './pages/autentikasi/Register';
import LandingPage from './pages/landing page';
import ErrorePage from './pages/error page/ErrorePage';

// Admin pages
import Dashboard from './pages/dashboard admin/Dashboard';

// Customer pages
import CustomerApp from './pages/customer/UserView';
import Checkout from './pages/user/Checkout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              <AlreadyLoggedInRoute>
                <Login />
              </AlreadyLoggedInRoute>
            } />
            <Route path="/register" element={
              <AlreadyLoggedInRoute>
                <Register />
              </AlreadyLoggedInRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Customer Routes */}
            <Route path="/user" element={
              <ProtectedRoute>
                <CustomerApp />
              </ProtectedRoute>
            } />
            <Route path="/user/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<ErrorePage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

