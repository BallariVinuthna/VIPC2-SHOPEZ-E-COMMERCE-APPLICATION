# SHOPEZ Frontend

This folder contains the React frontend for the SHOPEZ virtual trading platform.

## What it includes

- React with Vite for fast development
- React Router for client-side navigation
- Material UI for responsive UI components
- Recharts for charts and portfolio visualization
- Axios for communicating with the backend API
- JWT authentication stored in local storage

## Available Pages

- Home
- Login
- Register
- Dashboard
- Portfolio
- Stock details
- Admin dashboard (admin only)

## Setup

```bash
cd shopez/client
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

## API Configuration

The frontend uses `http://localhost:5000/api` by default. To change it, create a `.env` file in `shopez/client` containing:

```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

- `npm run dev` – Run the development server
- `npm run build` – Build production assets
- `npm run preview` – Preview the production build
- `npm run lint` – Run ESLint checks

## Notes

This frontend should be used together with the backend server in `shopez/server`.
For complete setup and backend API documentation, see the root `shopez/README.md`.
