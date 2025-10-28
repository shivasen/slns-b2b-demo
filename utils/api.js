import { db } from './mock-db.js';
import { getUser, isUserAdmin } from './auth.js';

const delay = (ms = 100) => new Promise(res => setTimeout(res, ms));

export async function getProducts(filters = {}) {
  await delay();
  let results = [...db.products];
  const { category, limit, search } = filters;
  
  if (category && category !== 'All') {
    results = results.filter(p => p.category === category);
  }

  if (search) {
    const lowercasedSearch = search.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(lowercasedSearch) ||
      p.category.toLowerCase().includes(lowercasedSearch)
    );
  }

  if (limit) {
    results = results.slice(0, limit);
  }
  
  return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function getProductById(id) {
  await delay();
  if (!id || isNaN(parseInt(id))) {
    console.error('Invalid product ID');
    return null;
  }
  const product = db.products.find(p => p.id === id);
  return product || null;
}

export async function createProduct(productData) {
    await delay(300);
    const newId = Math.max(...db.products.map(p => p.id)) + 1;
    const newProduct = {
      id: newId,
      created_at: new Date().toISOString(),
      ...productData
    };
    db.products.unshift(newProduct);
    return { data: [newProduct], error: null };
}

export async function updateProduct(id, productData) {
    await delay(300);
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return { data: null, error: { message: 'Product not found' } };
    db.products[index] = { ...db.products[index], ...productData };
    return { data: [db.products[index]], error: null };
}

export async function deleteProduct(id) {
    await delay(300);
    const index = db.products.findIndex(p => p.id === id);
    if (index > -1) {
      db.products.splice(index, 1);
    }
    return { error: null };
}

export async function getPendingRegistrations() {
    await delay();
    return db.users
      .filter(u => !u.approved)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

export async function approveRegistration(userId) {
    await delay(200);
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.approved = true;
      user.approved_at = new Date().toISOString();
    }
    return { data: [user], error: null };
}

export async function rejectRegistration(userId) {
    await delay(200);
    const index = db.users.findIndex(u => u.id === userId);
    if (index > -1) {
      db.users.splice(index, 1);
    }
    // No need to delete from auth in mock
    return { error: null };
}

export async function createOrder(orderData) {
  await delay(500);
  const newOrderId = Math.max(...db.orders.map(o => o.id), 0) + 1;
  const userProfile = db.users.find(u => u.id === orderData.userId);

  const orderItems = orderData.cart.map(item => ({
    order_id: newOrderId,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
    products: db.products.find(p => p.id === item.id) // simulate join
  }));

  const newOrder = {
    id: newOrderId,
    user_id: orderData.userId,
    total_amount: orderData.total,
    status: 'Pending',
    shipping_address: orderData.shippingAddress,
    created_at: new Date().toISOString(),
    profiles: userProfile, // simulate join
    order_items: orderItems,
  };

  db.orders.unshift(newOrder);
  return { data: newOrder, error: null };
}

export async function getOrdersForUser(userId) {
  await delay();
  return db.orders
    .filter(o => o.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function getAllOrders() {
    await delay();
    return db.orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function getOrderDetails(orderId) {
  await delay();
  const user = await getUser();
  const isAdmin = await isUserAdmin();

  const order = db.orders.find(o => o.id === orderId);

  if (!order) return { data: null, error: { message: 'Order not found' } };

  // Non-admins can only see their own orders
  if (!isAdmin && order.user_id !== user.id) {
    return { data: null, error: { message: 'Access denied' } };
  }

  return { data: order, error: null };
}

export async function updateOrderStatus(orderId, status) {
    await delay(150);
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
    return { data: [order], error: null };
}

export async function getShippingAddresses(userId) {
  await delay();
  return db.shipping_addresses
    .filter(a => a.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function addShippingAddress(addressData) {
  await delay(200);
  const newId = Math.max(...db.shipping_addresses.map(a => a.id), 0) + 1;
  const newAddress = {
    id: newId,
    created_at: new Date().toISOString(),
    ...addressData
  };
  db.shipping_addresses.unshift(newAddress);
  return { data: newAddress, error: null };
}

export async function deleteShippingAddress(addressId) {
  await delay(200);
  const index = db.shipping_addresses.findIndex(a => a.id === addressId);
  if (index > -1) {
    db.shipping_addresses.splice(index, 1);
  }
  return { error: null };
}

export async function setDefaultShippingAddress(userId, addressId) {
  await delay(150);
  const user = db.users.find(u => u.id === userId);
  if (user) {
    const address = db.shipping_addresses.find(a => a.id === addressId);
    user.default_shipping_address = address; // Store full object
  }
  return { error: null };
}
