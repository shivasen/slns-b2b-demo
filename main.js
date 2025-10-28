import './style.css';
import 'toastify-js/src/toastify.css';
import { renderNavigation } from './components/navigation.js';
import { renderHomePage } from './pages/home.js';
import { renderProductCatalog } from './pages/catalog.js';
import { renderProductDetail } from './pages/product-detail.js';
import { renderCart } from './pages/cart.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderAdmin } from './pages/admin.js';
import { renderAdminProductForm } from './pages/admin-product-form.js';
import { renderAbout } from './pages/about.js';
import { renderContact } from './pages/contact.js';
import { renderCheckout } from './pages/checkout.js';
import { renderOrderConfirmation } from './pages/order-confirmation.js';
import { renderOrderDetail } from './pages/order-detail.js';
import { renderTermsPage } from './pages/terms.js';
import { renderPrivacyPage } from './pages/privacy.js';
import { initializeCart } from './utils/cart.js';
import { getUser, isUserAdmin, getUserProfile } from './utils/auth.js';

const app = document.getElementById('app');

const routes = {
  '/': renderHomePage,
  '/catalog': renderProductCatalog,
  '/product': renderProductDetail,
  '/cart': renderCart,
  '/login': renderLogin,
  '/register': renderRegister,
  '/dashboard': renderDashboard,
  '/admin': renderAdmin,
  '/admin/product/new': renderAdminProductForm,
  '/admin/product/edit': renderAdminProductForm,
  '/about': renderAbout,
  '/contact': renderContact,
  '/checkout': renderCheckout,
  '/order-confirmation': renderOrderConfirmation,
  '/order': renderOrderDetail,
  '/terms': renderTermsPage,
  '/privacy': renderPrivacyPage,
};

function showLoading() {
  app.innerHTML = `
    <div class="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  `;
}

async function router() {
  const path = window.location.hash.slice(1) || '/';
  const basePath = path.split('?')[0];
  
  showLoading();

  const user = await getUser();
  
  // Protected routes
  const protectedRoutes = ['/dashboard', '/checkout', '/order-confirmation', '/order'];
  if (protectedRoutes.includes(basePath) && !user) {
    navigate('/login');
    return;
  }

  if (basePath === '/checkout') {
    const profile = await getUserProfile();
    if (!profile?.approved) {
      alert('Your account is not yet approved for placing orders.');
      navigate('/dashboard');
      return;
    }
  }

  if (basePath.startsWith('/admin')) {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }

  const renderFunction = routes[basePath] || renderHomePage;
  
  const navigation = await renderNavigation();
  const content = await renderFunction();
  
  app.innerHTML = '';
  app.appendChild(navigation);
  
  if (content) {
    app.appendChild(content);
  }
  
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
window.addEventListener('cart-change', async () => {
    // Re-render only the navigation on cart change to update the count
    const newNav = await renderNavigation();
    const oldNav = document.querySelector('header');
    if (oldNav) {
        oldNav.parentNode.replaceChild(newNav, oldNav);
    }
});

// Initial load
window.addEventListener('load', () => {
  initializeCart();
  router();
  
  // Listen for auth changes to re-render UI
  window.addEventListener('auth-change', () => {
    console.log('Auth state changed event received.');
    router();
  });
});

export function navigate(path) {
  window.location.hash = path;
}
