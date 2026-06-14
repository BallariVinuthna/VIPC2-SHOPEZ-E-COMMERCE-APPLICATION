# SHOPEZ

SHOPEZ is a full-stack virtual trading platform built with React, Vite, Node.js, Express, and MongoDB. It simulates a stock trading experience with a virtual balance, portfolio tracking, market data, transaction history, and admin tools.

## Project Overview

- Users can register and log in with secure JWT authentication.
- Each user receives a virtual balance of $100,000 by default.
- Users can browse available stocks, buy and sell shares, and view their portfolio.
- All trades are recorded as BUY and SELL transactions.
- Admin users can manage stock listings and review user transactions.
- The frontend uses Material UI and Recharts to present charts and dashboards.

## Folder Structure

- `client/` – React frontend powered by Vite
- `server/` – Express backend with REST APIs
- `server/config/` – MongoDB connection helper
- `server/controllers/` – Request handlers for authentication, stocks, portfolio, transactions, and admin
- `server/models/` – Mongoose schemas for User, Stock, Portfolio, and Transaction
- `server/routes/` – API route definitions
- `server/middleware/` – Authentication and admin middleware
- `server/seeder.js` – Data seeding script for initial stock records

## Key Features

- JWT-based user registration and login
- Virtual stock trading with buy/sell orders
- Portfolio valuation and profit/loss calculation
- Stock search and detail viewing
- User transaction history
- Admin stock management and transaction audit
- Persistent user session via local storage

## Tech Stack

- Frontend: React, Vite, React Router, Material UI, Recharts, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Dev tools: Nodemon, ESLint

## Setup and Running

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or available through a MongoDB URI

### Backend Setup

```bash
cd shopez/server
npm install
```

Create a `.env` file in `shopez/server` with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

Seed the database with initial stock data:

```bash
node seeder.js
```

Start the backend server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd shopez/client
npm install
npm run dev
```

The frontend will normally be available at `http://localhost:5173`.

If you need to override the API base URL, create `shopez/client/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Reference

### Auth
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and retrieve a JWT
- `GET /api/auth/profile` – Get current user profile (authenticated)

### Stocks
- `GET /api/stocks` – Fetch all stocks
- `GET /api/stocks/:id` – Fetch a single stock

### Transactions
- `POST /api/transactions/buy` – Buy stock shares
- `POST /api/transactions/sell` – Sell stock shares
- `GET /api/transactions` – Fetch user transaction history

### Portfolio
- `GET /api/portfolio` – Fetch the current user portfolio

### Admin
- `GET /api/admin/users` – Get all users
- `POST /api/admin/stocks` – Add a new stock
- `PUT /api/admin/stocks/:id` – Update an existing stock
- `DELETE /api/admin/stocks/:id` – Remove a stock
- `GET /api/admin/transactions` – Get all transactions

## Notes

- New users are created with role `USER` and a default balance of $100,000.
- Only users with role `ADMIN` can access admin endpoints.
- The seed script loads initial stock symbols and preserves existing user accounts.

## License
MIT
