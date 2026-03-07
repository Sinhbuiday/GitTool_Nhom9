/**
 * User Model
 *
 * Responsible for data access and manipulation.
 * Currently uses an in-memory array as a placeholder.
 * Replace with actual database calls (e.g., mongoose) when connecting a DB.
 */

// In-memory data store (placeholder — replace with DB queries)
let users = [
    { id: '1', name: 'Alice Nguyen', email: 'alice@example.com', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Bob Tran', email: 'bob@example.com', createdAt: new Date(), updatedAt: new Date() },
];

// Helper: generate a simple unique ID
const generateId = () => Date.now().toString();

// Helper: validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Find all users
const findAll = () => {
    return users;
};

// Find a user by ID
const findById = (id) => {
    return users.find((u) => u.id === id) || null;
};

// Find a user by email
const findByEmail = (email) => {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
};

// Validate user data for update (partial — only validates provided fields)
const validateUpdateData = (data) => {
    const errors = [];

    if (data.name !== undefined) {
        if (typeof data.name !== 'string' || data.name.trim() === '') {
            errors.push('Name must be a non-empty string');
        }
    }

    if (data.email !== undefined) {
        if (typeof data.email !== 'string' || data.email.trim() === '') {
            errors.push('Email must be a non-empty string');
        } else if (!isValidEmail(data.email)) {
            errors.push('Email must be a valid email address');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Create a new user
const create = ({ name, email }) => {
    const newUser = {
        id: generateId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    users.push(newUser);
    return newUser;
};

// Update a user by ID (protects immutable fields: id, createdAt)
const update = (id, data) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    // Strip immutable fields to prevent override
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...safeData } = data;

    const updatedUser = {
        ...users[index],
        ...(safeData.name !== undefined && { name: String(safeData.name).trim() }),
        ...(safeData.email !== undefined && { email: String(safeData.email).trim().toLowerCase() }),
        updatedAt: new Date(),
    };

    users[index] = updatedUser;
    return updatedUser;
};

// Remove a user by ID
const remove = (id) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
};

module.exports = { findAll, findById, findByEmail, create, update, remove, validateUpdateData };
