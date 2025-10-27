import { supabase } from './supabase.js';

export async function getProducts(filters = {}) {
  let query = supabase.from('products').select('*');
  
  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

export async function getProductById(id) {
  if (!id || isNaN(parseInt(id))) {
    console.error('Invalid product ID');
    return null;
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
  return data;
}

export async function createProduct(productData) {
    const { data, error } = await supabase.from('products').insert([productData]).select();
    if (error) console.error('Error creating product:', error);
    return { data, error };
}

export async function updateProduct(id, productData) {
    const { data, error } = await supabase.from('products').update(productData).eq('id', id).select();
    if (error) console.error('Error updating product:', error);
    return { data, error };
}

export async function deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error('Error deleting product:', error);
    return { error };
}

export async function getPendingRegistrations() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching pending registrations:', error);
        return [];
    }
    return data;
}

export async function approveRegistration(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ approved: true, approved_at: new Date().toISOString() })
        .eq('id', userId)
        .select();
    
    if (error) {
        console.error('Error approving registration:', error);
    }
    return { data, error };
}

export async function rejectRegistration(userId) {
    const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
    
    if (profileError) {
        console.error('Error deleting profile:', profileError);
        return { error: profileError };
    }

    // Also delete the user from auth schema
    const { error: userError } = await supabase.auth.admin.deleteUser(userId);
    if (userError) {
        console.error('Error deleting auth user:', userError);
    }
    
    return { error: userError };
}

export async function createOrder(orderData) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.userId,
      total_amount: orderData.total,
      status: 'Pending',
      shipping_address: orderData.shippingAddress
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return { error: orderError };
  }

  const orderItems = orderData.cart.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // Here you might want to delete the order that was just created
    return { error: itemsError };
  }

  return { data: order };
}

export async function getOrdersForUser(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
  return data;
}

export async function getAllOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(company_name)')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching all orders:', error);
        return [];
    }
    return data;
}

export async function updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
    
    if (error) {
        console.error('Error updating order status:', error);
    }
    return { data, error };
}
