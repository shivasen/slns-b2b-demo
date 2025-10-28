import { addToCart } from '../utils/cart.js';
import { getProducts } from '../utils/api.js';
import { showToast } from '../utils/toast.js';

export async function renderProductCatalog() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white';
  
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  let category = decodeURIComponent(params.get('category') || 'All');
  const searchQuery = decodeURIComponent(params.get('search') || '');

  // If there's a search query, we shouldn't filter by a specific category unless intended
  if (searchQuery) {
    category = 'All';
  }

  const products = await getProducts({ category, search: searchQuery });
  
  container.innerHTML = `
    <!-- Header -->
    <div class="bg-neutral-50 border-b border-neutral-200">
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">
          ${searchQuery ? `Search results for "${searchQuery}"` : `${category} Collection`}
        </h1>
        <p class="text-neutral-600">Browse our premium wholesale collection of ${products.length} products</p>
      </div>
    </div>
    
    <!-- Filters & Products -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:col-span-1">
          <div class="card sticky top-24 p-4">
            <h3 class="font-bold text-lg mb-4">Categories</h3>
            <div class="space-y-2">
              ${['All', 'Sarees', 'Churidars', 'Half Sarees', 'Pavadai Davani', "Men's Dhotis", "Kids' Dhotis"].map(cat => `
                  <a href="#/catalog?category=${encodeURIComponent(cat)}" class="flex items-center gap-3 p-2 rounded-lg cursor-pointer group ${category === cat ? 'bg-primary-50' : 'hover:bg-neutral-100'}">
                    <span class="text-sm font-semibold ${category === cat ? 'text-primary-600' : 'text-neutral-700 group-hover:text-neutral-900'}">${cat}</span>
                  </a>
                `
              ).join('')}
            </div>
          </div>
        </aside>
        
        <!-- Products Grid -->
        <main class="lg:col-span-3">
          <div class="flex justify-between items-center mb-6">
            <p class="text-neutral-600">${products.length} products found</p>
            <select class="input-field w-48 py-2">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
          
          <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            ${products.length > 0 ? products.map(product => `
              <div class="card card-hover p-0 overflow-hidden group" onclick="window.location.hash='/product?id=${product.id}'">
                <div class="relative h-80 overflow-hidden bg-neutral-100">
                  <img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div class="absolute top-3 left-3 flex flex-col gap-2">
                    ${product.tags?.includes('new') ? '<span class="badge-accent">New</span>' : ''}
                    ${product.tags?.includes('bestseller') ? '<span class="badge-success">Best Seller</span>' : ''}
                  </div>
                  ${product.stock < 50 ? '<span class="absolute top-3 right-3 badge-warning">Low Stock</span>' : ''}
                  <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onclick="event.stopPropagation(); handleAddToCart(${product.id})" class="btn-primary text-sm py-2 px-4">
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div class="p-4">
                  <p class="text-sm text-neutral-500 mb-1">${product.category}</p>
                  <h3 class="font-bold text-lg text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors h-14 truncate-2-lines">${product.name}</h3>
                  
                  <div class="flex justify-between items-end">
                    <div>
                      <div class="text-xl font-bold text-neutral-900">₹${Number(product.price).toFixed(2)}</div>
                      <div class="text-xs text-neutral-500">MOQ: ${product.moq} pcs</div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('') : `
            <div class="col-span-full text-center py-16">
              <svg class="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-neutral-900">No products found</h3>
              <p class="mt-1 text-sm text-neutral-500">We couldn't find any products matching your criteria.</p>
              <div class="mt-6">
                <a href="#/catalog" class="btn-outline">Clear Filters</a>
              </div>
            </div>
            `}
          </div>
        </main>
      </div>
    </div>
  `;
  
  window.handleAddToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart({ ...product, quantity: product.moq });
      showToast(`Added ${product.name} to cart`, { type: 'success' });
    }
  };
  
  return container;
}
