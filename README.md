# PG Hostel Management System

A complete solution for managing PG (Paying Guest) hostels. This system allows PG admins to manage their rooms, tenants, and rent payments.

## Project Structure

This project consists of two main parts:

1. **Backend**: A Node.js + Express.js API with MongoDB database
2. **Frontend**: A React application built with Vite and Tailwind CSS

## Features

- Admin registration and login with JWT authentication
- Dashboard with key metrics
- Room management (add, edit, delete rooms)
- Tenant management (add, edit, delete tenants)
- Rent payment tracking (mark rent as paid/unpaid)
- Data isolation per admin using adminId reference
- Profile management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Async/await patterns

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- React Icons for icons
- React Toastify for notifications

## Installation

### Backend
```
cd backend
npm install
```

### Frontend
```
cd frontend
npm install
```

## Running the Application

### Backend
```
cd backend
npm run dev
```

The backend API will be available at `http://localhost:5000`.

### Frontend
```
cd frontend
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

## API Documentation

See the [backend README](backend/README.md) for detailed API documentation.

## Frontend Documentation

See the [frontend README](frontend/README.md) for detailed frontend documentation.

## Future Enhancements

- Staff role management
- Rent notifications
- Dashboard with analytics
- Mobile app integration
