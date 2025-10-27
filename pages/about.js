export function renderAbout() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50';
  
  container.innerHTML = `
    <!-- Hero -->
    <div class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="font-serif text-4xl md:text-5xl font-bold mb-4">About SLNS</h1>
        <p class="text-lg max-w-2xl mx-auto text-white/90">
          Your trusted partner for premium Indian ethnic wear since 2015
        </p>
      </div>
    </div>
    
    <!-- Content -->
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto">
        <div class="card mb-8">
          <h2 class="font-serif text-2xl font-bold text-neutral-800 mb-4">Our Story</h2>
          <p class="text-neutral-600 mb-4">
            Founded in 2015 in the heart of Chennai, SLNS (Sarees, Lehengas, and Native Styles) began with a vision to bridge the gap between traditional craftsmanship and modern business needs. We recognized that retailers and boutiques needed a reliable, quality-focused B2B partner for Indian ethnic wear.
          </p>
          <p class="text-neutral-600">
            Today, we serve over 500+ retailers across India, offering an extensive collection of sarees, churidars, half sarees, pavadai davani, and traditional dhotis. Our commitment to quality, authenticity, and customer service has made us a preferred B2B partner in the ethnic wear industry.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          ${[
            { title: 'Quality First', desc: 'Every piece undergoes rigorous quality checks', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Fair Pricing', desc: 'Competitive wholesale rates with transparent pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { title: 'Fast Delivery', desc: 'Quick dispatch and reliable logistics network', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
          ].map(value => `
            <div class="card text-center">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${value.icon}"/>
                </svg>
              </div>
              <h3 class="font-semibold text-lg text-neutral-800 mb-2">${value.title}</h3>
              <p class="text-sm text-neutral-600">${value.desc}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="card bg-primary-50 border-2 border-primary-200 text-center">
          <h3 class="font-serif text-2xl font-bold text-primary-900 mb-4">Manufacturing Process</h3>
          <p class="text-neutral-700 mb-6">
            We work directly with artisans and weavers across Tamil Nadu, Karnataka, and Andhra Pradesh to bring you authentic, handcrafted ethnic wear. Our manufacturing process combines traditional techniques with modern quality standards.
          </p>
          <a href="#/contact" class="btn-primary inline-block">Partner With Us</a>
        </div>
      </div>
    </div>
  `;
  
  return container;
}
