/**
 * Book Model
 *
 * Responsible for data access and manipulation for books.
 * Currently uses an in-memory array as a placeholder.
 * Replace with actual database calls (e.g., mongoose) when connecting a DB.
 */

// In-memory data store (placeholder — replace with DB queries)
let books = [
    { 
        id: '1', 
        title: 'The Great Gatsby', 
        author: 'F. Scott Fitzgerald', 
        isbn: '978-0-7432-7356-5',
        publisher: 'Scribner',
        year: 1925,
        category: 'Classic Fiction',
        price: 12.99
    },
    { 
        id: '2', 
        title: 'To Kill a Mockingbird', 
        author: 'Harper Lee', 
        isbn: '978-0-06-112008-4',
        publisher: 'J.B. Lippincott',
        year: 1960,
        category: 'Classic Fiction',
        price: 14.99
    },
];

// Helper: generate a simple unique ID
const generateId = () => Date.now().toString();

// Find all books
const findAll = () => {
    return books;
};

// Find a book by ID
const findById = (id) => {
    return books.find((b) => b.id === id) || null;
};

// Find books by author
const findByAuthor = (author) => {
    return books.filter((b) => 
        b.author.toLowerCase().includes(author.toLowerCase())
    );
};

// Find books by category
const findByCategory = (category) => {
    return books.filter((b) => 
        b.category.toLowerCase().includes(category.toLowerCase())
    );
};

// Find books by title (search)
const searchByTitle = (title) => {
    return books.filter((b) => 
        b.title.toLowerCase().includes(title.toLowerCase())
    );
};

// Create a new book
const create = (bookData) => {
    const { title, author, isbn, publisher, year, category, price } = bookData;
    
    const newBook = { 
        id: generateId(), 
        title, 
        author, 
        isbn, 
        publisher, 
        year, 
        category, 
        price 
    };
    
    books.push(newBook);
    return newBook;
};

// Update a book by ID
const update = (id, data) => {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...data, id }; // prevent id overwrite
    return books[index];
};

// Remove a book by ID
const remove = (id) => {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
};

// Get total number of books
const count = () => {
    return books.length;
};

module.exports = {
    findAll,
    findById,
    findByAuthor,
    findByCategory,
    searchByTitle,
    create,
    update,
    remove,
    count,
};
