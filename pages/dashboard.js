import { getUserProfile, invalidateProfileCache } from '../utils/auth.js';
import { getOrdersForUser, getShippingAddresses, addShippingAddress, deleteShippingAddress, setDefaultShippingAddress } from '../utils/api.js';
import { navigate } from '../main.js';
import { showToast } from '../utils/toast.js';

let currentView = 'overview';

function renderOverview(container, profile, orders) {
    const contentEl = container.querySelector('#dashboard-content');
    contentEl.innerHTML = `
        ${!profile.approved ? `
            <div class="card bg-yellow-50 border-yellow-200">
              <h2 class="font-bold text-yellow-800">Account Pending Approval</h2>
              <p class="text-yellow-700">Your account is currently under review. You will be notified once it's approved. In the meantime, you can browse the catalog with limited access.</p>
            </div>
        ` : `
            <div class="card bg-green-50 border-green-200">
              <h2 class="font-bold text-green-800">Account Approved!</h2>
              <p class="text-green-700">You can now place orders and access all B2B features.</p>
            </div>
        `}
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${[
                { label: 'Total Orders', value: orders.length },
                { label: 'Pending Orders', value: orders.filter(o => o.status === 'Pending').length },
                { label: 'Total Spent', value: `₹${orders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}` },
                { label: 'Credit Available', value: '₹0.00' }
            ].map(stat => `
                <div class="card">
                    <div class="text-sm text-neutral-600 mb-1">${stat.label}</div>
                    <div class="text-2xl font-bold text-neutral-800">${stat.value}</div>
                </div>
            `).join('')}
        </div>

        <div class="card p-0">
            <h2 class="text-xl font-bold text-neutral-800 p-6">Recent Orders</h2>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-neutral-50">
                        <tr>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Order ID</th>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Date</th>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Total</th>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Status</th>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-200">
                        ${orders.slice(0, 5).map(order => `
                            <tr class="hover:bg-neutral-50">
                                <td class="py-4 px-6 font-mono text-sm text-primary-600">#${order.id.toString().slice(-6)}</td>
                                <td class="py-4 px-6 text-sm">${new Date(order.created_at).toLocaleDateString()}</td>
                                <td class="py-4 px-6 text-sm font-medium">₹${order.total_amount.toFixed(2)}</td>
                                <td class="py-4 px-6"><span class="badge ${order.status === 'Pending' ? 'badge-warning' : 'badge-success'}">${order.status}</span></td>
                                <td class="py-4 px-6"><a href="#/order?id=${order.id}" class="text-primary-600 hover:underline text-sm">View</a></td>
                            </tr>
                        `).join('')}
                        ${orders.length === 0 ? `<tr><td colspan="5" class="text-center py-10 text-neutral-500">You have no recent orders.</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderOrders(container, orders) {
    const contentEl = container.querySelector('#dashboard-content');
    contentEl.innerHTML = `
        <div class="card p-0">
            <h2 class="text-xl font-bold text-neutral-800 p-6">All Orders</h2>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-neutral-50">
                        <tr>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Order ID</th>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Date</th>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Total</th>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Status</th>
                            <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-200">
                        ${orders.map(order => `
                            <tr class="hover:bg-neutral-50">
                                <td class="py-4 px-6 font-mono text-sm text-primary-600">#${order.id.toString().slice(-6)}</td>
                                <td class="py-4 px-6 text-sm">${new Date(order.created_at).toLocaleDateString()}</td>
                                <td class="py-4 px-6 text-sm font-medium">₹${order.total_amount.toFixed(2)}</td>
                                <td class="py-4 px-6"><span class="badge ${order.status === 'Pending' ? 'badge-warning' : 'badge-success'}">${order.status}</span></td>
                                <td class="py-4 px-6"><a href="#/order?id=${order.id}" class="text-primary-600 hover:underline text-sm">View Details</a></td>
                            </tr>
                        `).join('')}
                        ${orders.length === 0 ? `<tr><td colspan="5" class="text-center py-10 text-neutral-500">You have no orders.</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderProfile(container, profile, addresses) {
    const contentEl = container.querySelector('#dashboard-content');
    contentEl.innerHTML = `
        <div class="card">
            <h2 class="text-xl font-bold text-neutral-800 mb-4">Profile Information</h2>
            <div class="space-y-3 text-sm">
                <div class="flex justify-between border-b pb-2"><span>Company Name:</span> <span class="font-medium text-neutral-800">${profile.company_name}</span></div>
                <div class="flex justify-between border-b pb-2"><span>Contact Name:</span> <span class="font-medium text-neutral-800">${profile.full_name}</span></div>
                <div class="flex justify-between"><span>Email:</span> <span class="font-medium text-neutral-800">${profile.email}</span></div>
            </div>
        </div>

        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-neutral-800">Saved Shipping Addresses</h2>
                <button id="add-address-btn" class="btn-secondary !py-2 !px-4 text-sm">Add New</button>
            </div>

            <div id="add-address-form-container" class="hidden mb-6 p-4 bg-neutral-50 rounded-lg">
                <form id="add-address-form" class="space-y-4">
                    <h3 class="font-semibold">Add a New Address</h3>
                    <div>
                        <label class="block text-sm font-medium text-neutral-700 mb-1">Address Line 1 *</label>
                        <input id="address1" type="text" required class="input-field" placeholder="Street, P.O. box, etc."/>
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <div><label class="block text-sm font-medium text-neutral-700 mb-1">City *</label><input id="city" type="text" required class="input-field"/></div>
                        <div><label class="block text-sm font-medium text-neutral-700 mb-1">State *</label><input id="state" type="text" required class="input-field"/></div>
                        <div><label class="block text-sm font-medium text-neutral-700 mb-1">Pincode *</label><input id="pincode" type="text" required class="input-field"/></div>
                    </div>
                    <div class="flex gap-2 justify-end">
                        <button type="button" id="cancel-add-address" class="btn-outline !py-2 !px-4 text-sm">Cancel</button>
                        <button type="submit" class="btn-primary !py-2 !px-4 text-sm">Save Address</button>
                    </div>
                </form>
            </div>

            <div id="address-list" class="space-y-4">
                ${addresses.map(addr => `
                    <div class="border rounded-lg p-4 flex justify-between items-start ${addr.id === profile.default_shipping_address?.id ? 'bg-primary-50 border-primary-300' : ''}">
                        <div>
                            <p class="font-semibold">${addr.address_line_1}</p>
                            <p class="text-sm text-neutral-600">${addr.city}, ${addr.state} - ${addr.pincode}</p>
                            ${addr.id === profile.default_shipping_address?.id ? '<span class="badge-success mt-2">Default</span>' : ''}
                        </div>
                        <div class="flex gap-2 items-center flex-shrink-0 ml-4">
                            ${addr.id !== profile.default_shipping_address?.id ? `<button onclick="handleSetDefault(${addr.id})" class="text-sm text-primary-600 hover:underline">Set as Default</button>` : ''}
                            <button onclick="handleDeleteAddress(${addr.id})" class="text-sm text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                `).join('')}
                ${addresses.length === 0 ? '<p class="text-center text-neutral-500 py-4">No saved addresses.</p>' : ''}
            </div>
        </div>
    `;

    const addAddressBtn = contentEl.querySelector('#add-address-btn');
    const addAddressFormContainer = contentEl.querySelector('#add-address-form-container');
    const cancelAddAddressBtn = contentEl.querySelector('#cancel-add-address');
    const addAddressForm = contentEl.querySelector('#add-address-form');

    addAddressBtn.addEventListener('click', () => addAddressFormContainer.classList.remove('hidden'));
    cancelAddAddressBtn.addEventListener('click', () => addAddressFormContainer.classList.add('hidden'));

    addAddressForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const addressData = {
            user_id: profile.id,
            address_line_1: addAddressForm.querySelector('#address1').value,
            city: addAddressForm.querySelector('#city').value,
            state: addAddressForm.querySelector('#state').value,
            pincode: addAddressForm.querySelector('#pincode').value,
        };
        const { error } = await addShippingAddress(addressData);
        if (error) {
            showToast('Error saving address: ' + error.message, { type: 'error' });
        } else {
            showToast('Address saved successfully!', { type: 'success' });
            navigate('/dashboard?view=profile');
        }
    });
}

export async function renderDashboard() {
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  currentView = params.get('view') || 'overview';

  const profile = await getUserProfile();
  
  if (!profile) {
    navigate('/login');
    return document.createElement('div');
  }

  const [orders, addresses] = await Promise.all([
    getOrdersForUser(profile.id),
    getShippingAddresses(profile.id)
  ]);
  
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-8';
  
  container.innerHTML = `
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-800 mb-2">Retailer Dashboard</h1>
        <p class="text-neutral-600">Welcome back, ${profile.company_name || profile.full_name}</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside class="lg:col-span-1">
          <div class="card p-4 sticky top-24">
            <nav id="dashboard-tabs" class="space-y-1">
              <button data-view="overview" class="w-full flex items-center gap-3 p-3 rounded-lg text-left font-medium"><span>Overview</span></button>
              <button data-view="orders" class="w-full flex items-center gap-3 p-3 rounded-lg text-left font-medium"><span>My Orders</span></button>
              <button data-view="profile" class="w-full flex items-center gap-3 p-3 rounded-lg text-left font-medium"><span>Profile & Addresses</span></button>
            </nav>
          </div>
        </aside>
        <main id="dashboard-content" class="lg:col-span-3 space-y-8">
          <!-- Content is rendered here by JS -->
        </main>
      </div>
    </div>
  `;

  const renderCurrentView = () => {
    const contentEl = container.querySelector('#dashboard-content');
    contentEl.innerHTML = `<div class="card text-center py-20"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div></div>`;
    
    container.querySelectorAll('#dashboard-tabs button').forEach(btn => {
      btn.className = `w-full flex items-center gap-3 p-3 rounded-lg text-left font-medium ${
        btn.dataset.view === currentView 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-neutral-600 hover:bg-neutral-100'
      }`;
    });

    if (currentView === 'overview') {
      renderOverview(container, profile, orders);
    } else if (currentView === 'orders') {
      renderOrders(container, orders);
    } else if (currentView === 'profile') {
      renderProfile(container, profile, addresses);
    }
  };
  
  setTimeout(() => {
    const tabs = container.querySelector('#dashboard-tabs');
    tabs.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (button && button.dataset.view) {
        currentView = button.dataset.view;
        window.history.replaceState(null, '', `#/dashboard?view=${currentView}`);
        renderCurrentView();
      }
    });
    renderCurrentView();
  }, 0);
  
  window.handleDeleteAddress = async (addressId) => {
    if (confirm('Are you sure you want to delete this address?')) {
        const { error } = await deleteShippingAddress(addressId);
        if (error) {
            showToast('Error deleting address: ' + error.message, { type: 'error' });
        } else {
            showToast('Address deleted.', { type: 'success' });
            invalidateProfileCache();
            navigate('/dashboard?view=profile');
        }
    }
  };

  window.handleSetDefault = async (addressId) => {
    const { error } = await setDefaultShippingAddress(profile.id, addressId);
    if (error) {
        showToast('Error setting default address: ' + error.message, { type: 'error' });
    } else {
        showToast('Default address updated!', { type: 'success' });
        invalidateProfileCache();
        navigate('/dashboard?view=profile');
    }
  };

  return container;
}
