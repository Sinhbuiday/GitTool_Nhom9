const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');

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


/**
 * Book Routes
 * Base path: /api/books
 *
 * Flow: Route -> Controller -> Model
 */

// GET /api/books       - Get all books
router.get('/books', bookController.getAllBooks);

// GET /api/books/search - Search books by title
router.get('/books/search', bookController.searchBooks);

// GET /api/books/author/:author - Get books by author
router.get('/books/author/:author', bookController.getBooksByAuthor);

// GET /api/books/category/:category - Get books by category
router.get('/books/category/:category', bookController.getBooksByCategory);

// GET /api/books/:id   - Get a single book by ID
router.get('/books/:id', bookController.getBookById);

// POST /api/books      - Create a new book (ADD BOOK)
router.post('/books', bookController.createBook);

// PUT /api/books/:id   - Update a book by ID
router.put('/books/:id', bookController.updateBook);

// DELETE /api/books/:id - Delete a book by ID
router.delete('/books/:id', bookController.deleteBook);

// Category Routes
router.use('/categories', categoryRoutes);

// Product Routes
router.use('/products', productRoutes);

module.exports = router;
