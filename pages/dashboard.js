import { getUserProfile } from '../utils/auth.js';
import { getOrdersForUser } from '../utils/api.js';
import { navigate } from '../main.js';

export async function renderDashboard() {
  const profile = await getUserProfile();
  
  if (!profile) {
    navigate('/login');
    return document.createElement('div');
  }

  const orders = await getOrdersForUser(profile.id);
  
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-8';
  
  container.innerHTML = `
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-800 mb-2">Retailer Dashboard</h1>
        <p class="text-neutral-600">Welcome back, ${profile.company_name || profile.full_name}</p>
      </div>
      
      ${!profile.approved ? `
        <div class="card bg-yellow-50 border-yellow-200 mb-8">
          <h2 class="font-bold text-yellow-800">Account Pending Approval</h2>
          <p class="text-yellow-700">Your account is currently under review. You will be notified once it's approved. In the meantime, you can browse the catalog with limited access.</p>
        </div>
      ` : `
        <div class="card bg-green-50 border-green-200 mb-8">
          <h2 class="font-bold text-green-800">Account Approved!</h2>
          <p class="text-green-700">You can now place orders and access all B2B features.</p>
        </div>
      `}
      
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        ${[
          { label: 'Total Orders', value: orders.length, icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
          { label: 'Pending Orders', value: orders.filter(o => o.status === 'Pending').length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Total Spent', value: `₹${orders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Credit Available', value: '₹0.00', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
        ].map(stat => `
          <div class="card">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm text-neutral-600">${stat.label}</div>
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${stat.icon}"/>
              </svg>
            </div>
            <div class="text-2xl font-bold text-neutral-800">${stat.value}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Orders -->
        <div class="lg:col-span-2">
          <div class="card p-0">
            <div class="flex justify-between items-center mb-6 p-6">
              <h2 class="text-2xl font-bold text-neutral-800">Recent Orders</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-neutral-50">
                  <tr>
                    <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Order ID</th>
                    <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Date</th>
                    <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Total</th>
                    <th class="text-left py-3 px-6 text-sm font-semibold text-neutral-700">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200">
                  ${orders.length > 0 ? orders.map(order => `
                    <tr class="hover:bg-neutral-50">
                      <td class="py-4 px-6 font-mono text-sm text-primary-600">#${order.id.toString().slice(-6)}</td>
                      <td class="py-4 px-6 text-sm">${new Date(order.created_at).toLocaleDateString()}</td>
                      <td class="py-4 px-6 text-sm font-medium">₹${order.total_amount.toFixed(2)}</td>
                      <td class="py-4 px-6"><span class="badge ${order.status === 'Pending' ? 'badge-warning' : 'badge-success'}">${order.status}</span></td>
                    </tr>
                  `).join('') : `
                    <tr><td colspan="4" class="text-center py-10 text-neutral-500">You have no recent orders.</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="lg:col-span-1">
          <div class="card mb-6">
            <h3 class="font-semibold text-lg mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <a href="#/catalog" class="block btn-primary text-center">Browse Catalog</a>
              <button class="block w-full btn-outline">Download Invoices</button>
              <button class="block w-full btn-outline">Request Catalog</button>
              <button class="block w-full btn-outline">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return container;
}
