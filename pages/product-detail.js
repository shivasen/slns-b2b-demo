import { addToCart } from '../utils/cart.js';
import { getProductById } from '../utils/api.js';
import { renderNavigation } from '../components/navigation.js';

export async function renderProductDetail() {
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const productId = parseInt(params.get('id'));
  const product = await getProductById(productId);
  
  if (!product) {
    return renderNotFound();
  }
  
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white py-8';
  
  container.innerHTML = `
    <div class="container mx-auto px-4">
      <!-- Breadcrumb -->
      <div class="mb-6 text-sm text-neutral-600">
        <a href="#/" class="hover:text-primary-600">Home</a>
        <span class="mx-2">/</span>
        <a href="#/catalog" class="hover:text-primary-600">Catalog</a>
        <span class="mx-2">/</span>
        <span class="text-neutral-800 font-medium">${product.name}</span>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image Gallery -->
        <div>
          <div class="border border-neutral-200 rounded-xl overflow-hidden mb-4">
            <img id="main-image" src="${product.image_url}" alt="${product.name}" class="w-full h-96 lg:h-[600px] object-cover"/>
          </div>
          <div class="grid grid-cols-4 gap-4">
            ${[product.image_url, product.image_url, product.image_url, product.image_url].map((img, i) => `
              <div class="border border-neutral-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500" onclick="document.getElementById('main-image').src='${img}'">
                <img src="${img}" alt="View ${i + 1}" class="w-full h-24 object-cover"/>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Product Info -->
        <div>
          <div class="mb-6">
            <div class="flex gap-2 mb-2">
              ${product.tags?.includes('new') ? '<span class="badge-accent">New Arrival</span>' : ''}
              ${product.tags?.includes('bestseller') ? '<span class="badge-success">Best Seller</span>' : ''}
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">${product.name}</h1>
            <p class="text-neutral-600">${product.category}</p>
          </div>
          
          <!-- Pricing -->
          <div class="card bg-neutral-50 mb-6">
            <div class="text-3xl font-bold text-neutral-900 mb-2">₹${Number(product.price).toFixed(2)}</div>
            <div class="text-sm text-neutral-600 mb-4">Wholesale Price per Piece</div>
            
            <div class="border-t border-neutral-200 pt-4">
              <h4 class="font-semibold mb-3">Bulk Pricing Tiers:</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between"><span>${product.moq}-24 pieces:</span> <span class="font-semibold">₹${Number(product.price).toFixed(2)}</span></div>
                <div class="flex justify-between"><span>25-49 pieces:</span> <span class="font-semibold text-green-600">₹${(product.price * 0.95).toFixed(2)} (5% off)</span></div>
                <div class="flex justify-between"><span>50+ pieces:</span> <span class="font-semibold text-green-600">₹${(product.price * 0.90).toFixed(2)} (10% off)</span></div>
              </div>
            </div>
          </div>
          
          <!-- Stock & MOQ -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="card p-4 bg-neutral-50">
              <div class="text-sm text-neutral-600 mb-1">Minimum Order</div>
              <div class="text-xl font-bold text-neutral-800">${product.moq} pieces</div>
            </div>
            <div class="card p-4 bg-neutral-50">
              <div class="text-sm text-neutral-600 mb-1">Stock Available</div>
              <div class="text-xl font-bold ${product.stock > 100 ? 'text-green-600' : 'text-orange-600'}">${product.stock} pieces</div>
            </div>
          </div>
          
          <!-- Quantity Selector -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-neutral-700 mb-2">Quantity (Multiple of ${product.moq})</label>
            <div class="flex items-center gap-2">
              <button onclick="decreaseQty()" class="w-12 h-12 bg-neutral-200 hover:bg-neutral-300 rounded-lg font-bold text-xl transition">-</button>
              <input id="quantity" type="number" value="${product.moq}" min="${product.moq}" step="${product.moq}" class="input-field text-center w-32 h-12"/>
              <button onclick="increaseQty()" class="w-12 h-12 bg-neutral-200 hover:bg-neutral-300 rounded-lg font-bold text-xl transition">+</button>
            </div>
            <p class="text-sm text-neutral-600 mt-2">Total: <span id="total-price" class="font-bold text-neutral-900">₹${(product.price * product.moq).toFixed(2)}</span></p>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col gap-3 mb-6">
            <button onclick="handleAddToCart()" class="btn-primary w-full h-12">Add to Cart</button>
            <button class="btn-secondary w-full h-12">Request Sample</button>
          </div>
          
          <!-- Product Details -->
          <div class="card">
            <h3 class="font-bold text-lg mb-4">Product Specifications</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between border-b border-neutral-200 pb-2"><span>Fabric:</span> <span class="font-medium text-neutral-800">${product.fabric}</span></div>
              <div class="flex justify-between border-b border-neutral-200 pb-2"><span>Color:</span> <span class="font-medium text-neutral-800">${product.color}</span></div>
              <div class="flex justify-between border-b border-neutral-200 pb-2"><span>Length:</span> <span class="font-medium text-neutral-800">6.5 meters</span></div>
              <div class="flex justify-between border-b border-neutral-200 pb-2"><span>Care:</span> <span class="font-medium text-neutral-800">Dry Clean Only</span></div>
              <div class="flex justify-between"><span>SKU:</span> <span class="font-medium text-neutral-800">SLNS-${product.id.toString().padStart(6, '0')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  window.decreaseQty = () => {
    const input = document.getElementById('quantity');
    const current = parseInt(input.value);
    if (current > product.moq) {
      input.value = current - product.moq;
      updateTotal();
    }
  };
  
  window.increaseQty = () => {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + product.moq;
    updateTotal();
  };
  
  window.updateTotal = () => {
    const qty = parseInt(document.getElementById('quantity').value);
    let price = product.price;
    if (qty >= 50) price *= 0.90;
    else if (qty >= 25) price *= 0.95;
    document.getElementById('total-price').textContent = `₹${(price * qty).toFixed(2)}`;
  };
  
  window.handleAddToCart = () => {
    const qty = parseInt(document.getElementById('quantity').value);
    addToCart({ ...product, quantity: qty });
    
    renderNavigation().then(nav => {
        const oldNav = document.querySelector('header');
        oldNav.parentNode.replaceChild(nav, oldNav);
    });
    alert(`Added ${qty} units to cart!`);
  };
  
  return container;
}

function renderNotFound() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white flex items-center justify-center';
  container.innerHTML = `
    <div class="text-center">
      <h1 class="text-4xl font-bold text-neutral-800 mb-4">Product Not Found</h1>
      <p class="text-neutral-600 mb-6">The product you are looking for does not exist.</p>
      <a href="#/catalog" class="btn-primary">Browse Catalog</a>
    </div>
  `;
  return container;
}
