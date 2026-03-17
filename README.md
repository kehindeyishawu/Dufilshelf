# DufilShelf — Product Inventory Manager

A full-stack web application for managing product inventory. Users can register, log in, and manage their own products.

---

## Features

- User registration and login with JWT authentication
- Add products with a name and optional description
- View all your products on the home page
- Search/filter products by name
- Fully responsive UI

---

## Tech Stack

- **Frontend**: React (Vite), React Router v6, Context API, CSS Modules
- **Backend**: Node.js, Express 5
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (7-day expiry), Argon2 password hashing
- **Validation**: Zod

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Docker)

---

## Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd Dufilshelf
```

### 2. Start MongoDB

Using Docker:

```bash
docker run -d --name dufilshelf-mongo -p 27017:27017 mongo:latest
```

Or use any running local MongoDB instance.

### 3. Configure the server

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/dufilshelf
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
```

### 4. Install dependencies and run

**Server:**

```bash
cd server
npm install
npm run dev
```

**Client** (in a separate terminal):

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive a JWT |
| GET | `/api/items` | Yes | Fetch all items (supports `?search=`) |
| POST | `/api/items` | Yes | Create a new item |

Protected routes require an `Authorization: Bearer <token>` header.

---

## Project Structure

```
Dufilshelf/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Navbar, Button, ItemCard, AuthModal
│       ├── context/         # AuthContext
│       ├── pages/           # Home, AddItem
│       └── styles/          # Global CSS variables
└── server/                  # Express backend
    ├── middleware/           # JWT auth middleware
    ├── models/              # User, Item schemas
    └── routes/              # auth, items
```
