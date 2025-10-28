import { getPendingRegistrations, approveRegistration, rejectRegistration, getAllOrders, updateOrderStatus, getProducts, deleteProduct } from '../utils/api.js';
import { navigate } from '../main.js';
import { showToast } from '../utils/toast.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let currentView = sessionStorage.getItem('admin_view') || 'analytics';
sessionStorage.removeItem('admin_view'); // Clear it after reading

async function renderAnalytics(container) {
  const contentEl = container.querySelector('#admin-content');
  contentEl.innerHTML = `<div class="text-center py-20"><div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mx-auto"></div><p class="mt-4 text-neutral-600">Loading Analytics...</p></div>`;

  const [orders, products] = await Promise.all([getAllOrders(), getProducts()]);

  // --- Data Processing ---
  
  // 1. Sales over time (last 30 days)
  const salesData = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    salesData[d.toISOString().split('T')[0]] = 0;
  }
  orders.forEach(order => {
    if (order.status !== 'Cancelled') {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      if (salesData[orderDate] !== undefined) {
        salesData[orderDate] += order.total_amount;
      }
    }
  });

  // 2. Order status distribution
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // 3. Sales by category
  const categorySales = products.reduce((acc, product) => {
    acc[product.category] = 0;
    return acc;
  }, {});
  orders.forEach(order => {
    if (order.status !== 'Cancelled') {
      order.order_items.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        if (product && categorySales[product.category] !== undefined) {
          categorySales[product.category] += item.price * item.quantity;
        }
      });
    }
  });


  contentEl.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card col-span-1 lg:col-span-2">
        <h3 class="font-bold text-lg mb-4">Sales Over Last 30 Days</h3>
        <canvas id="sales-chart"></canvas>
      </div>
      <div class="card">
        <h3 class="font-bold text-lg mb-4">Order Status</h3>
        <canvas id="status-chart"></canvas>
      </div>
      <div class="card">
        <h3 class="font-bold text-lg mb-4">Revenue by Category</h3>
        <canvas id="category-chart"></canvas>
      </div>
    </div>
  `;

  // --- Chart Rendering ---
  new Chart(document.getElementById('sales-chart'), {
    type: 'line',
    data: {
      labels: Object.keys(salesData),
      datasets: [{
        label: 'Sales (₹)',
        data: Object.values(salesData),
        borderColor: '#f59e0b',
        backgroundColor: '#fef3c7',
        tension: 0.1,
        fill: true,
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  new Chart(document.getElementById('status-chart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Orders',
        data: Object.values(statusCounts),
        backgroundColor: ['#fbbf24', '#3b82f6', '#16a34a', '#ef4444', '#6b7280'],
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

   new Chart(document.getElementById('category-chart'), {
    type: 'bar',
    data: {
      labels: Object.keys(categorySales),
      datasets: [{
        label: 'Total Sales (₹)',
        data: Object.values(categorySales),
        backgroundColor: '#d97706',
      }]
    },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
  });
}

async function renderRegistrations(container) {
  const registrations = await getPendingRegistrations();
  const contentEl = container.querySelector('#admin-content');
  
  contentEl.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-neutral-200">
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Company Name</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Business Type</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">GSTIN</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Date</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Actions</th>
          </tr>
        </thead>
        <tbody id="registrations-body" class="divide-y divide-neutral-200">
          ${registrations.length === 0 ? '<tr><td colspan="5" class="text-center py-10 text-neutral-500">No pending registrations.</td></tr>' : 
            registrations.map(req => `
            <tr class="hover:bg-neutral-50" id="row-${req.id}">
              <td class="py-4 px-2 text-sm font-medium text-neutral-800">${req.company_name}</td>
              <td class="py-4 px-2 text-sm text-neutral-600">${req.business_type}</td>
              <td class="py-4 px-2 text-sm font-mono text-neutral-600">${req.gstin}</td>
              <td class="py-4 px-2 text-sm text-neutral-600">${new Date(req.created_at).toLocaleDateString()}</td>
              <td class="py-4 px-2">
                <div class="flex gap-2">
                  <button onclick="handleApprove('${req.id}')" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded">Approve</button>
                  <button onclick="handleReject('${req.id}')" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Reject</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function renderOrders(container) {
  const orders = await getAllOrders();
  const contentEl = container.querySelector('#admin-content');

  contentEl.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-neutral-200">
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Order ID</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Company</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Date</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Total</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Status</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          ${orders.length === 0 ? '<tr><td colspan="6" class="text-center py-10 text-neutral-500">No orders found.</td></tr>' :
            orders.map(order => `
            <tr class="hover:bg-neutral-50" id="order-row-${order.id}">
              <td class="py-4 px-2 font-mono text-sm text-primary-600">#${order.id.toString().slice(-6)}</td>
              <td class="py-4 px-2 text-sm font-medium text-neutral-800">${order.profiles.company_name}</td>
              <td class="py-4 px-2 text-sm">${new Date(order.created_at).toLocaleDateString()}</td>
              <td class="py-4 px-2 text-sm font-medium">₹${order.total_amount.toFixed(2)}</td>
              <td class="py-4 px-2">
                <select id="status-${order.id}" class="input-field !py-1 !text-xs" onchange="handleStatusChange(${order.id}, this.value)">
                  <option ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                  <option ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                  <option ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  <option ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </td>
              <td class="py-4 px-2"><button onclick="window.location.hash='#/order?id=${order.id}'" class="text-primary-600 hover:underline text-sm">Details</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function renderProducts(container) {
  const products = await getProducts();
  const contentEl = container.querySelector('#admin-content');

  contentEl.innerHTML = `
    <div class="flex justify-end mb-4">
      <a href="#/admin/product/new" class="btn-primary">Create New Product</a>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-neutral-200">
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Product</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Category</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Price</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Stock</th>
            <th class="text-left py-3 px-2 text-sm font-semibold text-neutral-700">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          ${products.length === 0 ? '<tr><td colspan="5" class="text-center py-10 text-neutral-500">No products found.</td></tr>' :
            products.map(product => `
            <tr class="hover:bg-neutral-50" id="product-row-${product.id}">
              <td class="py-4 px-2">
                <div class="flex items-center gap-3">
                  <img src="${product.image_url}" alt="${product.name}" class="w-12 h-12 object-cover rounded-md"/>
                  <span class="font-medium text-neutral-800">${product.name}</span>
                </div>
              </td>
              <td class="py-4 px-2 text-sm">${product.category}</td>
              <td class="py-4 px-2 text-sm font-medium">₹${product.price.toFixed(2)}</td>
              <td class="py-4 px-2 text-sm">${product.stock}</td>
              <td class="py-4 px-2">
                <div class="flex gap-2">
                  <button onclick="window.location.hash='#/admin/product/edit?id=${product.id}'" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded">Edit</button>
                  <button onclick="handleDeleteProduct(${product.id})" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded">Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export async function renderAdmin() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-8';
  
  container.innerHTML = `
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-neutral-800 mb-8">Admin Panel</h1>
      
      <div class="card mb-8">
        <div class="border-b border-neutral-200 mb-6">
          <div id="admin-tabs" class="flex gap-6">
            <button data-view="analytics" class="pb-3 text-neutral-600 hover:text-primary-600">Analytics</button>
            <button data-view="registrations" class="pb-3 text-neutral-600 hover:text-primary-600">Pending Registrations</button>
            <button data-view="orders" class="pb-3 text-neutral-600 hover:text-primary-600">Orders</button>
            <button data-view="products" class="pb-3 text-neutral-600 hover:text-primary-600">Products</button>
          </div>
        </div>
        
        <div id="admin-content">
          <div class="text-center py-10"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div></div>
        </div>
      </div>
    </div>
  `;

  const renderCurrentView = () => {
    const contentEl = container.querySelector('#admin-content');
    contentEl.innerHTML = `<div class="text-center py-10"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div></div>`;
    
    if (currentView === 'analytics') {
      renderAnalytics(container);
    } else if (currentView === 'registrations') {
      renderRegistrations(container);
    } else if (currentView === 'orders') {
      renderOrders(container);
    } else if (currentView === 'products') {
      renderProducts(container);
    } else {
      contentEl.innerHTML = '<div class="text-center py-10 text-neutral-500">This feature is not yet implemented.</div>';
    }
  };
  
  setTimeout(() => {
    const tabs = container.querySelector('#admin-tabs');
    
    // Set initial active tab
    const initialTab = tabs.querySelector(`[data-view="${currentView}"]`);
    if (initialTab) {
      initialTab.classList.add('border-b-2', 'border-primary-600', 'text-primary-600', 'font-semibold');
    }

    tabs.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        currentView = e.target.dataset.view;
        
        // Update tab styles
        tabs.querySelectorAll('button').forEach(btn => {
          btn.className = 'pb-3 text-neutral-600 hover:text-primary-600';
          btn.classList.remove('border-b-2', 'border-primary-600', 'text-primary-600', 'font-semibold');
        });
        e.target.classList.add('border-b-2', 'border-primary-600', 'text-primary-600', 'font-semibold');

        renderCurrentView();
      }
    });

    renderCurrentView();
  }, 0);
  
  window.handleApprove = async (userId) => {
    if (confirm('Are you sure you want to approve this registration?')) {
      await approveRegistration(userId);
      document.getElementById(`row-${userId}`)?.remove();
    }
  };

  window.handleReject = async (userId) => {
    if (confirm('Are you sure you want to reject and delete this registration?')) {
      await rejectRegistration(userId);
      document.getElementById(`row-${userId}`)?.remove();
    }
  };

  window.handleStatusChange = async (orderId, newStatus) => {
    const { error } = await updateOrderStatus(orderId, newStatus);
    if (error) {
      showToast(`Error updating order status: ${error.message}`, { type: 'error' });
    } else {
      showToast(`Order #${orderId.toString().slice(-6)} status updated to ${newStatus}`, { type: 'success' });
    }
  };

  window.handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
      const { error } = await deleteProduct(productId);
      if (error) {
        showToast('Error deleting product: ' + error.message, { type: 'error' });
      } else {
        showToast('Product deleted successfully.', { type: 'success' });
        document.getElementById(`product-row-${productId}`)?.remove();
      }
    }
  };

  return container;
}
