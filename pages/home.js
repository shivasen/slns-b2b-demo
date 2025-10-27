export function renderHomePage() {
  const container = document.createElement('div');
  
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="bg-neutral-100">
      <div class="container mx-auto px-4 py-20 md:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 text-neutral-900">
            Premium Indian Ethnic Wear for Your Business
          </h1>
          <p class="text-lg md:text-xl mb-10 text-neutral-600">
            Wholesale traditional apparel for retailers, boutiques, and wholesalers.
            Authentic quality. Competitive pricing. Reliable partnership.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#/register" class="btn-primary">
              Register as Retailer
            </a>
            <a href="#/catalog" class="btn-secondary">
              Browse Catalog
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">Our Product Categories</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">Explore our extensive collection of traditional Indian ethnic wear, crafted with precision and authenticity</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${[
            { name: 'Sarees', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', desc: 'Traditional & Designer' },
            { name: 'Churidars', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', desc: 'Elegant & Comfortable' },
            { name: 'Half Sarees', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600', desc: 'Youth Collection' },
            { name: 'Pavadai Davani', img: 'https://images.unsplash.com/photo-1610030469964-76c16dd5e5b9?w=600', desc: 'Traditional Sets' },
            { name: "Men's Dhotis", img: 'https://images.unsplash.com/photo-1622052509928-e6ca8bc0e1d6?w=600', desc: 'Classic & Modern' },
            { name: "Kids' Dhotis", img: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600', desc: 'Adorable Styles' }
          ].map(cat => `
            <a href="#/catalog?category=${cat.name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-')}" class="group block">
              <div class="card card-hover p-0 overflow-hidden">
                <div class="h-80 overflow-hidden">
                  <img src="${cat.img}" alt="${cat.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-bold mb-1">${cat.name}</h3>
                  <p class="text-sm text-neutral-500">${cat.desc}</p>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">How SLNS B2B Works</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">A simple, transparent, and efficient wholesale process designed for you.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          ${[
            { step: '01', title: 'Register', desc: 'Create your business account with GSTIN verification.', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
            { step: '02', title: 'Browse Catalog', desc: 'Explore our collection with wholesale pricing.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            { step: '03', title: 'Place Order', desc: 'Add items with MOQ and enjoy bulk discounts.', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
            { step: '04', title: 'Fast Delivery', desc: 'Receive your quality products with live tracking.', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' }
          ].map(item => `
            <div class="text-center">
              <div class="mb-4 flex justify-center">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"/></svg>
                </div>
              </div>
              <div class="text-primary-500 font-black text-5xl mb-3">${item.step}</div>
              <h3 class="text-xl font-bold text-neutral-900 mb-2">${item.title}</h3>
              <p class="text-neutral-600">${item.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">Why Choose SLNS</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">Your trusted B2B partner for Indian ethnic wear</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${[
            { title: 'Competitive Wholesale Pricing', desc: 'Best rates with quantity-based discounts and flexible payment terms.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Quality Assurance', desc: 'Premium fabrics and craftsmanship with rigorous quality checks.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Low MOQ', desc: 'Flexible minimum order quantities to suit your business needs.', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { title: 'Fast Shipping', desc: 'Quick dispatch and reliable delivery across India.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { title: 'Credit Terms', desc: 'NET 30/60 payment options for verified retailers.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
            { title: '24/7 Support', desc: 'Dedicated account manager and WhatsApp business support.', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' }
          ].map(feature => `
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${feature.icon}"/></svg>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-bold text-neutral-900 mb-1">${feature.title}</h3>
                <p class="text-neutral-600">${feature.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-neutral-900 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Ready to Start Your Partnership?</h2>
        <p class="text-lg mb-8 text-neutral-300 max-w-2xl mx-auto">Join hundreds of retailers and boutiques who trust SLNS for their ethnic wear inventory.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#/register" class="btn-primary">
            Register Your Business
          </a>
          <a href="#/contact" class="btn-outline border-neutral-600 text-white hover:bg-neutral-800">
            Contact Sales Team
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-neutral-100 text-neutral-600 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">SL</div>
              <div class="text-xl font-extrabold text-neutral-900 tracking-tight">SLNS</div>
            </div>
            <p class="text-sm">Premium Indian ethnic wear for your business. Quality, authenticity, and reliability.</p>
          </div>
          
          <div>
            <h4 class="font-bold text-neutral-900 mb-4">Quick Links</h4>
            <div class="space-y-2 text-sm">
              <a href="#/catalog" class="block hover:text-primary-600">Browse Catalog</a>
              <a href="#/about" class="block hover:text-primary-600">About Us</a>
              <a href="#/contact" class="block hover:text-primary-600">Contact</a>
              <a href="#/register" class="block hover:text-primary-600">Register</a>
            </div>
          </div>
          
          <div>
            <h4 class="font-bold text-neutral-900 mb-4">Categories</h4>
            <div class="space-y-2 text-sm">
              <a href="#/catalog?category=sarees" class="block hover:text-primary-600">Sarees</a>
              <a href="#/catalog?category=churidars" class="block hover:text-primary-600">Churidars</a>
              <a href="#/catalog?category=half-sarees" class="block hover:text-primary-600">Half Sarees</a>
              <a href="#/catalog?category=dhotis" class="block hover:text-primary-600">Dhotis</a>
            </div>
          </div>
          
          <div>
            <h4 class="font-bold text-neutral-900 mb-4">Contact Info</h4>
            <div class="space-y-2 text-sm">
              <p>📞 +91 98765 43210</p>
              <p>✉️ business@slns.in</p>
              <p>📍 Chennai, Tamil Nadu, India</p>
            </div>
          </div>
        </div>
        
        <div class="border-t border-neutral-200 pt-8 text-center text-sm">
          <p>&copy; 2025 SLNS. All rights reserved. | <a href="#" class="hover:text-primary-600">Terms & Conditions</a> | <a href="#" class="hover:text-primary-600">Privacy Policy</a></p>
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
