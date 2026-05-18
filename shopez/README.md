# SHOPEZ - Virtual Trading E-Commerce Platform

A premium, full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to experience the thrill of the stock market through a simulated, risk-free environment. 

![SHOPEZ Banner](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200)

## Features

- **User Authentication**: Secure JWT-based registration and login system with bcrypt password hashing.
- **Virtual Portfolio**: Start with $100,000 virtual cash to buy and sell stocks.
- **Live Market Dashboard**: Browse available stocks with real-time (simulated) pricing and daily changes.
- **Interactive Charts**: Visualize stock trends using Recharts.
- **Portfolio Tracking**: Monitor your investments, current market value, and net profit/loss with intuitive pie charts and data tables.
- **Admin Dashboard**: Manage users and view all platform transactions (Requires `ADMIN` role).
- **Modern UI/UX**: Built with Material UI featuring a sleek dark mode, glassmorphism elements, and responsive design.

## Tech Stack

- **Frontend**: React (Vite), React Router v6, Material UI, Recharts, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT)
- **Deployment Ready**: Configured for modern deployment platforms (Vercel/Render).

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a MongoDB Atlas URI)

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd shopez
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`

Create a `.env` file in the `server` directory:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
\`\`\`

Seed the database with initial stock data:
\`\`\`bash
node seeder.js
\`\`\`

Start the backend development server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd client
npm install
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be running at `http://localhost:5173`.

## API Endpoints

### Auth
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Authenticate user & get token
- \`GET /api/auth/profile\` - Get user profile

### Stocks
- \`GET /api/stocks\` - Fetch all stocks
- \`GET /api/stocks/:id\` - Fetch single stock

### Transactions
- \`POST /api/transactions/buy\` - Buy stock
- \`POST /api/transactions/sell\` - Sell stock
- \`GET /api/transactions\` - Get user transactions

### Portfolio
- \`GET /api/portfolio\` - Get user portfolio

### Admin
- \`GET /api/admin/users\` - Get all users
- \`GET /api/admin/transactions\` - Get all transactions

## License
MIT License
