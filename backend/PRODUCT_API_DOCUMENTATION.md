# Product API Documentation

Hướng dẫn hoàn chỉnh cho Product Backend API v1.0

## Tổng quan

API sản phẩm cung cấp các chức năng CRUD hoàn toàn, tìm kiếm, lọc, quản lý kho hàng và phân trang.

**Base URL:** `http://localhost:5000/api/products`

---

## 1. Lấy tất cả sản phẩm (Với Phân Trang)

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `page` (optional): Số trang (mặc định: 1)
- `limit` (optional): Số sản phẩm trên mỗi trang (mặc định: 10)

**Ví dụ Request:**
```bash
GET /api/products?page=1&limit=10
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Laptop Pro 15",
      "category": "Electronics",
      "price": 1299.99,
      "description": "High-performance laptop with 16GB RAM and 512GB SSD",
      "stock": 10,
      "image": "https://via.placeholder.com/300x200?text=Laptop+Pro+15",
      "createdAt": "2026-03-07T...",
      "updatedAt": "2026-03-07T..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalProducts": 15,
    "productsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 2. Lấy chi tiết sản phẩm theo ID

**Endpoint:** `GET /api/products/:id`

**Path Parameters:**
- `id` (required): ID sản phẩm

**Ví dụ Request:**
```bash
GET /api/products/1
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Laptop Pro 15",
    "category": "Electronics",
    "price": 1299.99,
    "description": "High-performance laptop with 16GB RAM and 512GB SSD",
    "stock": 10,
    "image": "https://via.placeholder.com/300x200?text=Laptop+Pro+15",
    "createdAt": "2026-03-07T...",
    "updatedAt": "2026-03-07T..."
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## 3. Tìm sản phẩm theo Danh mục

**Endpoint:** `GET /api/products/category/:category`

**Path Parameters:**
- `category` (required): Tên danh mục

**Ví dụ Request:**
```bash
GET /api/products/category/Electronics
```

**Response Success (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "name": "Laptop Pro 15",
      "category": "Electronics",
      "price": 1299.99,
      "description": "...",
      "stock": 10,
      "image": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 4. Tìm kiếm sản phẩm

**Endpoint:** `GET /api/products/search`

**Query Parameters:**
- `q` (required): Từ khóa tìm kiếm (tìm theo tên hoặc mô tả)

**Ví dụ Request:**
```bash
GET /api/products/search?q=Laptop
```

**Response Success (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "1",
      "name": "Laptop Pro 15",
      "category": "Electronics",
      "price": 1299.99,
      "description": "High-performance laptop with 16GB RAM and 512GB SSD",
      "stock": 10,
      "image": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 5. Lọc sản phẩm theo Tiêu chí

**Endpoint:** `GET /api/products/filter`

**Query Parameters:**
- `category` (optional): Danh mục
- `minPrice` (optional): Giá tối thiểu
- `maxPrice` (optional): Giá tối đa
- `inStock` (optional): Chỉ sản phẩm có hàng (true/false)

**Ví dụ Request:**
```bash
GET /api/products/filter?category=Electronics&minPrice=500&maxPrice=2000&inStock=true
```

**Response Success (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "1",
      "name": "Laptop Pro 15",
      "category": "Electronics",
      "price": 1299.99,
      "description": "...",
      "stock": 10,
      "image": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 6. Lấy tất cả Danh mục

**Endpoint:** `GET /api/products/categories/all`

**Ví dụ Request:**
```bash
GET /api/products/categories/all
```

**Response Success (200):**
```json
{
  "success": true,
  "count": 2,
  "data": ["Electronics", "Accessories"]
}
```

---

## 7. Lấy sản phẩm hàng tồn kho thấp

**Endpoint:** `GET /api/products/low-stock/:threshold`

**Path Parameters:**
- `threshold` (optional, mặc định: 10): Mức tồn kho tối thiểu

**Ví dụ Request:**
```bash
GET /api/products/low-stock/5
```

**Response Success (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "1",
      "name": "Laptop Pro 15",
      "category": "Electronics",
      "price": 1299.99,
      "description": "...",
      "stock": 3,
      "image": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 8. Tạo sản phẩm mới

**Endpoint:** `POST /api/products`

**Request Body:**
```json
{
  "name": "USB-C Cable",
  "category": "Accessories",
  "price": 19.99,
  "description": "High-speed USB-C cable (3 meters)",
  "stock": 100,
  "image": "https://via.placeholder.com/300x200?text=USB-C+Cable"
}
```

**Required Fields:** `name`, `category`, `price`

**Response Success (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "1746854356789",
    "name": "USB-C Cable",
    "category": "Accessories",
    "price": 19.99,
    "description": "High-speed USB-C cable (3 meters)",
    "stock": 100,
    "image": "https://via.placeholder.com/300x200?text=USB-C+Cable",
    "createdAt": "2026-03-07T...",
    "updatedAt": "2026-03-07T..."
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Data validation failed",
  "errors": [
    "Price must be a positive number"
  ]
}
```

---

## 9. Cập nhật sản phẩm

**Endpoint:** `PUT /api/products/:id`

**Path Parameters:**
- `id` (required): ID sản phẩm

**Request Body (có thể cập nhật một phần hoặc toàn bộ):**
```json
{
  "name": "Laptop Pro 15 Updated",
  "price": 1399.99,
  "stock": 15
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "1",
    "name": "Laptop Pro 15 Updated",
    "category": "Electronics",
    "price": 1399.99,
    "description": "High-performance laptop with 16GB RAM and 512GB SSD",
    "stock": 15,
    "image": "...",
    "createdAt": "2026-03-07T...",
    "updatedAt": "2026-03-07T..."
  }
}
```

---

## 10. Xóa sản phẩm

**Endpoint:** `DELETE /api/products/:id`

**Path Parameters:**
- `id` (required): ID sản phẩm

**Ví dụ Request:**
```bash
DELETE /api/products/1
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 11. Mua sản phẩm (Giảm tồn kho)

**Endpoint:** `POST /api/products/:id/buy/:quantity`

**Path Parameters:**
- `id` (required): ID sản phẩm
- `quantity` (required): Số lượng mua

**Ví dụ Request:**
```bash
POST /api/products/1/buy/5
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Product purchased successfully",
  "data": {
    "id": "1",
    "name": "Laptop Pro 15",
    "category": "Electronics",
    "price": 1299.99,
    "description": "...",
    "stock": 5,
    "image": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response Error (400) - Hàng không đủ:**
```json
{
  "success": false,
  "message": "Insufficient stock. Available: 3, Requested: 5"
}
```

---

## 12. Nhập hàng (Tăng tồn kho)

**Endpoint:** `POST /api/products/:id/restock/:quantity`

**Path Parameters:**
- `id` (required): ID sản phẩm
- `quantity` (required): Số lượng nhập

**Ví dụ Request:**
```bash
POST /api/products/1/restock/20
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Product restocked successfully",
  "data": {
    "id": "1",
    "name": "Laptop Pro 15",
    "category": "Electronics",
    "price": 1299.99,
    "description": "...",
    "stock": 30,
    "image": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## Mã Status HTTP

| Code | Ý Nghĩa |
|------|---------|
| 200 | OK - Yêu cầu thành công |
| 201 | Created - Tài nguyên được tạo thành công |
| 400 | Bad Request - Dữ liệu gửi không hợp lệ |
| 404 | Not Found - Tài nguyên không tìm thấy |
| 500 | Internal Server Error - Lỗi máy chủ |

---

## Validation Rules

### Name (Tên)
- Bắt buộc
- Không được để trống

### Category (Danh mục)
- Bắt buộc
- Không được để trống

### Price (Giá)
- Bắt buộc
- Phải là số dương

### Stock (Tồn kho)
- Tùy chọn (mặc định: 0)
- Phải là số không âm

### Description (Mô tả)
- Tùy chọn
- Phải là chuỗi (nếu có)

---

## Lỗi Thường Gặp

### 1. Missing Required Fields
```json
{
  "success": false,
  "message": "Data validation failed",
  "errors": ["Product name is required", "Category is required"]
}
```

### 2. Invalid Data Types
```json
{
  "success": false,
  "message": "Data validation failed",
  "errors": ["Price must be a positive number", "Stock must be a non-negative number"]
}
```

### 3. Product Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 4. Insufficient Stock
```json
{
  "success": false,
  "message": "Insufficient stock. Available: 3, Requested: 10"
}
```

---

## Ví dụ cURL

### Lấy tất cả sản phẩm
```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=10"
```

### Tạo sản phẩm mới
```bash
curl -X POST "http://localhost:5000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "category": "Electronics",
    "price": 99.99,
    "description": "Amazing product",
    "stock": 50
  }'
```

### Tìm kiếm sản phẩm
```bash
curl -X GET "http://localhost:5000/api/products/search?q=Laptop"
```

### Mua sản phẩm
```bash
curl -X POST "http://localhost:5000/api/products/1/buy/5"
```

### Lọc sản phẩm
```bash
curl -X GET "http://localhost:5000/api/products/filter?category=Electronics&minPrice=500&maxPrice=2000"
```

---

## Features Tính Năng Chính

✅ **CRUD Operations** - Tạo, đọc, cập nhật, xóa sản phẩm
✅ **Tìm kiếm (Search)** - Tìm kiếm theo tên hoặc mô tả
✅ **Lọc (Filter)** - Lọc theo danh mục, giá, tồn kho
✅ **Phân trang (Pagination)** - Hỗ trợ phân trang động
✅ **Quản lý kho hàng** - Giảm tồn kho (mua), tăng tồn kho (nhập)
✅ **Validation** - Xác thực dữ liệu toàn diện
✅ **Error Handling** - Xử lý lỗi chi tiết
✅ **API Standards** - Tuân thủ chuẩn RESTful API

---

## Khởi chạy Server

```bash
cd backend
npm install
npm start
# hoặc npm run dev (với nodemon)
```

Server sẽ chạy tại: `http://localhost:5000`

---

**Phiên bản:** 1.0.0  
**Ngày cập nhật:** 07/03/2026
