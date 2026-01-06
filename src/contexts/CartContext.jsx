import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const auth = useAuth();
  const { user } = auth || {};
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const cartItems = await cartService.getCart(user.id);
      setCart(cartItems || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      // Handle guest cart in localStorage if needed
      return;
    }

    try {
      await cartService.addToCart(user.id, productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (cartId, updates) => {
    try {
      await cartService.updateCartItem(cartId, updates);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await cartService.removeFromCart(cartId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      await cartService.clearCart(user.id);
      await fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.product.price * item.quantity),
    0
  );

  const cartCount = cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartTotal,
        cartCount,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  return useContext(CartContext);
};