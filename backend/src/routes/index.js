const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const categoryRoutes = require('./categoryRoutes');

/**
 * User Routes
 * Base path: /api/users
 *
 * Flow: Route -> Controller -> Model
 */

// GET /api/users       - Get all users
router.get('/users', userController.getAllUsers);

// GET /api/users/:id   - Get a single user by ID
router.get('/users/:id', userController.getUserById);

// POST /api/users      - Create a new user
router.post('/users', userController.createUser);

// PUT /api/users/:id   - Update a user by ID
router.put('/users/:id', userController.updateUser);

// DELETE /api/users/:id - Delete a user by ID
router.delete('/users/:id', userController.deleteUser);

// Category Routes
router.use('/categories', categoryRoutes);

module.exports = router;
