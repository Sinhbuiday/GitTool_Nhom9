/**
 * Book Model
 *
 * Responsible for data access and manipulation for books.
 * Currently uses an in-memory array as a placeholder.
 */

// In-memory data store - Hợp nhất dữ liệu từ cả hai nhánh
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
    { id: '101', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', category: 'Kỹ năng sống', price: 80000 },
    { id: '102', title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', category: 'Phát triển bản thân', price: 70000 },
    { id: '103', title: 'Nhà Giả Kim', author: 'Paulo Coelho', category: 'Tiểu thuyết', price: 65000 },
    { id: '104', title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', category: 'Khoa học', price: 120000 },
    { id: '105', title: 'Không Gia Đình', author: 'Hector Malot', category: 'Văn học', price: 95000 }
];

// Helper: generate a simple unique ID
const generateId = () => Date.now().toString();

// Find all books
const findAll = () => books;

// Find a book by ID
const findById = (id) => books.find((b) => b.id === id) || null;

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

// Validate book data for update (partial — only validates provided fields)
const validateUpdateData = (data) => {
    const errors = [];

    if (data.title !== undefined) {
        if (typeof data.title !== 'string' || data.title.trim() === '') {
            errors.push('Title must be a non-empty string');
        }
    }

    if (data.author !== undefined) {
        if (typeof data.author !== 'string' || data.author.trim() === '') {
            errors.push('Author must be a non-empty string');
        }
    }

    if (data.year !== undefined && data.year !== null && data.year !== '') {
        const year = Number(data.year);
        if (isNaN(year) || !Number.isInteger(year) || year < 0 || year > new Date().getFullYear() + 1) {
            errors.push(`Year must be a valid integer between 0 and ${new Date().getFullYear() + 1}`);
        }
    }

    if (data.price !== undefined && data.price !== null && data.price !== '') {
        const price = Number(data.price);
        if (isNaN(price) || price < 0) {
            errors.push('Price must be a non-negative number');
        }
    }

    if (data.isbn !== undefined && data.isbn !== null) {
        if (typeof data.isbn !== 'string') {
            errors.push('ISBN must be a string');
        }
    }

    if (data.publisher !== undefined && data.publisher !== null) {
        if (typeof data.publisher !== 'string') {
            errors.push('Publisher must be a string');
        }
    }

    if (data.category !== undefined && data.category !== null) {
        if (typeof data.category !== 'string') {
            errors.push('Category must be a string');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Create a new book
const create = (bookData) => {
    const { title, author, isbn, publisher, year, category, price } = bookData;
    const newBook = {
        id: generateId(),
        title: title ? title.trim() : title,
        author: author ? author.trim() : author,
        isbn: isbn ? isbn.trim() : isbn,
        publisher: publisher ? publisher.trim() : publisher,
        year: year ? Number(year) : year,
        category: category ? category.trim() : category,
        price: price ? Number(price) : price,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    books.push(newBook);
    return newBook;
};

// Update a book by ID (protects immutable fields: id, createdAt)
const update = (id, data) => {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return null;

    // Strip immutable fields to prevent override
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...safeData } = data;

    const updatedBook = {
        ...books[index],
        ...(safeData.title !== undefined && { title: String(safeData.title).trim() }),
        ...(safeData.author !== undefined && { author: String(safeData.author).trim() }),
        ...(safeData.isbn !== undefined && { isbn: safeData.isbn ? String(safeData.isbn).trim() : safeData.isbn }),
        ...(safeData.publisher !== undefined && { publisher: safeData.publisher ? String(safeData.publisher).trim() : safeData.publisher }),
        ...(safeData.year !== undefined && { year: safeData.year ? Number(safeData.year) : safeData.year }),
        ...(safeData.category !== undefined && { category: safeData.category ? String(safeData.category).trim() : safeData.category }),
        ...(safeData.price !== undefined && { price: safeData.price ? Number(safeData.price) : safeData.price }),
        updatedAt: new Date(),
    };

    books[index] = updatedBook;
    return updatedBook;
};

// Remove a book by ID
const remove = (id) => {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
};

// Get total number of books
const count = () => books.length;

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
    validateUpdateData,
};
