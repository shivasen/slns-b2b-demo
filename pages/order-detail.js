import { getOrderDetails } from '../utils/api.js';
import { generateInvoice } from '../utils/invoice.js';

function renderNotFound() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white flex items-center justify-center';
  container.innerHTML = `
    <div class="text-center card max-w-lg mx-auto">
      <h1 class="text-4xl font-bold text-neutral-800 mb-4">Order Not Found</h1>
      <p class="text-neutral-600 mb-6">We couldn't find the order you're looking for. It may have been moved or you may not have permission to view it.</p>
      <a href="#/dashboard" class="btn-primary">Go to Dashboard</a>
    </div>
  `;
  return container;
}

export async function renderOrderDetail() {
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const orderId = parseInt(params.get('id'));

  if (!orderId) return renderNotFound();

  const { data: order, error } = await getOrderDetails(orderId);

  if (error || !order) {
    console.error('Error fetching order details:', error);
    return renderNotFound();
  }

  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-12';

  const subtotal = order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18;

  const statusColors = {
    'Pending': 'badge-warning',
    'Processing': 'badge-info',
    'Shipped': 'badge-info',
    'Delivered': 'badge-success',
    'Cancelled': 'badge-danger'
  };

  container.innerHTML = `
    <div class="container mx-auto px-4 max-w-5xl">
      <div class="mb-6 flex justify-between items-center">
        <a href="#/dashboard?view=orders" class="text-primary-600 hover:underline text-sm">&larr; Back to My Orders</a>
        <button id="download-invoice-btn" class="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download Invoice
        </button>
      </div>
      
      <div class="card mb-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
          <div>
            <h1 class="text-2xl font-bold text-neutral-800">Order Details</h1>
            <p class="font-mono text-sm text-neutral-500">ID: #${order.id.toString().slice(-6)}</p>
          </div>
          <div class="text-sm mt-4 md:mt-0">
            <p class="mb-1"><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span class="badge ${statusColors[order.status] || 'badge-info'}">${order.status}</span></p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="font-semibold text-neutral-800 mb-2">Shipping Address</h3>
            <div class="text-sm text-neutral-600">
              <p>${order.profiles.company_name}</p>
              <p>${order.shipping_address.address_line_1}</p>
              <p>${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}</p>
            </div>
          </div>
          <div>
            <h3 class="font-semibold text-neutral-800 mb-2">Payment Information</h3>
            <div class="text-sm text-neutral-600">
              <p><strong>Method:</strong> Bank Transfer / NEFT</p>
              <p><strong>Total Amount:</strong> <span class="font-bold text-lg text-neutral-900">₹${order.total_amount.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-0">
        <h2 class="text-xl font-bold text-neutral-800 p-6">Items Ordered (${order.order_items.length})</h2>
        <div class="divide-y divide-neutral-200">
          ${order.order_items.map(item => `
            <div class="p-6 flex flex-col md:flex-row gap-6">
              <img src="${item.products.image_url}" alt="${item.products.name}" class="w-full md:w-24 h-48 md:h-24 object-cover rounded-lg"/>
              <div class="flex-1">
                <a href="#/product?id=${item.product_id}" class="font-bold text-lg text-neutral-800 hover:text-primary-600 mb-1">${item.products.name}</a>
                <p class="text-sm text-neutral-500 mb-2">SKU: SLNS-${item.product_id.toString().padStart(6, '0')}</p>
                <p class="text-sm text-neutral-600">${item.quantity} units &times; ₹${item.price.toFixed(2)}</p>
              </div>
              <div class="text-left md:text-right mt-4 md:mt-0">
                <div class="text-xl font-bold text-neutral-900">₹${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="bg-neutral-50 p-6 rounded-b-xl">
          <div class="max-w-sm ml-auto space-y-3">
            <div class="flex justify-between"><span>Subtotal</span> <span class="font-medium">₹${subtotal.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>GST (18%)</span> <span class="font-medium">₹${gst.toFixed(2)}</span></div>
            <div class="border-t border-neutral-200 pt-3 mt-3">
              <div class="flex justify-between items-baseline">
                <span class="font-bold">Grand Total</span>
                <span class="text-2xl font-bold text-neutral-900">₹${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const downloadBtn = container.querySelector('#download-invoice-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        generateInvoice(order);
      });
    }
  }, 0);

  return container;
}
