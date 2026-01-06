import { supabase } from '../lib/supabase';

export const getCart = async (userId) => {
  const { data, error } = await supabase
    .from('carts')
    .select(`
      id,
      quantity,
      product:product_id (id, name, price, image, description)
    `)
    .eq('user_id', userId);
  if (error) throw error;
  return data;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  // Check if item already in cart
  const { data: existing } = await supabase
    .from('carts')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    // Update quantity if item exists
    const { data, error } = await supabase
      .from('carts')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    // Add new item to cart
    const { data, error } = await supabase
      .from('carts')
      .insert([{ user_id: userId, product_id: productId, quantity }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const updateCartItem = async (cartId, updates) => {
  const { data, error } = await supabase
    .from('carts')
    .update(updates)
    .eq('id', cartId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const removeFromCart = async (cartId) => {
  const { error } = await supabase
    .from('carts')
    .delete()
    .eq('id', cartId);
  if (error) throw error;
};

export const clearCart = async (userId) => {
  const { error } = await supabase
    .from('carts')
    .delete()
    .eq('user_id', userId);
  if (error) throw error;
};