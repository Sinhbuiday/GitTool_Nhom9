const Category = require('../models/categoryModel');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        // Handle invalid ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: 'Invalid category ID format' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Public
exports.createCategory = async (req, res) => {
    try {
        // Sanitize input
        const categoryData = {};
        if (req.body.name !== undefined) categoryData.name = String(req.body.name).trim();
        if (req.body.description !== undefined) categoryData.description = String(req.body.description).trim();
        if (req.body.color !== undefined) categoryData.color = String(req.body.color).trim();

        const category = await Category.create(categoryData);
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (err) {
        // Handle Mongoose validation errors with consistent format
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: 'Data validation failed',
                errors,
            });
        }
        // Handle duplicate key error (unique constraint)
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Category name already exists',
            });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Public
exports.updateCategory = async (req, res) => {
    try {
        // Whitelist allowed fields for update
        const allowedFields = ['name', 'description', 'color'];
        const updateData = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = typeof req.body[field] === 'string'
                    ? req.body[field].trim()
                    : req.body[field];
            }
        });

        // Check if body contains any updatable fields
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Request body is empty or contains no updatable fields',
            });
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (err) {
        // Handle invalid ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: 'Invalid category ID format' });
        }
        // Handle Mongoose validation errors with consistent format
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: 'Data validation failed',
                errors,
            });
        }
        // Handle duplicate key error (unique constraint)
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Category name already exists',
            });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Public
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: {},
        });
    } catch (err) {
        // Handle invalid ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: 'Invalid category ID format' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};
