const bookModel = require('../models/bookModel');

<<<<<<< HEAD
/**
 * Book Controller
 *
 * Handles the business logic for book-related requests.
 * Sits between the Route (receives request) and the Model (accesses data).
 */

// GET /api/books - Get all books
const getAllBooks = (req, res) => {
    try {
        const books = bookModel.findAll();
        res.status(200).json({
            success: true,
            count: books.length,
            data: books,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/books/:id - Get a single book by ID
const getBookById = (req, res) => {
    try {
        const book = bookModel.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/books/author/:author - Get books by author
const getBooksByAuthor = (req, res) => {
    try {
        const books = bookModel.findByAuthor(req.params.author);
        if (books.length === 0) {
            return res.status(404).json({ success: false, message: 'No books found by this author' });
        }
        res.status(200).json({
            success: true,
            count: books.length,
            data: books,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/books/category/:category - Get books by category
const getBooksByCategory = (req, res) => {
    try {
        const books = bookModel.findByCategory(req.params.category);
        if (books.length === 0) {
            return res.status(404).json({ success: false, message: 'No books found in this category' });
        }
        res.status(200).json({
            success: true,
            count: books.length,
            data: books,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/books/search?title=xyz - Search books by title
const searchBooks = (req, res) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Title query parameter is required' });
        }
        const books = bookModel.searchByTitle(title);
        if (books.length === 0) {
            return res.status(404).json({ success: false, message: 'No books found matching the search' });
        }
        res.status(200).json({
            success: true,
            count: books.length,
            data: books,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/books - Create a new book (ADD BOOK)
const createBook = (req, res) => {
    try {
        const { title, author, isbn, publisher, year, category, price } = req.body;
        
        // Validation
        if (!title || !author) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and author are required' 
            });
        }
        
        if (year && isNaN(year)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Year must be a valid number' 
            });
        }
        
        if (price && isNaN(price)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Price must be a valid number' 
            });
        }
        
        const newBook = bookModel.create({ 
            title, 
            author, 
            isbn, 
            publisher, 
            year, 
            category, 
            price 
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Book added successfully',
            data: newBook 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/books/:id - Update a book
const updateBook = (req, res) => {
    try {
        // Check if book exists
        const existingBook = bookModel.findById(req.params.id);
        if (!existingBook) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        
        // Validate numeric fields if provided
        if (req.body.year && isNaN(req.body.year)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Year must be a valid number' 
            });
        }
        
        if (req.body.price && isNaN(req.body.price)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Price must be a valid number' 
            });
        }
        
        const updatedBook = bookModel.update(req.params.id, req.body);
        res.status(200).json({ 
            success: true, 
            message: 'Book updated successfully',
            data: updatedBook 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/books/:id - Delete a book
const deleteBook = (req, res) => {
    try {
        const deleted = bookModel.remove(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Book deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    getBooksByAuthor,
    getBooksByCategory,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
};
=======
const getAllBooks = (req, res) => {
  try {
    const list = bookModel.findAll();
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookById = (req, res) => {
  try {
    const book = bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllBooks, getBookById };
>>>>>>> develop
