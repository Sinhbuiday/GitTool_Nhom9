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
 * Display an error message in the users list.
 * @param {string} message
 */
function renderError(message) {
    usersList.innerHTML = `<li style="color: red;">Error: ${message}</li>`;
}

// -----------------------------------------------
// Event Listeners
// -----------------------------------------------
fetchUsersBtn.addEventListener('click', async () => {
    fetchUsersBtn.disabled = true;
    fetchUsersBtn.textContent = 'Loading...';
    try {
        const users = await fetchUsers();
        renderUsers(users);
    } catch (error) {
        console.error('[main.js] Failed to fetch users:', error);
        renderError(error.message);
    } finally {
        fetchUsersBtn.disabled = false;
        fetchUsersBtn.textContent = 'Load Users from API';
    }
});
