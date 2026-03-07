const userModel = require('../models/userModel');

/**
 * User Controller
 *
 * Handles the business logic for user-related requests.
 * Sits between the Route (receives request) and the Model (accesses data).
 */

// GET /api/users - Get all users
const getAllUsers = (req, res) => {
    try {
        const users = userModel.findAll();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/users/:id - Get a single user by ID
const getUserById = (req, res) => {
    try {
        const user = userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/users - Create a new user
const createUser = (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ success: false, message: 'Email must be a valid email address' });
        }

        // Check for duplicate email
        const existingUser = userModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email is already in use' });
        }

        const newUser = userModel.create({ name, email });
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/users/:id - Update a user
const updateUser = (req, res) => {
    try {
        // Whitelist allowed fields for update
        const allowedFields = ['name', 'email'];
        const updateData = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Check if body contains any updatable fields
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Request body is empty or contains no updatable fields',
            });
        }

        // Check if user exists
        const existingUser = userModel.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Validate only the provided fields (partial update validation)
        const validation = userModel.validateUpdateData(updateData);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Data validation failed',
                errors: validation.errors,
            });
        }

        // Check for duplicate email if email is being updated
        if (updateData.email) {
            const emailUser = userModel.findByEmail(updateData.email);
            if (emailUser && emailUser.id !== req.params.id) {
                return res.status(409).json({
                    success: false,
                    message: 'Email is already in use by another user',
                });
            }
        }

        const updatedUser = userModel.update(req.params.id, updateData);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/users/:id - Delete a user
const deleteUser = (req, res) => {
    try {
        const deleted = userModel.remove(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
