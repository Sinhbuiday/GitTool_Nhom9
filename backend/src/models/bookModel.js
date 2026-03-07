let books = [
  { id: '101', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', genre: 'Kỹ năng sống', status: 'available' },
  { id: '102', title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', genre: 'Phát triển bản thân', status: 'borrowed' },
  { id: '103', title: 'Nhà Giả Kim', author: 'Paulo Coelho', genre: 'Tiểu thuyết', status: 'available' },
  { id: '104', title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', genre: 'Khoa học', status: 'borrowed' },
  { id: '105', title: 'Không Gia Đình', author: 'Hector Malot', genre: 'Văn học', status: 'available' }
];

const findAll = () => books;
const findById = (id) => books.find((b) => b.id === id) || null;

module.exports = { findAll, findById };