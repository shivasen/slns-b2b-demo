export function renderOrderConfirmation() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white flex items-center justify-center';

  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const orderId = params.get('orderId');

  container.innerHTML = `
    <div class="text-center card max-w-lg mx-auto">
      <svg class="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h1 class="text-3xl font-bold text-neutral-900 mb-2">Thank you for your order!</h1>
      <p class="text-neutral-600 mb-6">
        Your order has been placed successfully. Your order ID is 
        <span class="font-bold font-mono text-primary-600">#${orderId ? orderId.toString().slice(-6) : 'N/A'}</span>.
      </p>
      <p class="text-sm text-neutral-600 mb-8">
        You will receive an email confirmation shortly with payment details. You can also view your order status in your dashboard.
      </p>
      <div class="flex gap-4 justify-center">
        <a href="#/dashboard" class="btn-primary">Go to Dashboard</a>
        <a href="#/catalog" class="btn-outline">Continue Shopping</a>
      </div>
    </div>
  `;

  return container;
}
