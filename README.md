# GitTool_Nhom9

A full-stack web application built with **Node.js + Express** (backend) and **Vanilla HTML/CSS/JS** (frontend), developed by Nhom9.

---

## Prerequisites

Make sure you have the following installed on your machine before you begin:

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes bundled with Node.js)
- A modern web browser (Chrome, Edge, Firefox)

---

## Folder Structure

```
GitTool_Nhom9/
├── backend/                        # Node.js + Express API server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Database configuration
│   │   ├── controllers/
│   │   │   └── userController.js   # Business logic for user requests
│   │   ├── models/
│   │   │   └── userModel.js        # Data access layer (in-memory / DB)
│   │   └── routes/
│   │       └── index.js            # API route definitions
│   ├── .env.example                # Environment variable template
│   ├── package.json                # Backend dependencies
│   └── server.js                   # Express server entry point
│
├── frontend/                       # Vanilla HTML/CSS/JS frontend
│   ├── css/
│   │   └── style.css               # Stylesheet with CSS reset
│   ├── js/
│   │   └── main.js                 # Frontend logic & API calls
│   └── index.html                  # Main HTML page
│
└── README.md                       # This file
```

---

## Request Flow

```
Browser (frontend)
  └── fetch() → GET /api/users
        └── routes/index.js
              └── controllers/userController.js
                    └── models/userModel.js  (data access)
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sinhbuiday/GitTool_Nhom9.git
cd GitTool_Nhom9
```

### 2. Set Up the Backend

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Copy the environment variable template and fill in your values
copy .env.example .env
# On Mac/Linux: cp .env.example .env

# Start the development server
npm run dev
```

The backend will start at **http://localhost:5000**.

### 3. Run the Frontend

The frontend is plain HTML — no build step needed.

Open `frontend/index.html` directly in your browser:

```bash
# Option A: Open manually
# Double-click frontend/index.html in your file explorer

# Option B: Use VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

The frontend will be available at **http://localhost:5500** (if using Live Server) or as a local file.

---

## Available API Endpoints

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | `/api/users`       | Get all users        |
| GET    | `/api/users/:id`   | Get a user by ID     |
| POST   | `/api/users`       | Create a new user    |
| PUT    | `/api/users/:id`   | Update a user        |
| DELETE | `/api/users/:id`   | Delete a user        |

### Example Request

```bash
# Get all users
curl http://localhost:5000/api/users

# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and update the values:

| Variable    | Default                                    | Description           |
|-------------|--------------------------------------------|-----------------------|
| `PORT`      | `5000`                                     | Backend server port   |
| `MONGO_URI` | `mongodb://localhost:27017/gittool_nhom9`  | MongoDB connection URL|
| `DB_NAME`   | `gittool_nhom9`                            | Database name         |

---

## Team Members — Nhom9

| Role       | Responsibility                       |
|------------|--------------------------------------|
| Backend    | API routes, controllers, models      |
| Frontend   | HTML structure, CSS styling, JS logic|
| DevOps     | Git workflow, environment setup      |

---

## License

ISC © 2026 Nhom9
