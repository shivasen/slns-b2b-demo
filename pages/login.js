import { login } from '../utils/auth.js';
import { navigate } from '../main.js';

export function renderLogin() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4';
  
  container.innerHTML = `
    <div class="max-w-md w-full">
      <div class="card">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
          <p class="text-neutral-600">Sign in to your SLNS B2B account</p>
        </div>
        
        <form id="login-form" class="space-y-4">
          <div id="error-message" class="hidden p-3 bg-red-100 text-red-700 rounded-lg text-sm"></div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input type="email" id="email" required class="input-field" placeholder="Enter your email"/>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input type="password" id="password" required class="input-field" placeholder="Enter your password"/>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="rounded text-primary-500 focus:ring-primary-400"/>
              <span>Remember me</span>
            </label>
            <a href="#" class="text-primary-600 hover:underline">Forgot password?</a>
          </div>
          
          <button type="submit" id="submit-btn" class="btn-primary w-full !py-3">
            <span>Sign In</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-neutral-600">
            Don't have an account?
            <a href="#/register" class="text-primary-600 font-semibold hover:underline">Register as Retailer</a>
          </p>
        </div>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const form = container.querySelector('#login-form');
    const submitBtn = container.querySelector('#submit-btn');
    const errorMessage = container.querySelector('#error-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Signing In...</span>`;
      errorMessage.classList.add('hidden');
      
      const { data, error } = await login(email, password);
      
      if (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In</span>`;
      } else if (data.user) {
        // onAuthStateChange in main.js will handle navigation
      }
    });
  }, 0);
  
  return container;
}
