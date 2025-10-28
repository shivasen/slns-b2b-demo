import { showToast } from '../utils/toast.js';

export function renderContact() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-white';
  
  container.innerHTML = `
    <div class="container mx-auto px-4 py-16 lg:py-24">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4">Get in Touch</h1>
        <p class="text-lg text-neutral-600 max-w-2xl mx-auto">Have a question or want to partner with us? Our team is ready to help.</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <!-- Contact Form -->
        <div class="lg:col-span-3 card">
          <h2 class="text-2xl font-bold text-neutral-800 mb-6">Send Us a Message</h2>
          <form id="contact-form" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label class="block text-sm font-medium text-neutral-700 mb-1">Your Name *</label><input type="text" required class="input-field"/></div>
              <div><label class="block text-sm font-medium text-neutral-700 mb-1">Company Name *</label><input type="text" required class="input-field"/></div>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Email Address *</label>
              <input type="email" required class="input-field"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Your Message *</label>
              <textarea required class="input-field" rows="5"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full !py-3">Submit Inquiry</button>
          </form>
        </div>
        
        <!-- Contact Info -->
        <div class="lg:col-span-2 space-y-8">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-800">Sales Inquiries</h3>
                <p class="text-sm text-neutral-600 hover:text-primary-600 transition-colors"><a href="tel:+919876543210">+91 98765 43210</a></p>
                <p class="text-sm text-neutral-600 hover:text-primary-600 transition-colors"><a href="mailto:business@slns.in">business@slns.in</a></p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-800">Our Office</h3>
                <p class="text-sm text-neutral-600">123 T. Nagar, Chennai,<br/>Tamil Nadu 600017, India</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 class="font-semibold text-neutral-800">Business Hours</h3>
                <p class="text-sm text-neutral-600">Mon - Sat: 9am - 7pm</p>
                <p class="text-sm text-neutral-600">Sun: 10am - 5pm</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const form = container.querySelector('#contact-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // In a real app, you'd send this data to a server.
      // For this demo, we'll just show a success message.
      showToast('Thank you for your inquiry! We will get back to you soon.', { type: 'success' });
      form.reset();
    });
  }, 0);

  return container;
}
