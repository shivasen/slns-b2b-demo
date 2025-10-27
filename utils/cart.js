const CART_KEY = 'slns_cart';

export function initializeCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-change'));
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  
  if (item) {
    item.quantity = quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-change'));
  }
}

export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-change'));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-change'));
}

export function getCartCount() {
  return getCart().length;
}

export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
