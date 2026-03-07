const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

/**
 * Product Routes
 * Base path: /api/products
 */

// GET /api/products - Get all products
router.get('/', getAllProducts);

// GET /api/products/:id - Get a single product by ID
router.get('/:id', getProductById);

// GET /api/products/category/:category - Get products by category (must be before /:id)
router.get('/category/:category', getProductsByCategory);

// POST /api/products - Create a new product
router.post('/', createProduct);

// PUT /api/products/:id - Update a product by ID
router.put('/:id', updateProduct);

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
