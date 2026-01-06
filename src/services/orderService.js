import { supabase } from '../lib/supabase';

export const createOrder = async (orderData) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: orderData.userId,
      status: 'pending',
      total_amount: orderData.total,
      contact_method: orderData.contactMethod,
      contact_info: orderData.contactInfo,
      notes: orderData.notes
    }])
    .select()
    .single();
  
  if (orderError) throw orderError;

  // Add order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};

export const getOrders = async (userId, role = 'user') => {
  let query = supabase
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      created_at,
      contact_method,
      contact_info,
      notes,
      items:order_items(
        id,
        quantity,
        price,
        product:product_id(id, name, image)
      )
    `)
    .order('created_at', { ascending: false });

  if (role === 'user') {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
};