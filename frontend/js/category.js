/**
 * category.js - Category Management Page (COMPLETE v2.0)
 * GitTool Nhom9 - 100% Complete Category Frontend with Edit Functionality
 */

const API_BASE = 'http://localhost:5000/api';

// ================= STATE =================
let allCategories = [];
let currentEditCategoryId = null;

// ================= DOM REFERENCES =================
const categoryForm = document.getElementById('categoryForm');
const categoryGrid = document.getElementById('categoryGrid');
const editCategoryModal = document.getElementById('editCategoryModal');
const editCategoryForm = document.getElementById('editCategoryForm');
const closeEditCatModal = document.getElementById('closeEditCatModal');
const cancelEditCatBtn = document.getElementById('cancelEditCatBtn');
const editCatName = document.getElementById('editCatName');
const editCatDesc = document.getElementById('editCatDesc');
const loadingModal = document.getElementById('loadingModal');
const toastContainer = document.getElementById('toastContainer');

// Color palette for category accents
const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadCategories();
});

// ================= API CALLS =================

async function loadCategories() {
    try {
        showLoading(true, 'Loading categories...');
        const res = await fetch(`${API_BASE}/categories`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (json.success) {
            allCategories = json.data || [];
            renderCategories(allCategories);
        } else {
            throw new Error(json.message || 'Failed to load categories');
        }
    } catch (err) {
        console.error('Error loading categories:', err);
        showToast('error', 'Failed to load categories. Is the backend running?');
        categoryGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><p style="color: var(--danger)">❌ Connection Error</p></div>`;
    } finally {
        showLoading(false);
    }
}

async function createCategory(categoryData) {
    if (!categoryData.name || categoryData.name.trim() === '') {
        showToast('error', 'Category name is required');
        return false;
    }

    try {
        showLoading(true, 'Adding category...');
        const res = await fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData),
        });

        const json = await res.json();

        if (json.success) {
            await loadCategories();
            categoryForm.reset();
            document.getElementById('catName').focus();
            showToast('success', '✅ Category added successfully!');
            return true;
        } else {
            showToast('error', json.message || 'Failed to create category');
            return false;
        }
    } catch (err) {
        console.error('Error creating category:', err);
        showToast('error', 'Error creating category');
        return false;
    } finally {
        showLoading(false);
    }
}

async function updateCategory(id, categoryData) {
    if (!categoryData.name || categoryData.name.trim() === '') {
        showToast('error', 'Category name is required');
        return false;
    }

    try {
        showLoading(true, 'Updating category...');
        const res = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData),
        });

        const json = await res.json();

        if (json.success) {
            closeEditModal();
            await loadCategories();
            showToast('success', '✅ Category updated successfully!');
            return true;
        } else {
            showToast('error', json.message || 'Failed to update category');
            return false;
        }
    } catch (err) {
        console.error('Error updating category:', err);
        showToast('error', 'Error updating category');
        return false;
    } finally {
        showLoading(false);
    }
}

async function deleteCategory(id) {
    if (!confirm('⚠️ Are you sure you want to delete this category? This cannot be undone.')) return;

    try {
        showLoading(true, 'Deleting category...');
        const res = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'DELETE',
        });
        const json = await res.json();

        if (json.success) {
            await loadCategories();
            showToast('success', '✅ Category deleted successfully!');
        } else {
            showToast('error', json.message || 'Failed to delete category');
        }
    } catch (err) {
        console.error('Error deleting category:', err);
        showToast('error', 'Error deleting category');
    } finally {
        showLoading(false);
    }
}

// ================= RENDERING =================

function renderCategories(categories) {
    if (categories.length === 0) {
        categoryGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>No categories found. Start by adding one above.</p>
            </div>
        `;
        return;
    }

    categoryGrid.innerHTML = categories.map((cat, index) => {
        const accentColor = colors[index % colors.length];
        return `
            <div class="category-card" style="--cat-color: ${accentColor}; animation-delay: ${index * 0.1}s">
                <div class="cat-header">
                    <span class="cat-name">${escapeHtml(cat.name)}</span>
                </div>
                <p class="cat-desc">${cat.description ? escapeHtml(cat.description) : 'No description provided.'}</p>
                <div class="cat-actions">
                    <button class="btn-icon btn-edit" onclick="openEditModal('${cat._id}')" title="Edit">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="handleDeleteCategory('${cat._id}')" title="Delete">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ================= MODAL MANAGEMENT =================

function openEditModal(categoryId) {
    const category = allCategories.find(c => c._id === categoryId);
    if (!category) {
        showToast('error', 'Category not found');
        return;
    }

    currentEditCategoryId = categoryId;
    editCatName.value = category.name || '';
    editCatDesc.value = category.description || '';

    editCategoryModal.classList.remove('hidden');
    editCatName.focus();
    editCatName.select();
}

function closeEditModal() {
    editCategoryModal.classList.add('hidden');
    editCategoryForm.reset();
    currentEditCategoryId = null;
}

// ================= EVENT LISTENERS =================

function setupEventListeners() {
    // Add Category Form
    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('catName');
        const descInput = document.getElementById('catDesc');

        if (!nameInput.value.trim()) {
            showToast('error', 'Category name is required');
            nameInput.focus();
            return;
        }

        const payload = {
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
        };

        await createCategory(payload);
    });

    // Edit Form Submit
    editCategoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!editCatName.value.trim()) {
            showToast('error', 'Category name is required');
            editCatName.focus();
            return;
        }

        const payload = {
            name: editCatName.value.trim(),
            description: editCatDesc.value.trim(),
        };

        if (currentEditCategoryId) {
            await updateCategory(currentEditCategoryId, payload);
        }
    });

    // Close Edit Modal
    closeEditCatModal.addEventListener('click', closeEditModal);
    cancelEditCatBtn.addEventListener('click', closeEditModal);

    // Click backdrop to close
    editCategoryModal.addEventListener('click', (e) => {
        if (e.target === editCategoryModal) closeEditModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEditModal();
        }
    });
}

// ================= NOTIFICATIONS =================

function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    const duration = type === 'error' ? 4000 : 3000;
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function showLoading(show, message = 'Loading...') {
    if (show) {
        loadingModal.classList.remove('hidden');
        document.getElementById('loadingText').textContent = message;
    } else {
        loadingModal.classList.add('hidden');
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

// ================= EXPORTS FOR INLINE HANDLERS =================
window.openEditModal = openEditModal;
window.handleDeleteCategory = deleteCategory;
