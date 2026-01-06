import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import UseLoader from '../../components/loader/UseLoader';
import { 
    TextField, 
    Button, 
    IconButton, 
    InputAdornment, 
    Typography, 
    Box,
    Container
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LogoImg from '../../assets/img/fizzpan_logo.png';

export default function Register() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [loader, showLoader, hideLoader] = UseLoader();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        confirmPassword: ''
    });

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            showLoader();
            
            await signUp(formData.email, formData.password, { 
                username: formData.username,
                role: 'user'
            });
            
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Please check your email to verify your account.',
                confirmButtonColor: '#B8804A',
            }).then(() => {
                navigate('/login');
            });
        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = 'An error occurred during registration';
            if (error.message.includes('already registered')) {
                errorMessage = 'This email is already registered. Please use a different email or login.';
            } else if (error.message.includes('weak_password')) {
                errorMessage = 'Password is too weak. Please use a stronger password.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: errorMessage,
                confirmButtonColor: '#B8804A',
            });
        } finally {
            hideLoader();
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <img 
                    src={LogoImg} 
                    alt="FizzPan Logo" 
                    style={{ width: '150px', marginBottom: '20px' }} 
                />
                <Typography component="h1" variant="h5">
                    Create your account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Join us today and get started
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    {/* Username Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username}
                        autoFocus
                    />

                    {/* Email Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    {/* Password Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Confirm Password Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loader}
                    >
                        {loader ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}