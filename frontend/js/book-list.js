'use strict';

(() => {
  const BOOKS = [
    { id: 101, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', genre: 'Kỹ năng sống', status: 'available' },
    { id: 102, title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', genre: 'Phát triển bản thân', status: 'borrowed' },
    { id: 103, title: 'Nhà Giả Kim', author: 'Paulo Coelho', genre: 'Tiểu thuyết', status: 'available' },
    { id: 104, title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', genre: 'Khoa học', status: 'borrowed' },
    { id: 105, title: 'Không Gia Đình', author: 'Hector Malot', genre: 'Văn học', status: 'available' }
  ];

  const escapeHtml = v =>
    String(v).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));

  const statusPill = s => {
    const cls = s === 'available' ? 'available' : 'borrowed';
    const label = s === 'available' ? 'Sẵn có' : 'Đã mượn';
    return `<span class="status ${cls}">${label}</span>`;
  };

  function renderBooks(books) {
    const tbody = document.querySelector('#bookTable tbody');
    const empty = document.getElementById('empty');
    if (!tbody) return;

    if (!Array.isArray(books) || books.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }

    tbody.innerHTML = books.map(b => `
      <tr>
        <td>${escapeHtml(b.id)}</td>
        <td>${escapeHtml(b.title)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${escapeHtml(b.genre)}</td>
        <td>${statusPill(b.status)}</td>
      </tr>
    `).join('');

    if (empty) empty.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderBooks(BOOKS);
  });
})();