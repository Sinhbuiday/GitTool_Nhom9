/**
 * main.js — Frontend Entry Point
 * GitTool Nhom9
 *
 * This file handles UI interactions and communicates with the backend API.
 */

// Test: confirm JS is loaded
console.log('[main.js] JavaScript is running.');

// -----------------------------------------------
// Configuration
// -----------------------------------------------
const API_BASE_URL = 'http://localhost:5000/api';

// -----------------------------------------------
// DOM References
// -----------------------------------------------
const fetchUsersBtn = document.getElementById('fetchUsersBtn');
const usersList = document.getElementById('users-list');
const showAddBookBtn = document.getElementById('showAddBookBtn');
const addBookContainer = document.getElementById('addBookContainer');

// book elements (may be null until section is shown)
const addBookForm = document.getElementById('addBookForm');
const formMessage = document.getElementById('form-message');
const booksList = document.getElementById('books-list');

// -----------------------------------------------
// API Helper
// -----------------------------------------------

/**
 * Fetch all users from the backend API.
 * @returns {Promise<Array>} Array of user objects
 */
async function fetchUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json.data;
}

/**
 * Fetch all books from the backend API.
 * @returns {Promise<Array>} Array of book objects
 */
async function fetchBooks() {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json.data;
}

/**
 * Submit a new book to the backend API.
 * @param {Object} book
 * @returns {Promise<Object>} newly created book
 */
async function createBook(book) {
    const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'Failed to create book');
    }
    return json.data;
}

// -----------------------------------------------
// Render Helpers
// -----------------------------------------------

/**
 * Render a list of users into the #users-list element.
 * @param {Array} users
 */
function renderUsers(users) {
    usersList.innerHTML = '';
    if (!users || users.length === 0) {
        usersList.innerHTML = '<li>No users found.</li>';
        return;
    }
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = `${user.name} — ${user.email}`;
        usersList.appendChild(li);
    });
}

/**
 * Render a list of books into the #books-list element.
 * @param {Array} books
 */
function renderBooks(books) {
    booksList.innerHTML = '';
    if (!books || books.length === 0) {
        booksList.innerHTML = '<li>No books available.</li>';
        return;
    }
    books.forEach((book) => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by ${book.author}`;
        booksList.appendChild(li);
    });
}

/**
 * Display an error message in a generic list element.
 * @param {string} message
 * @param {HTMLElement} target
 */
function renderError(message, target) {
    target.innerHTML = `<li style="color: red;">Error: ${message}</li>`;
}

/**
 * Display an error message in the users list.
 * @param {string} message
 */
function renderError(message) {
    usersList.innerHTML = `<li style="color: red;">Error: ${message}</li>`;
}

// -----------------------------------------------
// Event Listeners
// -----------------------------------------------

// toggle the add-book container visibility
if (showAddBookBtn) {
    showAddBookBtn.addEventListener('click', () => {
        if (!addBookContainer) return;
        const isVisible = addBookContainer.style.display !== 'none';
        addBookContainer.style.display = isVisible ? 'none' : 'block';
        showAddBookBtn.textContent = isVisible ? 'Add Book' : 'Hide Add Book';
        if (!isVisible) {
            // just became visible -> load books list
            loadBooks();
        }
    });
}

fetchUsersBtn.addEventListener('click', async () => {
    fetchUsersBtn.disabled = true;
    fetchUsersBtn.textContent = 'Loading...';
    try {
        const users = await fetchUsers();
        renderUsers(users);
    } catch (error) {
        console.error('[main.js] Failed to fetch users:', error);
        renderError(error.message, usersList);
    } finally {
        fetchUsersBtn.disabled = false;
        fetchUsersBtn.textContent = 'Load Users from API';
    }
});

// form submission for adding book
if (addBookForm) {
    addBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formMessage.textContent = '';
        formMessage.className = 'message';

        const formData = new FormData(addBookForm);
        const bookData = {};
        formData.forEach((value, key) => {
            bookData[key] = value;
        });

        try {
            const created = await createBook(bookData);
            formMessage.textContent = 'Book added successfully!';
            formMessage.classList.add('success');
            addBookForm.reset();
            // refresh book list
            loadBooks();
        } catch (error) {
            console.error('[main.js] Failed to add book:', error);
            formMessage.textContent = error.message;
            formMessage.classList.add('error');
        }
    });
}

// load books when script initializes
async function loadBooks() {
    try {
        const books = await fetchBooks();
        renderBooks(books);
    } catch (error) {
        console.error('[main.js] Failed to fetch books:', error);
        if (booksList) renderError(error.message, booksList);
    }
}

// automatically load books on page load
document.addEventListener('DOMContentLoaded', loadBooks);
