import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import UseLoader from '../../components/loader/UseLoader';
import { IconButton, InputAdornment, TextField, Button, Typography, Box, Container } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LogoImg from '../../assets/img/fizzpan_logo.png';

export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [loader, showLoader, hideLoader] = UseLoader();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            showLoader();
            await signIn(formData.email, formData.password);
            
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome back!',
                confirmButtonColor: '#B8804A',
            });
            
            navigate('/user');
        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = 'Invalid email or password';
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Invalid email or password';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Please verify your email before logging in';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setErrors({ general: errorMessage });
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
                    Sign in to your account
                </Typography>
                
                {errors.general && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                        <Typography color="error" variant="body2">
                            {errors.general}
                        </Typography>
                    </Box>
                )}
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loader}
                    >
                        {loader ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}