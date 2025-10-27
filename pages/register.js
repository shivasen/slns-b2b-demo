import { signUp } from '../utils/auth.js';
import { navigate } from '../main.js';

export function renderRegister() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-12';
  
  container.innerHTML = `
    <div class="container mx-auto px-4 max-w-3xl">
      <div id="register-card" class="card">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">Register as Retailer</h1>
          <p class="text-neutral-600">Join SLNS B2B platform and access wholesale pricing</p>
        </div>
        
        <form id="register-form" class="space-y-6">
          <div id="error-message" class="hidden p-3 bg-red-100 text-red-700 rounded-lg text-sm"></div>
          <!-- Business Information -->
          <fieldset class="space-y-4">
            <legend class="font-bold text-lg mb-2 w-full border-b pb-2">Business Information</legend>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Company Name *</label>
                <input type="text" id="company_name" required class="input-field" placeholder="e.g. ABC Boutique"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Business Type *</label>
                <select id="business_type" required class="input-field"><option value="">Select type</option><option>Retailer</option><option>Boutique</option><option>Wholesaler</option></select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">GSTIN *</label>
                <input type="text" id="gstin" required class="input-field" placeholder="22AAAAA0000A1Z5"/>
              </div>
            </div>
          </fieldset>
          
          <!-- Contact Person -->
          <fieldset class="space-y-4">
            <legend class="font-bold text-lg mb-2 w-full border-b pb-2">Contact Details</legend>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Full Name *</label>
                <input type="text" id="full_name" required class="input-field" placeholder="e.g. Rajesh Kumar"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                <input type="email" id="email" required class="input-field" placeholder="contact@abcboutique.com"/>
              </div>
            </div>
          </fieldset>
          
          <!-- Password -->
          <fieldset class="space-y-4">
            <legend class="font-bold text-lg mb-2 w-full border-b pb-2">Create Password</legend>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Password *</label>
                <input type="password" id="password" required class="input-field" placeholder="Minimum 6 characters"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">Confirm Password *</label>
                <input type="password" id="confirm_password" required class="input-field" placeholder="Re-enter password"/>
              </div>
            </div>
          </fieldset>
          
          <!-- Terms -->
          <div class="pt-4">
            <label class="flex items-start gap-3">
              <input type="checkbox" required class="mt-1 rounded text-primary-500 focus:ring-primary-400"/>
              <span class="text-sm text-neutral-600">
                I agree to the <a href="#" class="text-primary-600 hover:underline">Terms & Conditions</a>. I understand my account requires admin approval.
              </span>
            </label>
          </div>
          
          <button type="submit" id="submit-btn" class="btn-primary w-full !py-3 !mt-8">Submit for Approval</button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-neutral-600">
            Already have an account?
            <a href="#/login" class="text-primary-600 font-semibold hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const form = container.querySelector('#register-form');
    const card = container.querySelector('#register-card');
    const submitBtn = container.querySelector('#submit-btn');
    const errorMessage = container.querySelector('#error-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const password = form.querySelector('#password').value;
      const confirmPassword = form.querySelector('#confirm_password').value;

      if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        errorMessage.classList.remove('hidden');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      errorMessage.classList.add('hidden');

      const email = form.querySelector('#email').value;
      const metadata = {
        full_name: form.querySelector('#full_name').value,
        company_name: form.querySelector('#company_name').value,
        business_type: form.querySelector('#business_type').value,
        gstin: form.querySelector('#gstin').value,
      };

      const { data, error } = await signUp(email, password, metadata);

      if (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit for Approval';
      } else {
        card.innerHTML = `
          <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2">Registration Submitted!</h2>
            <p class="text-neutral-600 mb-6">Please check your email to verify your account. Our team will review and activate your B2B access within 24-48 hours.</p>
            <a href="#/login" class="btn-primary">Back to Login</a>
          </div>
        `;
      }
    });
  }, 0);
  
  return container;
}
