const productModel = require('../models/productModel');

/**
 * Product Controller
 *
 * Handles the business logic for product-related requests.
 * Sits between the Route (receives request) and the Model (accesses data).
 */

// GET /api/products - Get all products
const getAllProducts = (req, res) => {
    try {
        const products = productModel.findAll();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/:id - Get a single product by ID
const getProductById = (req, res) => {
    try {
        const product = productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/category/:category - Get products by category
const getProductsByCategory = (req, res) => {
    try {
        const products = productModel.findByCategory(req.params.category);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/products - Create a new product
const createProduct = (req, res) => {
    try {
        const { name, category, price, description, stock, image } = req.body;
        if (!name || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, and price are required',
            });
        }
        const newProduct = productModel.create({ name, category, price, description, stock, image });
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/products/:id - Update a product by ID
const updateProduct = (req, res) => {
    try {
        const product = productModel.update(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/products/:id - Delete a product by ID
const deleteProduct = (req, res) => {
    try {
        const deleted = productModel.remove(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
};
