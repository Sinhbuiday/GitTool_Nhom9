/**
 * product.js - Product Management Page (COMPLETE v2.0)
 * GitTool Nhom9 - 100% Complete Product Frontend with All Features
 */

const API_BASE = 'http://localhost:5000/api';

// ================= STATE =================
let allProducts = [];
let filteredProducts = [];
let currentProduct = null;
let isLoading = false;

// ================= DOM REFERENCES =================
const productForm = document.getElementById('productForm');
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const productModal = document.getElementById('productModal');
const editModal = document.getElementById('editModal');
const loadingModal = document.getElementById('loadingModal');
const toastContainer = document.getElementById('toastContainer');

// View Modal elements
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalStock = document.getElementById('modalStock');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');

// Edit Modal elements
const closeEditModal = document.getElementById('closeEditModal');
const editForm = document.getElementById('editForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editProdName = document.getElementById('editProdName');
const editProdCategory = document.getElementById('editProdCategory');
const editProdPrice = document.getElementById('editProdPrice');
const editProdStock = document.getElementById('editProdStock');
const editProdDesc = document.getElementById('editProdDesc');
const editProdImage = document.getElementById('editProdImage');

// Form inputs (Add Product)
const prodNameInput = document.getElementById('prodName');
const prodCategoryInput = document.getElementById('prodCategory');
const prodPriceInput = document.getElementById('prodPrice');
const prodStockInput = document.getElementById('prodStock');
const prodDescInput = document.getElementById('prodDesc');
const prodImageInput = document.getElementById('prodImage');

// Color palette
const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadProducts();
});

// ================= API CALLS =================

async function loadProducts() {
    try {
        showLoading(true, 'Loading products...');
        const res = await fetch(`${API_BASE}/products`);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (json.success) {
            allProducts = json.data || [];
            filteredProducts = [...allProducts];
            renderProducts();
            populateCategoryFilter();
        } else {
            throw new Error(json.message || 'Failed to load products');
        }
    } catch (err) {
        console.error('Error loading products:', err);
        showError('Failed to load products. Is the backend running?');
        productGrid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><p>❌ Connection Error</p></div>';
    } finally {
        showLoading(false);
    }
}

async function createProduct(productData) {
    const validation = validateProductData(productData);
    if (!validation.valid) {
        showError(validation.errors[0]);
        return false;
    }

    try {
        showLoading(true, 'Adding product...');
        const res = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        const json = await res.json();

        if (json.success) {
            allProducts.push(json.data);
            filteredProducts = [...allProducts];
            renderProducts();
            populateCategoryFilter();
            productForm.reset();
            prodNameInput.focus();
            showSuccess('✅ Product added successfully!');
            return true;
        } else {
            showError(json.message || 'Failed to create product');
            return false;
        }
    } catch (err) {
        console.error('Error creating product:', err);
        showError('Error creating product');
        return false;
    } finally {
        showLoading(false);
    }
}

async function updateProduct(id, productData) {
    const validation = validateProductData(productData);
    if (!validation.valid) {
        showError(validation.errors[0]);
        return false;
    }

    try {
        showLoading(true, 'Updating product...');
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        const json = await res.json();

        if (json.success) {
            const index = allProducts.findIndex(p => p.id === id);
            if (index !== -1) allProducts[index] = json.data;
            applyFilters();
            populateCategoryFilter();
            closeEditModalFunc();
            closeViewModal();
            showSuccess('✅ Product updated successfully!');
            return true;
        } else {
            showError(json.message || 'Failed to update product');
            return false;
        }
    } catch (err) {
        console.error('Error updating product:', err);
        showError('Error updating product');
        return false;
    } finally {
        showLoading(false);
    }
}

async function deleteProduct(id) {
    if (!confirm('⚠️ Are you absolutely sure? This cannot be undone.')) return;

    try {
        showLoading(true, 'Deleting product...');
        const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
        const json = await res.json();

        if (json.success) {
            allProducts = allProducts.filter(p => p.id !== id);
            filteredProducts = [...allProducts];
            renderProducts();
            closeViewModal();
            showSuccess('✅ Product deleted successfully!');
        } else {
            showError(json.message || 'Failed to delete product');
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        showError('Error deleting product');
    } finally {
        showLoading(false);
    }
}


// ================= RENDERING =================

function renderProducts() {
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <p>📦 No products found</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filteredProducts.map((product, index) => {
        const accentColor = colors[index % colors.length];
        const stockStatus = product.stock > 0 ? 'in-stock' : 'out-of-stock';
        const imageUrl = product.image || 'https://via.placeholder.com/300x200?text=Product';
        
        return `
            <div class="product-card" style="--prod-color: ${accentColor};">
                <div class="product-image-wrapper">
                    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.name)}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=Product'">
                    <div class="stock-badge ${stockStatus}">${product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</div>
                </div>
                <div class="product-content">
                    <div class="product-category">${escapeHtml(product.category)}</div>
                    <h3 class="product-name">${escapeHtml(product.name)}</h3>
                    <p class="product-desc">${escapeHtml(product.description || 'No description')}</p>
                    <div class="product-footer">
                        <div class="product-price">$${Number(product.price).toFixed(2)}</div>
                        <button class="btn-view" onclick="openViewModal('${product.id}')">View Details</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateCategoryFilter() {
    const categories = [...new Set(allProducts.map(p => p.category))].sort();
    const currentValue = categoryFilter.value;
    
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
    
    categoryFilter.value = currentValue;
}

// ================= MODAL MANAGEMENT =================

function openViewModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        showError('Product not found');
        return;
    }

    currentProduct = product;
    modalImage.src = product.image || 'https://via.placeholder.com/300x200?text=Product';
    modalImage.onerror = () => { modalImage.src = 'https://via.placeholder.com/300x200?text=Product'; };
    modalName.textContent = product.name;
    modalCategory.textContent = `Category: ${product.category}`;
    modalDesc.textContent = product.description || 'No description available';
    modalPrice.textContent = `$${Number(product.price).toFixed(2)}`;
    modalStock.textContent = `${product.stock} ${product.stock === 1 ? 'unit' : 'units'}`;

    productModal.classList.remove('hidden');
    productModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeViewModal() {
    productModal.classList.add('hidden');
    currentProduct = null;
}

function openEditModal(product) {
    if (!product) return;

    editProdName.value = product.name;
    editProdCategory.value = product.category;
    editProdPrice.value = product.price;
    editProdStock.value = product.stock;
    editProdDesc.value = product.description || '';
    editProdImage.value = product.image || '';

    editModal.classList.remove('hidden');
    editProdName.focus();
    editProdName.select();
}

function closeEditModalFunc() {
    editModal.classList.add('hidden');
    editForm.reset();
}

// ================= SEARCH & FILTER =================

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    filteredProducts = allProducts.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderProducts();
}



// ================= EVENT LISTENERS =================

function setupEventListeners() {
    // Add Product Form
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateFormInputs()) {
            showError('Please fill in all required fields');
            return;
        }

        const productData = {
            name: prodNameInput.value.trim(),
            category: prodCategoryInput.value.trim(),
            price: parseFloat(prodPriceInput.value),
            stock: parseInt(prodStockInput.value),
            description: prodDescInput.value.trim(),
            image: prodImageInput.value.trim() || 'https://via.placeholder.com/300x200?text=Product',
        };

        await createProduct(productData);
    });

    // Search & Filter
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);

    // View Modal
    closeModal.addEventListener('click', closeViewModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeViewModal();
    });

    editBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        const productToEdit = currentProduct;
        closeViewModal();
        openEditModal(productToEdit);
    });

    deleteBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        deleteProduct(currentProduct.id);
    });

    // Edit Modal
    closeEditModal.addEventListener('click', closeEditModalFunc);
    cancelEditBtn.addEventListener('click', closeEditModalFunc);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModalFunc();
    });

    // Edit Form
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateEditFormInputs()) {
            showError('Please fill in all required fields');
            return;
        }

        const productData = {
            name: editProdName.value.trim(),
            category: editProdCategory.value.trim(),
            price: parseFloat(editProdPrice.value),
            stock: parseInt(editProdStock.value),
            description: editProdDesc.value.trim(),
            image: editProdImage.value.trim() || 'https://via.placeholder.com/300x200?text=Product',
        };

        if (currentProduct) {
            await updateProduct(currentProduct.id, productData);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeViewModal();
            closeEditModalFunc();
        }
    });
}

// ================= VALIDATION =================

function validateProductData(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
        errors.push('Product name is required');
    }
    if (!data.category || data.category.trim() === '') {
        errors.push('Category is required');
    }
    if (data.price === null || data.price === undefined || isNaN(data.price) || data.price < 0) {
        errors.push('Valid price is required');
    }
    if (data.stock === null || data.stock === undefined || isNaN(data.stock) || data.stock < 0) {
        errors.push('Valid stock is required');
    }

    return { valid: errors.length === 0, errors };
}

function validateFormInputs() {
    return prodNameInput.value.trim() !== '' &&
        prodCategoryInput.value.trim() !== '' &&
        !isNaN(prodPriceInput.value) && parseFloat(prodPriceInput.value) >= 0 &&
        !isNaN(prodStockInput.value) && parseInt(prodStockInput.value) >= 0;
}

function validateEditFormInputs() {
    return editProdName.value.trim() !== '' &&
        editProdCategory.value.trim() !== '' &&
        !isNaN(editProdPrice.value) && parseFloat(editProdPrice.value) >= 0 &&
        !isNaN(editProdStock.value) && parseInt(editProdStock.value) >= 0;
}

// ================= NOTIFICATIONS =================

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'toast error';
    errorEl.innerHTML = `<span>❌</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(errorEl);

    setTimeout(() => {
        errorEl.classList.add('fade-out');
        setTimeout(() => errorEl.remove(), 300);
    }, 4000);
}

function showSuccess(message) {
    const successEl = document.createElement('div');
    successEl.className = 'toast success';
    successEl.innerHTML = `<span>✅</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(successEl);

    setTimeout(() => {
        successEl.classList.add('fade-out');
        setTimeout(() => successEl.remove(), 300);
    }, 3000);
}

function showLoading(show, message = 'Loading...') {
    if (show) {
        loadingModal.classList.remove('hidden');
        document.getElementById('loadingText').textContent = message;
        isLoading = true;
    } else {
        loadingModal.classList.add('hidden');
        isLoading = false;
    }
}

// ================= UTILITIES =================

function escapeHtml(text) {
    if (!text) return '';
    if (typeof text !== 'string') return String(text);
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export for inline onclick
window.openViewModal = openViewModal;
