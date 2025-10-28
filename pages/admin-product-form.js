import { getProductById, createProduct, updateProduct } from '../utils/api.js';
import { navigate } from '../main.js';
import { showToast } from '../utils/toast.js';

export async function renderAdminProductForm() {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-neutral-50 py-8';

  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const productId = params.get('id');
  const isEditing = !!productId;

  let product = {};
  if (isEditing) {
    product = await getProductById(parseInt(productId));
    if (!product) {
      navigate('/admin');
      return container;
    }
  }

  container.innerHTML = `
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="mb-6">
        <a href="#/admin" class="text-primary-600 hover:underline text-sm">&larr; Back to Admin Panel</a>
        <h1 class="text-3xl font-bold text-neutral-800 mt-2">${isEditing ? 'Edit Product' : 'Create New Product'}</h1>
      </div>
      
      <div class="card">
        <form id="product-form" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Product Name *</label>
              <input type="text" id="name" required class="input-field" value="${product.name || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Category *</label>
              <select id="category" required class="input-field">
                ${['Sarees', 'Churidars', 'Half Sarees', 'Pavadai Davani', "Men's Dhotis", "Kids' Dhotis"].map(cat => `
                  <option ${product.category === cat ? 'selected' : ''}>${cat}</option>
                `).join('')}
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Image URL *</label>
            <input type="url" id="image_url" required class="input-field" placeholder="https://..." value="${product.image_url || ''}" />
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Price (₹) *</label>
              <input type="number" id="price" required class="input-field" step="0.01" value="${product.price || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Stock *</label>
              <input type="number" id="stock" required class="input-field" value="${product.stock || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">MOQ *</label>
              <input type="number" id="moq" required class="input-field" value="${product.moq || ''}" />
            </div>
             <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Tags</label>
              <input type="text" id="tags" class="input-field" placeholder="new,bestseller" value="${product.tags?.join(',') || ''}" />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Fabric</label>
              <input type="text" id="fabric" class="input-field" value="${product.fabric || ''}" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Color</label>
              <input type="text" id="color" class="input-field" value="${product.color || ''}" />
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <button type="submit" id="submit-btn" class="btn-primary">
              ${isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector('#product-form');
    const submitBtn = container.querySelector('#submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      const productData = {
        name: form.querySelector('#name').value,
        category: form.querySelector('#category').value,
        image_url: form.querySelector('#image_url').value,
        price: parseFloat(form.querySelector('#price').value),
        stock: parseInt(form.querySelector('#stock').value),
        moq: parseInt(form.querySelector('#moq').value),
        fabric: form.querySelector('#fabric').value,
        color: form.querySelector('#color').value,
        tags: form.querySelector('#tags').value.split(',').map(t => t.trim()).filter(Boolean),
      };

      let error;
      if (isEditing) {
        const { error: updateError } = await updateProduct(product.id, productData);
        error = updateError;
      } else {
        const { error: createError } = await createProduct(productData);
        error = createError;
      }

      if (error) {
        showToast(error.message, { type: 'error' });
        submitBtn.disabled = false;
        submitBtn.textContent = isEditing ? 'Save Changes' : 'Create Product';
      } else {
        showToast(`Product ${isEditing ? 'updated' : 'created'} successfully!`, { type: 'success' });
        navigate('/admin');
        // Set a flag to force the admin page to reload the products view
        sessionStorage.setItem('admin_view', 'products');
      }
    });
  }, 0);

  return container;
}
