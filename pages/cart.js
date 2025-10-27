import { getCart, updateCartQuantity, removeFromCart, clearCart } from '../utils/cart.js';
import { renderNavigation } from '../components/navigation.js';
import { navigate } from '../main.js';

export function renderCart() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-8';
  
  const cart = getCart();
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="container mx-auto px-4 text-center py-20">
        <svg class="w-24 h-24 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        <h2 class="text-2xl font-bold text-neutral-800 mb-2">Your Cart is Empty</h2>
        <p class="text-neutral-600 mb-6">Start adding products to build your order</p>
        <a href="#/catalog" class="btn-primary">Browse Catalog</a>
      </div>
    `;
    return container;
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;
  
  container.innerHTML = `
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-neutral-800 mb-8">Shopping Cart</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Cart Items -->
        <div class="lg:col-span-2 card p-0">
          <div class="divide-y divide-neutral-200">
            ${cart.map(item => `
              <div class="p-6 flex flex-col md:flex-row gap-6">
                <img src="${item.image_url}" alt="${item.name}" class="w-full md:w-24 h-48 md:h-24 object-cover rounded-lg"/>
                <div class="flex-1">
                  <h3 class="font-bold text-lg text-neutral-800 mb-1">${item.name}</h3>
                  <p class="text-sm text-neutral-500 mb-2">₹${Number(item.price).toFixed(2)} per piece</p>
                  
                  <div class="flex items-center gap-4 mt-3">
                    <div class="flex items-center gap-2">
                      <button onclick="updateQty(${item.id}, -${item.moq})" class="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded font-bold transition">-</button>
                      <span class="w-16 text-center font-medium">${item.quantity}</span>
                      <button onclick="updateQty(${item.id}, ${item.moq})" class="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded font-bold transition">+</button>
                    </div>
                    <button onclick="removeItem(${item.id})" class="text-red-500 hover:text-red-700 text-sm font-medium transition">Remove</button>
                  </div>
                </div>
                <div class="text-left md:text-right mt-4 md:mt-0">
                  <div class="text-xl font-bold text-neutral-900">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="card sticky top-24">
            <h3 class="font-bold text-lg mb-4">Order Summary</h3>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between"><span>Subtotal</span> <span class="font-medium">₹${subtotal.toFixed(2)}</span></div>
              <div class="flex justify-between"><span>GST (18%)</span> <span class="font-medium">₹${gst.toFixed(2)}</span></div>
              <div class="border-t border-neutral-200 pt-3 mt-3">
                <div class="flex justify-between items-baseline">
                  <span class="font-bold">Total</span>
                  <span class="text-2xl font-bold text-neutral-900">₹${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div class="flex flex-col gap-3">
              <button onclick="window.location.hash = '/checkout'" class="btn-primary w-full">Proceed to Checkout</button>
              <button class="btn-outline w-full">Request Quote</button>
            </div>
            
            <div class="mt-6 p-4 bg-green-50 rounded-lg text-sm text-green-800">
              Free shipping on orders above ₹50,000
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  window.updateQty = (productId, change) => {
    const item = cart.find(i => i.id === productId);
    const newQty = item.quantity + change;
    if (newQty >= item.moq) {
      updateCartQuantity(productId, newQty);
    }
  };
  
  window.removeItem = (productId) => {
    if (confirm('Remove this item from cart?')) {
      removeFromCart(productId);
    }
  };
  
  return container;
}
