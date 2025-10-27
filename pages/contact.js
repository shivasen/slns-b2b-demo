export function renderContact() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-12';
  
  container.innerHTML = `
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="font-serif text-4xl font-bold text-neutral-800 mb-4">Contact Us</h1>
          <p class="text-neutral-600">Get in touch with our B2B sales team</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Contact Form -->
          <div class="card">
            <h2 class="font-serif text-2xl font-bold text-neutral-800 mb-6">Send a Message</h2>
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Your Name</label>
                <input type="text" required class="input-field"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Company Name</label>
                <input type="text" required class="input-field"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                <input type="email" required class="input-field"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Mobile Number</label>
                <input type="tel" required class="input-field"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Message</label>
                <textarea required class="input-field" rows="4"></textarea>
              </div>
              <button type="submit" class="btn-primary w-full">Submit Inquiry</button>
            </form>
          </div>
          
          <!-- Contact Info -->
          <div>
            <div class="card mb-6">
              <h3 class="font-semibold text-lg mb-4">Business Hours</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-neutral-600">Monday - Saturday:</span>
                  <span class="font-medium">9:00 AM - 7:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-600">Sunday:</span>
                  <span class="font-medium">10:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
            
            <div class="card mb-6">
              <h3 class="font-semibold text-lg mb-4">Contact Information</h3>
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <div class="text-sm text-neutral-600">Phone</div>
                    <div class="font-medium">+91 98765 43210</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <div class="text-sm text-neutral-600">Email</div>
                    <div class="font-medium">business@slns.in</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <div class="text-sm text-neutral-600">Address</div>
                    <div class="font-medium">123 T. Nagar, Chennai,<br/>Tamil Nadu 600017, India</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card bg-green-50 border-2 border-green-200">
              <h3 class="font-semibold mb-3 text-green-900">💬 WhatsApp Support</h3>
              <p class="text-sm text-green-800 mb-4">Chat with our B2B team instantly</p>
              <a href="https://wa.me/919876543210" target="_blank" class="btn-primary bg-green-600 hover:bg-green-700 w-full inline-block text-center">
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return container;
}
