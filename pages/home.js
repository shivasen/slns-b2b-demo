import { getProducts } from '../utils/api.js';

export async function renderHomePage() {
  const container = document.createElement('div');
  container.className = 'overflow-x-hidden';

  const featuredProducts = await getProducts({ limit: 4 });

  const testimonials = [
    {
      quote: "SLNS has transformed our inventory. The quality is exceptional, and our customers love the new designs. Their B2B platform is seamless and easy to use.",
      name: "Priya Sharma",
      company: "Owner, Rani Boutique, Bangalore",
      avatar: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The reliability and speed of delivery are unmatched. We can always count on SLNS to restock our best-sellers quickly, which is crucial for our business.",
      name: "Ankit Desai",
      company: "Procurement Head, Ethnic Weaves, Mumbai",
      avatar: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "As a new retailer, their low MOQ and supportive team were a game-changer. They helped us build a diverse collection without a huge upfront investment.",
      name: "Sunita Reddy",
      company: "Founder, Nila Creations, Hyderabad",
      avatar: "https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://randomuser.me/api/portraits/women/67.jpg"
    }
  ];
  
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative h-[70vh] md:h-[90vh] bg-cover bg-center text-white" style="background-image: url('https://images.unsplash.com/photo-1622182994052-0f113a697387?q=80&w=2070&auto=format&fit=crop');">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.7);">
          Premium Indian Ethnic Wear for Your Business
        </h1>
        <p class="text-lg md:text-xl mb-10 text-neutral-200 max-w-3xl animate-fade-in-up animation-delay-200" style="text-shadow: 1px 1px 4px rgba(0,0,0,0.7);">
          Wholesale traditional apparel for retailers and boutiques. Authentic quality, competitive pricing, and a reliable partnership.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
          <a href="#/register" class="btn-primary !px-8 !py-4 text-lg">
            Register as Retailer
          </a>
          <a href="#/catalog" class="btn-secondary bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 !px-8 !py-4 text-lg">
            Browse Catalog
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16 lg:py-24 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">Featured Products</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">A glimpse into our curated collection of best-selling ethnic wear.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          ${featuredProducts.map(product => `
            <div class="card card-hover p-0 overflow-hidden group cursor-pointer" onclick="window.location.hash='/product?id=${product.id}'">
              <div class="relative h-80 overflow-hidden bg-neutral-100">
                <img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                ${product.tags?.includes('bestseller') ? '<span class="absolute top-3 left-3 badge-success">Best Seller</span>' : ''}
              </div>
              <div class="p-4">
                <p class="text-sm text-neutral-500 mb-1">${product.category}</p>
                <h3 class="font-bold text-lg text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors h-14 truncate-2-lines">${product.name}</h3>
                <div class="flex justify-between items-end">
                  <div>
                    <div class="text-xl font-bold text-neutral-900">₹${Number(product.price).toFixed(2)}</div>
                    <div class="text-xs text-neutral-500">MOQ: ${product.moq} pcs</div>
                  </div>
                  <button onclick="event.stopPropagation(); alert('Redirecting to product page to add to cart.'); window.location.hash='/product?id=${product.id}'" class="btn-primary text-sm !py-2 !px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="text-center mt-12">
          <a href="#/catalog" class="btn-outline">View Full Catalog</a>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 lg:py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">Our Simple B2B Process</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">A seamless, transparent, and efficient wholesale experience designed for you.</p>
        </div>
        
        <div class="relative max-w-5xl mx-auto">
          <div class="absolute left-1/2 top-12 bottom-12 w-0.5 bg-neutral-200 hidden md:block"></div>
          ${[
            { step: '01', title: 'Register & Verify', desc: 'Create your business account with GSTIN for verification.', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
            { step: '02', title: 'Browse & Select', desc: 'Explore our vast catalog with exclusive wholesale pricing.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            { step: '03', title: 'Place Your Order', desc: 'Add items to your cart, meet the MOQ, and checkout easily.', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
            { step: '04', title: 'Fast, Tracked Delivery', desc: 'Receive your quality-checked products with live tracking.', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' }
          ].map((item, index) => `
            <div class="flex md:items-center mb-12 md:mb-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}">
              <div class="hidden md:flex flex-1"></div>
              <div class="relative">
                <div class="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-primary-500 rounded-full border-4 border-white shadow-lg hidden md:flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"/></svg>
                </div>
              </div>
              <div class="flex-1">
                <div class="card w-full md:w-10/12 ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}">
                  <p class="text-primary-500 font-bold mb-2">Step ${item.step}</p>
                  <h3 class="text-xl font-bold text-neutral-900 mb-2">${item.title}</h3>
                  <p class="text-neutral-600">${item.desc}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 lg:py-24 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">What Our Partners Say</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">Building strong relationships is at the heart of what we do.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${testimonials.map(t => `
            <div class="card h-full flex flex-col">
              <div class="mb-4 text-primary-500">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 00-2 2v1a1 1 0 001 1h2a1 1 0 001-1V4a2 2 0 00-2-2zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path></svg>
              </div>
              <blockquote class="flex-grow text-neutral-600 italic mb-6">"${t.quote}"</blockquote>
              <div class="flex items-center gap-4">
                <img src="${t.avatar}" alt="${t.name}" class="w-12 h-12 rounded-full object-cover"/>
                <div>
                  <p class="font-bold text-neutral-800">${t.name}</p>
                  <p class="text-sm text-neutral-500">${t.company}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 lg:py-24 bg-primary-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Ready to Elevate Your Inventory?</h2>
        <p class="text-lg mb-8 text-neutral-200 max-w-2xl mx-auto">Join hundreds of retailers who trust SLNS for their ethnic wear supply. Get access to premium products and exclusive B2B benefits today.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#/register" class="btn-primary bg-white text-primary-700 hover:bg-neutral-100 !px-8 !py-4 text-lg">
            Register Your Business
          </a>
          <a href="#/contact" class="btn-outline border-white/50 text-white hover:bg-white/10 !px-8 !py-4 text-lg">
            Contact Sales
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-neutral-800 text-neutral-300 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-neutral-900 font-bold text-lg">SL</div>
              <div class="text-xl font-extrabold text-white tracking-tight">SLNS</div>
            </div>
            <p class="text-sm text-neutral-400">Premium Indian ethnic wear for your business. Quality, authenticity, and reliability.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Quick Links</h4>
            <div class="space-y-2 text-sm">
              <a href="#/catalog" class="block hover:text-primary-400">Browse Catalog</a>
              <a href="#/about" class="block hover:text-primary-400">About Us</a>
              <a href="#/contact" class="block hover:text-primary-400">Contact</a>
              <a href="#/register" class="block hover:text-primary-400">Register</a>
            </div>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Categories</h4>
            <div class="space-y-2 text-sm">
              <a href="#/catalog?category=sarees" class="block hover:text-primary-400">Sarees</a>
              <a href="#/catalog?category=churidars" class="block hover:text-primary-400">Churidars</a>
              <a href="#/catalog?category=half-sarees" class="block hover:text-primary-400">Half Sarees</a>
              <a href="#/catalog?category=dhotis" class="block hover:text-primary-400">Dhotis</a>
            </div>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Contact Info</h4>
            <div class="space-y-3 text-sm">
              <p class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> +91 98765 43210</p>
              <p class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> business@slns.in</p>
              <p class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> Chennai, Tamil Nadu</p>
            </div>
          </div>
        </div>
        <div class="border-t border-neutral-700 pt-8 text-center text-sm text-neutral-400">
          <p>&copy; 2025 SLNS. All rights reserved. | <a href="#/terms" class="hover:text-primary-400">Terms & Conditions</a> | <a href="#/privacy" class="hover:text-primary-400">Privacy Policy</a></p>
        </div>
      </div>
    </footer>

    <!-- WhatsApp Widget -->
    <a href="https://wa.me/919876543210" target="_blank" class="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-40">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>
  `;
  
  return container;
}
