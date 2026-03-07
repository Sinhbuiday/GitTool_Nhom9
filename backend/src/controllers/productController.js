const productModel = require('../models/productModel');

/**
 * Product Controller
 *
 * Handles the business logic for product-related requests.
 * Sits between the Route (receives request) and the Model (accesses data).
 */

// Helper function to validate request
const validateRequest = (data, requiredFields) => {
    const errors = [];
    requiredFields.forEach((field) => {
        if (!data[field]) {
            errors.push(`${field} is required`);
        }
    });
    return {
        isValid: errors.length === 0,
        errors,
    };
};

// GET /api/products - Get all products with optional pagination
const getAllProducts = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page and limit must be greater than 0',
            });
        }

        const result = productModel.findWithPagination(page, limit);
        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/:id - Get a single product by ID
const getProductById = (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required',
            });
        }

        const product = productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/category/:category - Get products by category
const getProductsByCategory = (req, res) => {
    try {
        const { category } = req.params;

        if (!category || category.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Category is required',
            });
        }

        const products = productModel.findByCategory(category);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/search?q=keyword - Search products by name or description
const searchProducts = (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
            });
        }

        const products = productModel.search(q);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/filter - Filter products by multiple criteria
const filterProducts = (req, res) => {
    try {
        const criteria = {
            category: req.query.category,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
            inStock: req.query.inStock === 'true',
        };

        // Validate price filters
        if (criteria.minPrice && criteria.maxPrice && criteria.minPrice > criteria.maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'minPrice cannot be greater than maxPrice',
            });
        }

        const products = productModel.filter(criteria);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/categories/all - Get all unique categories
const getAllCategories = (req, res) => {
    try {
        const categories = productModel.getAllCategories();
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/low-stock/:threshold - Get products with low stock
const getLowStockProducts = (req, res) => {
    try {
        const threshold = parseInt(req.params.threshold) || 10;

        if (threshold < 0) {
            return res.status(400).json({
                success: false,
                message: 'Threshold must be a non-negative number',
            });
        }

        const products = productModel.getLowStockProducts(threshold);
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

        // Validate required fields
        const validation = validateRequest(req.body, ['name', 'category', 'price']);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors,
            });
        }

        // Validate data using model
        const dataValidation = productModel.validateProductData({
            name,
            category,
            price,
            description,
            stock,
        });

        if (!dataValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Data validation failed',
                errors: dataValidation.errors,
            });
        }

        const newProduct = productModel.create({
            name,
            category,
            price,
            description,
            stock,
            image,
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/products/:id - Update a product by ID
const updateProduct = (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required',
            });
        }

        // Whitelist allowed fields for update
        const allowedFields = ['name', 'category', 'price', 'description', 'stock', 'image'];
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

        // Check if product exists
        const existingProduct = productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Validate only the provided fields (partial update validation)
        const validation = productModel.validateUpdateData(updateData);

        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Data validation failed',
                errors: validation.errors,
            });
        }

        const updatedProduct = productModel.update(id, updateData);
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/products/:id - Delete a product by ID
const deleteProduct = (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required',
            });
        }

        const deleted = productModel.remove(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/products/:id/buy/:quantity - Purchase product (reduce stock)
const purchaseProduct = (req, res) => {
    try {
        const { id, quantity } = req.params;

        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required',
            });
        }

        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a positive number',
            });
        }

        const product = productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        if (product.stock < qty) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Available: ${product.stock}, Requested: ${qty}`,
            });
        }

        const updatedProduct = productModel.updateStock(id, qty);
        res.status(200).json({
            success: true,
            message: 'Product purchased successfully',
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/products/:id/restock/:quantity - Restock product (increase stock)
const restockProduct = (req, res) => {
    try {
        const { id, quantity } = req.params;

        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required',
            });
        }

        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a positive number',
            });
        }

        const product = productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const updatedProduct = productModel.restockProduct(id, qty);
        res.status(200).json({
            success: true,
            message: 'Product restocked successfully',
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
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
};
