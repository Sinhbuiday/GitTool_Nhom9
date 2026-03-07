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
    },
    {
        id: '2',
        name: 'Wireless Mouse',
        category: 'Accessories',
        price: 29.99,
        description: 'Ergonomic wireless mouse with long battery life',
        stock: 50,
        image: 'https://via.placeholder.com/300x200?text=Wireless+Mouse',
    },
    {
        id: '3',
        name: 'USB-C Hub',
        category: 'Accessories',
        price: 49.99,
        description: 'Multi-port USB-C hub with HDMI and SD card reader',
        stock: 25,
        image: 'https://via.placeholder.com/300x200?text=USB-C+Hub',
    },
];

// Helper: generate a simple unique ID
const generateId = () => Date.now().toString();

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

// Create a new product
const create = ({ name, category, price, description, stock, image }) => {
    const newProduct = {
        id: generateId(),
        name,
        category,
        price,
        description,
        stock,
        image: image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(name),
    };
    products.push(newProduct);
    return newProduct;
};

// Update a product by ID
const update = (id, data) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id }; // prevent id overwrite
    return products[index];
};

// Remove a product by ID
const remove = (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
};

module.exports = {
    findAll,
    findById,
    findByCategory,
    create,
    update,
    remove,
};
