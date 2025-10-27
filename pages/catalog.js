import { addToCart } from '../utils/cart.js';
import { getProducts } from '../utils/api.js';
import { renderNavigation } from '../components/navigation.js';

export async function renderProductCatalog() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white';
  
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const category = decodeURIComponent(params.get('category') || 'All');
  
  const products = await getProducts({ category });
  
  container.innerHTML = `
    <!-- Header -->
    <div class="bg-neutral-100">
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">
          ${category}
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
            <h3 class="font-bold text-lg mb-4">Filters</h3>
            
            <div class="mb-6">
              <h4 class="font-semibold text-sm text-neutral-800 mb-3">Categories</h4>
              <div class="space-y-2">
                ${['All', 'Sarees', 'Churidars', 'Half Sarees', 'Pavadai Davani', "Men's Dhotis", "Kids' Dhotis"].map(cat => `
                    <a href="#/catalog?category=${encodeURIComponent(cat)}" class="flex items-center gap-2 cursor-pointer group">
                      <div class="w-1.5 h-5 rounded-full ${category === cat ? 'bg-primary-500' : 'bg-transparent group-hover:bg-neutral-200'} transition-colors"></div>
                      <span class="text-sm font-medium ${category === cat ? 'text-primary-600' : 'text-neutral-600 group-hover:text-neutral-900'}">${cat}</span>
                    </a>
                  `
                ).join('')}
              </div>
            </div>
            
            <div class="mb-6">
              <h4 class="font-semibold text-sm text-neutral-800 mb-3">Price Range</h4>
              <div class="space-y-2">
                ${['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'].map(range => `
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" class="rounded text-primary-500 focus:ring-primary-400">
                    <span class="text-sm">${range}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            
            <button class="w-full btn-outline text-sm">Clear Filters</button>
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
              <div class="card card-hover p-0 overflow-hidden group cursor-pointer" onclick="window.location.hash='/product?id=${product.id}'">
                <div class="relative h-80 overflow-hidden bg-neutral-100">
                  <img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div class="absolute top-3 left-3 flex flex-col gap-2">
                    ${product.tags?.includes('new') ? '<span class="badge-accent">New</span>' : ''}
                    ${product.tags?.includes('bestseller') ? '<span class="badge-success">Best Seller</span>' : ''}
                  </div>
                  ${product.stock < 50 ? '<span class="absolute top-3 right-3 badge-warning">Low Stock</span>' : ''}
                </div>
                <div class="p-4">
                  <p class="text-sm text-neutral-500 mb-1">${product.category}</p>
                  <h3 class="font-bold text-lg text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors h-14">${product.name}</h3>
                  
                  <div class="flex justify-between items-end">
                    <div>
                      <div class="text-xl font-bold text-neutral-900">₹${Number(product.price).toFixed(2)}</div>
                      <div class="text-xs text-neutral-500">MOQ: ${product.moq} pcs</div>
                    </div>
                    <button onclick="event.stopPropagation(); handleAddToCart(${product.id})" class="btn-primary text-sm py-2 px-4">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            `).join('') : '<p class="text-neutral-600 col-span-full text-center">No products found in this category.</p>'}
          </div>
        </main>
      </div>
    </div>
  `;
  
  window.handleAddToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart({ ...product, quantity: product.moq });
      
      const newNav = renderNavigation().then(nav => {
        const oldNav = document.querySelector('header');
        oldNav.parentNode.replaceChild(nav, oldNav);
      });
      alert(`Added ${product.moq} units of ${product.name} to cart`);
    }
  };
  
  return container;
}
