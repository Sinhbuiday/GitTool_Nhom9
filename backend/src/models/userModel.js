/**
 * User Model
 *
 * Responsible for data access and manipulation.
 * Currently uses an in-memory array as a placeholder.
 * Replace with actual database calls (e.g., mongoose) when connecting a DB.
 */

// In-memory data store (placeholder — replace with DB queries)
let users = [
  { id: '1', name: 'Alice Nguyen', email: 'alice@example.com' },
  { id: '2', name: 'Bob Tran', email: 'bob@example.com' },
];

// Helper: generate a simple unique ID
const generateId = () => Date.now().toString();

// Find all users
const findAll = () => {
  return users;
};

// Find a user by ID
const findById = (id) => {
  return users.find((u) => u.id === id) || null;
};

// Create a new user
const create = ({ name, email }) => {
  const newUser = { id: generateId(), name, email };
  users.push(newUser);
  return newUser;
};

// Update a user by ID
const update = (id, data) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...data, id }; // prevent id overwrite
  return users[index];
};

// Remove a user by ID
const remove = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
};

module.exports = { findAll, findById, create, update, remove };
