import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/orderService';

export default function Checkout() {
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
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
          <p className="mt-2 text-gray-600">
            Your order has been placed successfully. Order ID: {orderDetails.id}
          </p>
          <p className="mt-4 text-gray-600">
            We'll contact you via {orderDetails.contact_method} at {orderDetails.contact_info} shortly.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Order Summary</h3>
        <div className="border rounded-md divide-y">
          {cart.map((item) => (
            <div key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.quantity} x ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="font-medium">
                ${(item.quantity * item.product.price).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="p-4 flex justify-between font-bold border-t-2">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How would you like to be contacted for payment?
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="whatsapp"
                name="contactMethod"
                type="radio"
                checked={contactMethod === 'whatsapp'}
                onChange={() => setContactMethod('whatsapp')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="whatsapp" className="ml-2 block text-sm text-gray-700">
                WhatsApp
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="instagram"
                name="contactMethod"
                type="radio"
                checked={contactMethod === 'instagram'}
                onChange={() => setContactMethod('instagram')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="instagram" className="ml-2 block text-sm text-gray-700">
                Instagram
              </label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
            {contactMethod === 'whatsapp' ? 'WhatsApp Number' : 'Instagram Username'}
          </label>
          <input
            type="text"
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={contactMethod === 'whatsapp' ? 'e.g., +1234567890' : 'e.g., @username'}
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Any special instructions or notes for your order..."
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading || cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}