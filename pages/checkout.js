import { getCart, clearCart } from '../utils/cart.js';
import { getUserProfile } from '../utils/auth.js';
import { createOrder, getShippingAddresses, addShippingAddress } from '../utils/api.js';
import { navigate } from '../main.js';
import { showToast } from '../utils/toast.js';

export async function renderCheckout() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-12';

  const cart = getCart();
  const profile = await getUserProfile();

  if (cart.length === 0) {
    navigate('/catalog');
    return container;
  }
  
  const savedAddresses = await getShippingAddresses(profile.id);
  const defaultAddress = profile.default_shipping_address;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  container.innerHTML = `
    <div class="container mx-auto px-4 max-w-5xl">
      <h1 class="text-3xl font-bold text-neutral-800 mb-8">Checkout</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Shipping & Payment -->
        <div class="card">
          <form id="checkout-form">
            <fieldset class="mb-8">
              <legend class="font-bold text-lg mb-4 w-full border-b pb-2">Shipping Address</legend>
              
              ${savedAddresses.length > 0 ? `
                <div class="mb-6">
                  <label class="block text-sm font-medium text-neutral-700 mb-2">Select a saved address:</label>
                  <div id="saved-addresses-list" class="space-y-2">
                    ${savedAddresses.map(addr => `
                      <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer has-[:checked]:bg-primary-50 has-[:checked]:border-primary-400">
                        <input type="radio" name="saved_address" value="${addr.id}" class="text-primary-500 focus:ring-primary-400"/>
                        <span class="text-sm">
                          <span class="font-semibold">${addr.address_line_1}</span>
                          <p class="text-neutral-600">${addr.city}, ${addr.state} - ${addr.pincode}</p>
                        </span>
                      </label>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-1">Company Name</label>
                  <input type="text" value="${profile.company_name || ''}" disabled class="input-field bg-neutral-100 cursor-not-allowed"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-1">Shipping Address Line 1 *</label>
                  <input id="address1" type="text" required class="input-field" placeholder="Street, P.O. box, etc." value="${defaultAddress?.address_line_1 || ''}"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-1">City *</label>
                  <input id="city" type="text" required class="input-field" value="${defaultAddress?.city || ''}"/>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-1">State *</label>
                    <input id="state" type="text" required class="input-field" value="${defaultAddress?.state || ''}"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-1">Pincode *</label>
                    <input id="pincode" type="text" required class="input-field" value="${defaultAddress?.pincode || ''}"/>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <label class="flex items-center gap-2">
                  <input type="checkbox" id="save-address" class="rounded text-primary-500 focus:ring-primary-400"/>
                  <span class="text-sm font-medium text-neutral-600">Save this address for future orders</span>
                </label>
              </div>
            </fieldset>
            
            <fieldset>
              <legend class="font-bold text-lg mb-4 w-full border-b pb-2">Payment Method</legend>
              <div class="space-y-3">
                <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer has-[:checked]:bg-primary-50 has-[:checked]:border-primary-400">
                  <input type="radio" name="payment" checked class="text-primary-500 focus:ring-primary-400"/>
                  <span>
                    <span class="font-semibold">Bank Transfer / NEFT</span>
                    <p class="text-xs text-neutral-600">Place order now, pay later via bank transfer.</p>
                  </span>
                </label>
                <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer has-[:checked]:bg-primary-50 has-[:checked]:border-primary-400">
                  <input type="radio" name="payment" class="text-primary-500 focus:ring-primary-400"/>
                  <span>
                    <span class="font-semibold">Credit Terms (NET 30/60)</span>
                    <p class="text-xs text-neutral-600">Available for verified partners. Subject to approval.</p>
                  </span>
                </label>
              </div>
            </fieldset>
          </form>
        </div>
        
        <!-- Order Summary -->
        <div class="card sticky top-24">
          <h2 class="font-bold text-lg mb-4 w-full border-b pb-2">Order Summary</h2>
          <div class="space-y-3 mb-6 divide-y">
            ${cart.map(item => `
              <div class="pt-3 flex justify-between items-center">
                <div>
                  <p class="font-semibold">${item.name}</p>
                  <p class="text-sm text-neutral-600">${item.quantity} x ₹${item.price.toFixed(2)}</p>
                </div>
                <p class="font-medium">₹${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="space-y-3 border-t pt-4">
            <div class="flex justify-between"><span>Subtotal</span> <span class="font-medium">₹${subtotal.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>GST (18%)</span> <span class="font-medium">₹${gst.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Shipping</span> <span class="font-medium">FREE</span></div>
            <div class="border-t border-neutral-200 pt-3 mt-3">
              <div class="flex justify-between items-baseline">
                <span class="font-bold">Total</span>
                <span class="text-2xl font-bold text-neutral-900">₹${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button type="submit" form="checkout-form" id="place-order-btn" class="btn-primary w-full !mt-8">Place Order</button>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector('#checkout-form');
    const submitBtn = container.querySelector('#place-order-btn');
    
    const savedAddressesList = container.querySelector('#saved-addresses-list');
    if (savedAddressesList) {
      savedAddressesList.addEventListener('change', (e) => {
        if (e.target.name === 'saved_address') {
          const selectedAddressId = parseInt(e.target.value);
          const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
          if (selectedAddress) {
            form.querySelector('#address1').value = selectedAddress.address_line_1 || '';
            form.querySelector('#city').value = selectedAddress.city || '';
            form.querySelector('#state').value = selectedAddress.state || '';
            form.querySelector('#pincode').value = selectedAddress.pincode || '';
          }
        }
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Placing Order...';

      const shippingAddress = {
        address_line_1: form.querySelector('#address1').value,
        city: form.querySelector('#city').value,
        state: form.querySelector('#state').value,
        pincode: form.querySelector('#pincode').value,
      };

      const saveAddressCheckbox = form.querySelector('#save-address');
      if (saveAddressCheckbox.checked) {
        await addShippingAddress({
          user_id: profile.id,
          ...shippingAddress
        });
        showToast('Shipping address saved!', { type: 'success' });
      }

      const orderData = {
        userId: profile.id,
        cart,
        total,
        shippingAddress
      };

      const { data: order, error } = await createOrder(orderData);

      if (error) {
        showToast('There was an error placing your order. Please try again.', { type: 'error' });
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order';
      } else {
        clearCart();
        navigate(`/order-confirmation?orderId=${order.id}`);
      }
    });
  }, 0);

  return container;
}
