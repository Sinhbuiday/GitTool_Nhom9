/**
 * Product Model
 *
 * Responsible for data access and manipulation for products.
 * Currently uses an in-memory array as a placeholder.
 * Replace with actual database calls (e.g., mongoose) when connecting a DB.
 */

// In-memory data store (placeholder — replace with DB queries)
let products = [
    {
        id: '1',
        name: 'Laptop Pro 15',
        category: 'Electronics',
        price: 1299.99,
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        stock: 10,
        image: 'https://via.placeholder.com/300x200?text=Laptop+Pro+15',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Wireless Mouse',
        category: 'Accessories',
        price: 29.99,
        description: 'Ergonomic wireless mouse with long battery life',
        stock: 50,
        image: 'https://via.placeholder.com/300x200?text=Wireless+Mouse',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        name: 'USB-C Hub',
        category: 'Accessories',
        price: 49.99,
        description: 'Multi-port USB-C hub with HDMI and SD card reader',
        stock: 25,
        image: 'https://via.placeholder.com/300x200?text=USB-C+Hub',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Helper: generate a simple unique ID
const generateId = () => Date.now().toString();

// Helper: validate URL format
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// Validate product data (for creation — all required fields checked)
const validateProductData = (data) => {
    const errors = [];
    
    if (!data.name || (typeof data.name === 'string' && data.name.trim() === '')) {
        errors.push('Product name is required');
    } else if (typeof data.name !== 'string') {
        errors.push('Product name must be a string');
    }
    
    if (!data.category || (typeof data.category === 'string' && data.category.trim() === '')) {
        errors.push('Category is required');
    } else if (typeof data.category !== 'string') {
        errors.push('Category must be a string');
    }
    
    if (data.price === undefined || data.price === null) {
        errors.push('Price is required');
    } else {
        const price = Number(data.price);
        if (isNaN(price) || price <= 0) {
            errors.push('Price must be a positive number');
        }
    }
    
    if (data.stock !== undefined && data.stock !== null) {
        const stock = Number(data.stock);
        if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
            errors.push('Stock must be a non-negative integer');
        }
    }
    
    if (data.description !== undefined && data.description !== null && data.description !== '') {
        if (typeof data.description !== 'string') {
            errors.push('Description must be a string');
        }
    }

    if (data.image !== undefined && data.image !== null && data.image !== '') {
        if (typeof data.image !== 'string' || !isValidUrl(data.image)) {
            errors.push('Image must be a valid URL');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Validate product data for update (partial — only validates provided fields)
const validateUpdateData = (data) => {
    const errors = [];
    
    if (data.name !== undefined) {
        if (typeof data.name !== 'string' || data.name.trim() === '') {
            errors.push('Product name must be a non-empty string');
        }
    }
    
    if (data.category !== undefined) {
        if (typeof data.category !== 'string' || data.category.trim() === '') {
            errors.push('Category must be a non-empty string');
        }
    }
    
    if (data.price !== undefined) {
        const price = Number(data.price);
        if (isNaN(price) || price <= 0) {
            errors.push('Price must be a positive number');
        }
    }
    
    if (data.stock !== undefined) {
        const stock = Number(data.stock);
        if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
            errors.push('Stock must be a non-negative integer');
        }
    }
    
    if (data.description !== undefined && data.description !== null) {
        if (typeof data.description !== 'string') {
            errors.push('Description must be a string');
        }
    }

    if (data.image !== undefined && data.image !== null && data.image !== '') {
        if (typeof data.image !== 'string' || !isValidUrl(data.image)) {
            errors.push('Image must be a valid URL');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Find all products
const findAll = () => {
    return products;
};

// Find a product by ID
const findById = (id) => {
    return products.find((p) => p.id === id) || null;
};

// Find products by category
const findByCategory = (category) => {
    return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
};

// Search products by name or description
const search = (query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
    );
};

// Filter products with multiple criteria
const filter = (criteria) => {
    return products.filter((product) => {
        if (criteria.category && product.category.toLowerCase() !== criteria.category.toLowerCase()) {
            return false;
        }
        if (criteria.minPrice && product.price < criteria.minPrice) {
            return false;
        }
        if (criteria.maxPrice && product.price > criteria.maxPrice) {
            return false;
        }
        if (criteria.inStock && product.stock <= 0) {
            return false;
        }
        return true;
    });
};

// Get all unique categories
const getAllCategories = () => {
    const categories = new Set(products.map((p) => p.category));
    return Array.from(categories);
};

// Create a new product
const create = ({ name, category, price, description, stock, image }) => {
    const newProduct = {
        id: generateId(),
        name: name.trim(),
        category: category.trim(),
        price,
        description: description || '',
        stock: stock || 0,
        image: image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(name),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    products.push(newProduct);
    return newProduct;
};

// Update a product by ID (protects immutable fields: id, createdAt)
const update = (id, data) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    // Strip immutable fields to prevent override
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...safeData } = data;
    
    const updatedProduct = {
        ...products[index],
        ...(safeData.name !== undefined && { name: String(safeData.name).trim() }),
        ...(safeData.category !== undefined && { category: String(safeData.category).trim() }),
        ...(safeData.price !== undefined && { price: Number(safeData.price) }),
        ...(safeData.description !== undefined && { description: String(safeData.description).trim() }),
        ...(safeData.stock !== undefined && { stock: Number(safeData.stock) }),
        ...(safeData.image !== undefined && { image: String(safeData.image).trim() }),
        updatedAt: new Date(),
    };
    
    products[index] = updatedProduct;
    return updatedProduct;
};

// Remove a product by ID
const remove = (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
};

// Update product stock (reduce stock when order is placed)
const updateStock = (id, quantity) => {
    const product = findById(id);
    if (!product) return null;
    
    if (product.stock < quantity) {
        return null; // insufficient stock
    }
    
    return update(id, { stock: product.stock - quantity });
};

// Increase stock (for returns or restocking)
const restockProduct = (id, quantity) => {
    const product = findById(id);
    if (!product) return null;
    
    return update(id, { stock: product.stock + quantity });
};

// Get products with pagination
const findWithPagination = (page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    
    return {
        data: paginatedProducts,
        pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            productsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

// Get low stock products (stock below threshold)
const getLowStockProducts = (threshold = 10) => {
    return products.filter((p) => p.stock < threshold);
};

module.exports = {
    findAll,
    findById,
    findByCategory,
    search,
    filter,
    getAllCategories,
    create,
    update,
    remove,
    updateStock,
    restockProduct,
    findWithPagination,
    getLowStockProducts,
    validateProductData,
    validateUpdateData,
};
