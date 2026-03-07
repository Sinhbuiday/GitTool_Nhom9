const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    const categoryForm = document.getElementById('categoryForm');
    const categoryGrid = document.getElementById('categoryGrid');

    // Random colors for category accents
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    const getCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/categories`);
            const json = await res.json();

            if (json.success) {
                renderCategories(json.data);
            } else {
                showError('Failed to load categories');
            }
        } catch (err) {
            console.error(err);
            showError('Server connection failed. Is the backend running?');
        }
    };

    const renderCategories = (categories) => {
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
                        <button class="btn-icon" onclick="deleteCategory('${cat._id}')" title="Delete">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    };

    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('catName');
        const descInput = document.getElementById('catDesc');

        const payload = {
            name: nameInput.value,
            description: descInput.value
        };

        try {
            const res = await fetch(`${API_BASE}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (json.success) {
                nameInput.value = '';
                descInput.value = '';
                getCategories();
            } else {
                alert('Split: ' + json.error);
            }
        } catch (err) {
            console.error(err);
            alert('Action failed. Check console.');
        }
    });

    window.deleteCategory = async (id) => {
        if (!confirm('Confirm removal of this category?')) return;

        try {
            const res = await fetch(`${API_BASE}/categories/${id}`, {
                method: 'DELETE'
            });
            const json = await res.json();

            if (json.success) {
                getCategories();
            } else {
                alert('Deletion failed');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const showError = (msg) => {
        categoryGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><p style="color: var(--danger)">${msg}</p></div>`;
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Initial load
    getCategories();
});
