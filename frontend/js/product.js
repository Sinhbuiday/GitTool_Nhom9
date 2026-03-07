/**
 * product.js - Product Management Page
 * GitTool Nhom9
 */

const API_BASE = 'http://localhost:5000/api';

// State
let allProducts = [];
let filteredProducts = [];
let currentProduct = null;
let isLoading = false;

// DOM References
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

// Form inputs
const prodNameInput = document.getElementById('prodName');
const prodCategoryInput = document.getElementById('prodCategory');
const prodPriceInput = document.getElementById('prodPrice');
const prodStockInput = document.getElementById('prodStock');
const prodDescInput = document.getElementById('prodDesc');
const prodImageInput = document.getElementById('prodImage');

// Color palette for product cards
const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

// ===============================================
// Initialization
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// ===============================================
// API Calls
// ===============================================

async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        const json = await res.json();

        if (json.success) {
            allProducts = json.data;
            filteredProducts = [...allProducts];
            renderProducts();
            populateCategoryFilter();
        } else {
            showError('Failed to load products');
        }
    } catch (err) {
        console.error('Error loading products:', err);
        showError('Server connection failed. Is the backend running?');
    }
}

async function createProduct(productData) {
    try {
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
            return true;
        } else {
            showError(json.message || 'Failed to create product');
            return false;
        }
    } catch (err) {
        console.error('Error creating product:', err);
        showError('Error creating product');
        return false;
    }
}

async function updateProduct(id, productData) {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        const json = await res.json();

        if (json.success) {
            const index = allProducts.findIndex(p => p.id === id);
            if (index !== -1) {
                allProducts[index] = json.data;
            }
            filteredProducts = [...allProducts];
            renderProducts();
            closeProductModal();
            return true;
        } else {
            showError(json.message || 'Failed to update product');
            return false;
        }
    } catch (err) {
        console.error('Error updating product:', err);
        showError('Error updating product');
        return false;
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
        });

        const json = await res.json();

        if (json.success) {
            allProducts = allProducts.filter(p => p.id !== id);
            filteredProducts = [...allProducts];
            renderProducts();
            closeProductModal();
        } else {
            showError(json.message || 'Failed to delete product');
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        showError('Error deleting product');
    }
}

// ===============================================
// Rendering
// ===============================================

function renderProducts() {
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <p>No products found. Try adjusting your filters.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filteredProducts.map((product, index) => {
        const accentColor = colors[index % colors.length];
        const stockStatus = product.stock > 0 ? 'in-stock' : 'out-of-stock';
        
        return `
            <div class="product-card" style="--prod-color: ${accentColor};">
                <div class="product-image-wrapper">
                    <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=Product'">
                    <div class="stock-badge ${stockStatus}">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
                </div>
                
                <div class="product-content">
                    <div class="product-category">${escapeHtml(product.category)}</div>
                    <h3 class="product-name">${escapeHtml(product.name)}</h3>
                    <p class="product-desc">${escapeHtml(product.description || 'No description available')}</p>
                    
                    <div class="product-footer">
                        <div class="product-price">$${Number(product.price).toFixed(2)}</div>
                        <button class="btn-view" onclick="openProductModal('${product.id}')">View</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateCategoryFilter() {
    const categories = [...new Set(allProducts.map(p => p.category))];
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

// ===============================================
// Modal Management
// ===============================================

function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;

    modalImage.src = escapeHtml(product.image);
    modalName.textContent = escapeHtml(product.name);
    modalCategory.textContent = `Category: ${escapeHtml(product.category)}`;
    modalDesc.textContent = escapeHtml(product.description || 'No description available');
    modalPrice.textContent = `$${Number(product.price).toFixed(2)}`;
    modalStock.textContent = `${product.stock} units`;

    productModal.classList.remove('hidden');
}

function closeProductModal() {
    productModal.classList.add('hidden');
    currentProduct = null;
}

// ===============================================
// Search & Filter
// ===============================================

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredProducts = allProducts.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderProducts();
}

// ===============================================
// Event Listeners
// ===============================================

function setupEventListeners() {
    // Form submission
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            name: prodNameInput.value,
            category: prodCategoryInput.value,
            price: parseFloat(prodPriceInput.value),
            stock: parseInt(prodStockInput.value),
            description: prodDescInput.value,
            image: prodImageInput.value,
        };

        const success = await createProduct(productData);
        if (success) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = 'Product created successfully!';
            document.body.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 3000);
        }
    });

    // Search & filter
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);

    // Modal controls
    closeModal.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });

    // Modal actions
    editBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        const newName = prompt('Product Name:', currentProduct.name);
        if (newName === null) return;

        const newPrice = prompt('Price:', currentProduct.price);
        if (newPrice === null) return;

        const newStock = prompt('Stock:', currentProduct.stock);
        if (newStock === null) return;

        const newDesc = prompt('Description:', currentProduct.description || '');
        if (newDesc === null) return;

        updateProduct(currentProduct.id, {
            name: newName,
            price: parseFloat(newPrice),
            stock: parseInt(newStock),
            description: newDesc,
        });
    });

    deleteBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        deleteProduct(currentProduct.id);
    });
}

// ===============================================
// Utilities
// ===============================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    document.body.appendChild(errorEl);
    setTimeout(() => errorEl.remove(), 4000);
}
