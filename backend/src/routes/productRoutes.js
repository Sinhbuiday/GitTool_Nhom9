const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    filterProducts,
    getAllCategories,
    getLowStockProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    purchaseProduct,
    restockProduct,
} = require('../controllers/productController');

/**
 * Product Routes
 * Base path: /api/products
 */

// Special routes (must be before /:id)
router.get('/categories/all', getAllCategories);
router.get('/low-stock/:threshold', getLowStockProducts);
router.get('/search', searchProducts);
router.get('/filter', filterProducts);

// Category-based route (must be before /:id)
router.get('/category/:category', getProductsByCategory);

// Standard CRUD routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// POST routes for stock management
router.post('/', createProduct);
router.post('/:id/buy/:quantity', purchaseProduct);
router.post('/:id/restock/:quantity', restockProduct);

// PUT and DELETE routes
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
