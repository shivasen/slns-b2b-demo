export function renderAbout() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white';
  
  container.innerHTML = `
    <!-- Hero -->
    <div class="relative bg-neutral-800 text-white py-24 md:py-32">
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1974&auto=format&fit=crop" class="w-full h-full object-cover opacity-20" alt="Artisan weaving fabric"/>
      </div>
      <div class="container mx-auto px-4 text-center relative">
        <p class="text-primary-400 font-semibold mb-2">Our Journey</p>
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">Weaving Tradition with Trust</h1>
        <p class="text-lg max-w-3xl mx-auto text-neutral-300">
          Connecting India's finest artisans with retailers like you since 2015.
        </p>
      </div>
    </div>
    
    <!-- Story Section -->
    <div class="py-16 lg:py-24">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-neutral-800 mb-4">From Chennai, With Passion</h2>
            <p class="text-neutral-600 mb-4">
              Founded in 2015, SLNS (Sarees, Lehengas, and Native Styles) began with a simple vision: to bridge the gap between traditional craftsmanship and modern retail. We saw the need for a reliable B2B partner who valued quality and authenticity as much as our retailers did.
            </p>
            <p class="text-neutral-600 mb-6">
              Starting from a small office in Chennai, we've grown into a trusted platform serving over 500 retailers across India. Our journey is one of passion for ethnic wear and commitment to the businesses we serve.
            </p>
            <div class="flex gap-4">
                <a href="#/contact" class="btn-primary">Partner With Us</a>
                <a href="#/catalog" class="btn-outline">Explore Products</a>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="card text-center"><p class="text-4xl font-bold text-primary-600">500+</p><p class="text-neutral-600">Retail Partners</p></div>
            <div class="card text-center"><p class="text-4xl font-bold text-primary-600">3+</p><p class="text-neutral-600">States Sourced</p></div>
            <div class="card text-center"><p class="text-4xl font-bold text-primary-600">1,200+</p><p class="text-neutral-600">Unique Products</p></div>
            <div class="card text-center"><p class="text-4xl font-bold text-primary-600">2015</p><p class="text-neutral-600">Year Founded</p></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Values Section -->
    <div class="py-16 lg:py-24 bg-neutral-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-neutral-800 mb-4">Our Core Principles</h2>
                <p class="text-neutral-600 max-w-2xl mx-auto">These values guide every decision we make and every partnership we build.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${[
                { title: 'Uncompromising Quality', desc: 'Every piece is hand-inspected to ensure it meets our highest standards of craftsmanship.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />' },
                { title: 'Transparent Pricing', desc: 'Fair, competitive wholesale rates with no hidden fees, empowering your business to thrive.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />' },
                { title: 'Reliable Partnership', desc: 'We see ourselves as an extension of your team, dedicated to your success with fast delivery and support.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />' }
              ].map(value => `
                <div class="text-center">
                  <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">${value.icon}</svg>
                  </div>
                  <h3 class="font-semibold text-lg text-neutral-800 mb-2">${value.title}</h3>
                  <p class="text-sm text-neutral-600">${value.desc}</p>
                </div>
              `).join('')}
            </div>
        </div>
    </div>
  `;
  
  return container;
}
