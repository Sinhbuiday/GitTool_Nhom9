/**
 * main.js — Frontend Entry Point (COMPLETE v2.0)
 * GitTool Nhom9 - Full CRUD for Users and Books
 */

'use strict';

console.log('[main.js] JavaScript is running.');

// -----------------------------------------------
// Configuration
// -----------------------------------------------
const API_BASE_URL = 'http://localhost:5000/api';

// -----------------------------------------------
// State
// -----------------------------------------------
let allUsers = [];
let allBooks = [];
let currentEditBookId = null;
let currentEditUserId = null;

// -----------------------------------------------
// DOM References
// -----------------------------------------------
const fetchUsersBtn = document.getElementById('fetchUsersBtn');
const usersSection = document.getElementById('users-section');
const usersList = document.getElementById('users-list');
const showAddBookBtn = document.getElementById('showAddBookBtn');
const addBookContainer = document.getElementById('addBookContainer');
const addBookForm = document.getElementById('addBookForm');
const formMessage = document.getElementById('form-message');
const booksList = document.getElementById('books-list');
const toastContainer = document.getElementById('toastContainer');
const loadingModal = document.getElementById('loadingModal');

// Edit Book Modal
const editBookModal = document.getElementById('editBookModal');
const editBookForm = document.getElementById('editBookForm');
const closeEditBookModalBtn = document.getElementById('closeEditBookModal');
const cancelEditBookBtn = document.getElementById('cancelEditBookBtn');

// Edit User Modal
const editUserModal = document.getElementById('editUserModal');
const editUserForm = document.getElementById('editUserForm');
const closeEditUserModalBtn = document.getElementById('closeEditUserModal');
const cancelEditUserBtn = document.getElementById('cancelEditUserBtn');

// -----------------------------------------------
// API Helpers
// -----------------------------------------------

async function fetchUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const json = await response.json();
    return json.data;
}

async function fetchBooks() {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const json = await response.json();
    return json.data;
}

async function createBook(book) {
    const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to create book');
    return json.data;
}

async function apiUpdateBook(id, data) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to update book');
    return json.data;
}

async function apiDeleteBook(id) {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to delete book');
    return json;
}

async function apiUpdateUser(id, data) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to update user');
    return json.data;
}

async function apiDeleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to delete user');
    return json;
}

// -----------------------------------------------
// Render Helpers
// -----------------------------------------------

function escapeHtml(text) {
    if (!text) return '';
    if (typeof text !== 'string') return String(text);
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderUsers(users) {
    usersList.innerHTML = '';
    if (!users || users.length === 0) {
        usersList.innerHTML = '<li class="empty-item">No users found.</li>';
        return;
    }
    users.forEach((user) => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">${escapeHtml(user.name)}</span>
                <span class="item-detail">${escapeHtml(user.email)}</span>
            </div>
            <div class="item-actions">
                <button class="btn-action btn-action-edit" onclick="openEditUserModal('${user.id}')" title="Edit User">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="btn-action btn-action-delete" onclick="handleDeleteUser('${user.id}')" title="Delete User">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        usersList.appendChild(li);
    });
}

function renderBooks(books) {
    booksList.innerHTML = '';
    if (!books || books.length === 0) {
        booksList.innerHTML = '<li class="empty-item">No books available.</li>';
        return;
    }
    books.forEach((book) => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">${escapeHtml(book.title)}</span>
                <span class="item-detail">by ${escapeHtml(book.author)}${book.category ? ' · ' + escapeHtml(book.category) : ''}</span>
            </div>
            <div class="item-actions">
                <button class="btn-action btn-action-edit" onclick="openEditBookModal('${book.id}')" title="Edit Book">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="btn-action btn-action-delete" onclick="handleDeleteBook('${book.id}')" title="Delete Book">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        booksList.appendChild(li);
    });
}

// -----------------------------------------------
// Modal Management - Books
// -----------------------------------------------

function openEditBookModal(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) {
        showToast('error', 'Book not found');
        return;
    }

    currentEditBookId = bookId;
    document.getElementById('editBookTitle').value = book.title || '';
    document.getElementById('editBookAuthor').value = book.author || '';
    document.getElementById('editBookIsbn').value = book.isbn || '';
    document.getElementById('editBookPublisher').value = book.publisher || '';
    document.getElementById('editBookYear').value = book.year || '';
    document.getElementById('editBookCategory').value = book.category || '';
    document.getElementById('editBookPrice').value = book.price || '';

    editBookModal.classList.remove('hidden');
    document.getElementById('editBookTitle').focus();
}

function closeEditBookModal() {
    editBookModal.classList.add('hidden');
    editBookForm.reset();
    currentEditBookId = null;
}

// -----------------------------------------------
// Modal Management - Users
// -----------------------------------------------

function openEditUserModal(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        showToast('error', 'User not found');
        return;
    }

    currentEditUserId = userId;
    document.getElementById('editUserName').value = user.name || '';
    document.getElementById('editUserEmail').value = user.email || '';

    editUserModal.classList.remove('hidden');
    document.getElementById('editUserName').focus();
}

function closeEditUserModal() {
    editUserModal.classList.add('hidden');
    editUserForm.reset();
    currentEditUserId = null;
}

// -----------------------------------------------
// Data Loading
// -----------------------------------------------

async function loadUsers() {
    try {
        showLoading(true, 'Loading users...');
        const users = await fetchUsers();
        allUsers = users || [];
        renderUsers(allUsers);
        usersSection.style.display = 'block';
    } catch (error) {
        console.error('[main.js] Failed to fetch users:', error);
        showToast('error', 'Failed to load users. Is the backend running?');
        usersList.innerHTML = '<li class="empty-item" style="color:red;">Error loading users</li>';
        usersSection.style.display = 'block';
    } finally {
        showLoading(false);
    }
}

async function loadBooks() {
    try {
        const books = await fetchBooks();
        allBooks = books || [];
        renderBooks(allBooks);
    } catch (error) {
        console.error('[main.js] Failed to fetch books:', error);
        if (booksList) booksList.innerHTML = '<li class="empty-item" style="color:red;">Error loading books</li>';
    }
}

// -----------------------------------------------
// Delete Handlers
// -----------------------------------------------

async function handleDeleteBook(bookId) {
    if (!confirm('⚠️ Are you sure you want to delete this book? This cannot be undone.')) return;

    try {
        showLoading(true, 'Deleting book...');
        await apiDeleteBook(bookId);
        showToast('success', '✅ Book deleted successfully!');
        await loadBooks();
    } catch (error) {
        console.error('[main.js] Failed to delete book:', error);
        showToast('error', error.message);
    } finally {
        showLoading(false);
    }
}

async function handleDeleteUser(userId) {
    if (!confirm('⚠️ Are you sure you want to delete this user? This cannot be undone.')) return;

    try {
        showLoading(true, 'Deleting user...');
        await apiDeleteUser(userId);
        showToast('success', '✅ User deleted successfully!');
        await loadUsers();
    } catch (error) {
        console.error('[main.js] Failed to delete user:', error);
        showToast('error', error.message);
    } finally {
        showLoading(false);
    }
}

// -----------------------------------------------
// Event Listeners
// -----------------------------------------------

// Toggle add-book container
if (showAddBookBtn) {
    showAddBookBtn.addEventListener('click', () => {
        if (!addBookContainer) return;
        const isVisible = addBookContainer.style.display !== 'none';
        addBookContainer.style.display = isVisible ? 'none' : 'block';
        showAddBookBtn.textContent = isVisible ? 'Add Book' : 'Hide Add Book';
        if (!isVisible) {
            loadBooks();
        }
    });
}

// Load Users button
fetchUsersBtn.addEventListener('click', async () => {
    fetchUsersBtn.disabled = true;
    fetchUsersBtn.textContent = 'Loading...';
    try {
        await loadUsers();
    } finally {
        fetchUsersBtn.disabled = false;
        fetchUsersBtn.textContent = 'Load Users from API';
    }
});

// Add Book form
if (addBookForm) {
    addBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formMessage.textContent = '';
        formMessage.className = 'message';

        const formData = new FormData(addBookForm);
        const bookData = {};
        formData.forEach((value, key) => {
            if (value.trim()) bookData[key] = value.trim();
        });

        if (!bookData.title || !bookData.author) {
            showToast('error', 'Title and Author are required');
            return;
        }

        try {
            showLoading(true, 'Adding book...');
            await createBook(bookData);
            showToast('success', '✅ Book added successfully!');
            addBookForm.reset();
            await loadBooks();
        } catch (error) {
            console.error('[main.js] Failed to add book:', error);
            showToast('error', error.message);
        } finally {
            showLoading(false);
        }
    });
}

// Edit Book Form Submit
editBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('editBookTitle').value.trim();
    const author = document.getElementById('editBookAuthor').value.trim();

    if (!title || !author) {
        showToast('error', 'Title and Author are required');
        return;
    }

    const bookData = {
        title,
        author,
        isbn: document.getElementById('editBookIsbn').value.trim(),
        publisher: document.getElementById('editBookPublisher').value.trim(),
        year: document.getElementById('editBookYear').value ? parseInt(document.getElementById('editBookYear').value) : undefined,
        category: document.getElementById('editBookCategory').value.trim(),
        price: document.getElementById('editBookPrice').value ? parseFloat(document.getElementById('editBookPrice').value) : undefined,
    };

    // Remove undefined/empty values
    Object.keys(bookData).forEach(key => {
        if (bookData[key] === undefined || bookData[key] === '') delete bookData[key];
    });

    try {
        showLoading(true, 'Updating book...');
        await apiUpdateBook(currentEditBookId, bookData);
        closeEditBookModal();
        showToast('success', '✅ Book updated successfully!');
        await loadBooks();
    } catch (error) {
        console.error('[main.js] Failed to update book:', error);
        showToast('error', error.message);
    } finally {
        showLoading(false);
    }
});

// Edit User Form Submit
editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('editUserName').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();

    if (!name || !email) {
        showToast('error', 'Name and Email are required');
        return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('error', 'Please enter a valid email address');
        return;
    }

    try {
        showLoading(true, 'Updating user...');
        await apiUpdateUser(currentEditUserId, { name, email });
        closeEditUserModal();
        showToast('success', '✅ User updated successfully!');
        await loadUsers();
    } catch (error) {
        console.error('[main.js] Failed to update user:', error);
        showToast('error', error.message);
    } finally {
        showLoading(false);
    }
});

// Close modals
closeEditBookModalBtn.addEventListener('click', closeEditBookModal);
cancelEditBookBtn.addEventListener('click', closeEditBookModal);
editBookModal.addEventListener('click', (e) => {
    if (e.target === editBookModal) closeEditBookModal();
});

closeEditUserModalBtn.addEventListener('click', closeEditUserModal);
cancelEditUserBtn.addEventListener('click', closeEditUserModal);
editUserModal.addEventListener('click', (e) => {
    if (e.target === editUserModal) closeEditUserModal();
});

// Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditBookModal();
        closeEditUserModal();
    }
});

// -----------------------------------------------
// Notifications
// -----------------------------------------------

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

// -----------------------------------------------
// Global Exports for inline onclick handlers
// -----------------------------------------------
window.openEditBookModal = openEditBookModal;
window.openEditUserModal = openEditUserModal;
window.handleDeleteBook = handleDeleteBook;
window.handleDeleteUser = handleDeleteUser;

// -----------------------------------------------
// Auto-load books on page load
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', loadBooks);
