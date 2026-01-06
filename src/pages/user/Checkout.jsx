import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { createOrder } from '../../services/orderService';
import { Container, Typography, Box, TextField, Button, RadioGroup, FormControlLabel, Radio, Paper, CircularProgress, Alert } from '@mui/material';

export default function Checkout() {
  const auth = useAuth();
  const { user } = auth || {};
  const { cart, cartTotal, clearCart } = useCart();
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!contactInfo) {
      setError('Please provide your contact information');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: cartTotal,
        contactMethod,
        contactInfo,
        notes
      };

      const order = await createOrder(orderData);
      await clearCart();
      
      setOrderDetails(order);
      setOrderPlaced(true);
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced && orderDetails) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your order has been placed successfully. Order ID: {orderDetails.id}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We'll contact you via {orderDetails.contact_method} at {orderDetails.contact_info} shortly.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/user')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      
      {/* Order Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        {cart.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body1">{item.product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.quantity} x Rp {item.product.price.toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="bold">
              Rp {(item.quantity * item.product.price).toLocaleString()}
            </Typography>
          </Box>
        ))}
        <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <span>Rp {cartTotal.toLocaleString()}</span>
          </Typography>
        </Box>
      </Paper>

      {/* Checkout Form */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Typography variant="body1" gutterBottom>
            How would you like to be contacted for payment?
          </Typography>
          <RadioGroup
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
            sx={{ mb: 3 }}
          >
            <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
            <FormControlLabel value="instagram" control={<Radio />} label="Instagram" />
          </RadioGroup>

          <TextField
            fullWidth
            label={contactMethod === 'whatsapp' ? 'WhatsApp Number' : 'Instagram Username'}
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder={contactMethod === 'whatsapp' ? 'e.g., +1234567890' : 'e.g., @username'}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Additional Notes (Optional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions or notes for your order..."
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || cart.length === 0}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
