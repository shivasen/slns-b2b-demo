import { navigate } from '../main.js';
import { getUser, logout, isUserAdmin } from '../utils/auth.js';
import { getCartCount } from '../utils/cart.js';

export async function renderNavigation() {
  const nav = document.createElement('header');
  nav.className = 'bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50';
  
  const user = await getUser();
  const isAdmin = user ? await isUserAdmin() : false;
  const cartCount = getCartCount();
  
  nav.innerHTML = `
    <!-- Main Navigation -->
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <a href="#/" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            SL
          </div>
          <div>
            <div class="text-xl font-extrabold text-neutral-900 tracking-tight">SLNS</div>
            <div class="text-xs text-neutral-500 -mt-1">B2B Ethnic Wear</div>
          </div>
        </a>
        
        <!-- Desktop Menu -->
        <nav class="hidden lg:flex items-center gap-8">
          <a href="#/" class="text-neutral-600 hover:text-neutral-900 font-medium transition-colors">Home</a>
          <a href="#/catalog" class="text-neutral-600 hover:text-neutral-900 font-medium transition-colors">Catalog</a>
          <a href="#/about" class="text-neutral-600 hover:text-neutral-900 font-medium transition-colors">About</a>
          <a href="#/contact" class="text-neutral-600 hover:text-neutral-900 font-medium transition-colors">Contact</a>
          ${isAdmin ? `<a href="#/admin" class="text-primary-600 hover:text-primary-800 font-bold transition-colors">Admin</a>` : ''}
        </nav>
        
        <!-- Actions -->
        <div class="flex items-center gap-4">
          ${user ? `
            <a href="#/dashboard" class="hidden md:flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span class="font-medium text-sm">Dashboard</span>
            </a>
            <button onclick="handleLogout()" class="hidden md:block text-sm text-neutral-600 hover:text-neutral-900">Logout</button>
          ` : `
            <a href="#/login" class="hidden md:block text-sm font-medium text-neutral-600 hover:text-neutral-900">Login</a>
            <a href="#/register" class="hidden md:block btn-secondary text-sm py-2 px-4">Register</a>
          `}
          
          <a href="#/cart" class="relative flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            ${cartCount > 0 ? `
              <span class="absolute -top-2 -right-3 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">${cartCount}</span>
            ` : ''}
          </a>
          
          <button id="mobile-menu-btn" class="lg:hidden text-neutral-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m4-6h-4"></path></svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden lg:hidden bg-white border-t">
      <div class="container mx-auto px-4 py-4 flex flex-col gap-3">
        <a href="#/" class="py-2 text-neutral-700 hover:text-primary-600 font-medium">Home</a>
        <a href="#/catalog" class="py-2 text-neutral-700 hover:text-primary-600 font-medium">Catalog</a>
        <a href="#/about" class="py-2 text-neutral-700 hover:text-primary-600 font-medium">About</a>
        <a href="#/contact" class="py-2 text-neutral-700 hover:text-primary-600 font-medium">Contact</a>
        <hr class="my-2"/>
        ${user ? `
          <a href="#/dashboard" class="py-2 text-neutral-700 hover:text-primary-600 font-medium">Dashboard</a>
          ${isAdmin ? `<a href="#/admin" class="py-2 text-primary-600 hover:text-primary-800 font-bold">Admin Panel</a>` : ''}
          <button onclick="handleLogout()" class="py-2 text-left text-neutral-700 hover:text-primary-600 font-medium">Logout</button>
        ` : `
          <a href="#/login" class="py-2 text-neutral-700 hover:text-primary-600 font-medium">Login</a>
          <a href="#/register" class="btn-secondary text-center">Register as Retailer</a>
        `}
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const mobileMenuBtn = nav.querySelector('#mobile-menu-btn');
    const mobileMenu = nav.querySelector('#mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Close mobile menu on navigation
    nav.querySelectorAll('#mobile-menu a, #mobile-menu button').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }, 0);
  
  window.handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return nav;
}
