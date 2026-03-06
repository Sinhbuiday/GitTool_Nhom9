const bookModel = require('../models/bookModel');

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