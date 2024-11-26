# Janban App

A modern Kanban board application built with React, TypeScript, and Node.js that helps teams manage their tasks and projects efficiently.

## Features

- 📋 Interactive Kanban board with drag-and-drop functionality
- 🔐 Secure user authentication and authorization
- 👥 User profile management
- 📝 Issue tracking and management
- 🌓 Light/Dark theme support
- 📱 Responsive design for all devices

## Tech Stack

### Frontend

- React with TypeScript
- React Router for navigation
- React Query for data fetching
- Tailwind CSS for styling
- DND Kit for drag-and-drop functionality
- Radix UI for accessible components
- Zod for form validation

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/janban-app.git
cd janban-app
```

2. Set up environment variables

Create `.env` files in both frontend and backend directories:

Backend `.env`:

```
MONGO_DB_CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SERVER_PORT=8080
FRONTEND_URL=http://localhost:5173
```

Frontend `.env`:

```
VITE_API_URL=http://localhost:8080/api
```

3. Install dependencies and start the application

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
janban-app/
├── backend/                # Backend server code
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Server entry point
│   └── package.json
├── frontend/              # Frontend client code
│   ├── src/
│   │   ├── api/          # API client functions
│   │   ├── assets/       # Static assets
│   │   ├── auth/         # Authentication logic
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── forms/        # Form components
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript types
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication

- POST `/api/auth/sign-in` - Sign in user
- POST `/api/auth/sign-out` - Sign out user
- GET `/api/auth/access-token` - Refresh access token

### Users

- POST `/api/user/register` - Register new user
- GET `/api/user/users` - Get all users
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update user profile

### Issues

- POST `/api/issues/create-issue` - Create new issue
- GET `/api/issues` - Get all issues
- GET `/api/issues/:issueCode` - Get specific issue
- PUT `/api/issues/:issueCode` - Update issue
- DELETE `/api/issues/:issueCode` - Delete issue

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
It is a hobby project and is not intended as a fully production-ready application.

## README.md Preparation

This file was prepared using the Cascade feature in Windsurf, developed by Codeium.
