# Habit Challenge Platform - NestJS Backend

A NestJS backend for a habit tracking and challenge platform with authentication, habits management, and challenges.

## Features

### Authentication
- **Email + Password**: Traditional authentication with JWT
- **Passwordless Token**: Token-based authentication without password
- **JWT Guards**: Protected routes with JWT authentication

### Habits API
- Create, update, delete habits
- Mark habit as completed for a specific date
- Fetch weekly habit completion statistics

### Challenges API
- Create challenges with name, duration, and habit type
- Join/leave challenges
- Fetch challenge participants and scores

## Installation

```bash
npm install
```

## Running the app

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register with email and password
- `POST /auth/login` - Login with email and password
- `POST /auth/passwordless/request` - Request passwordless token
- `POST /auth/passwordless/verify` - Verify passwordless token

### Habits (Protected)

- `POST /habits` - Create a habit
- `GET /habits` - Get all user habits
- `GET /habits/:id` - Get a specific habit
- `PATCH /habits/:id` - Update a habit
- `DELETE /habits/:id` - Delete a habit
- `POST /habits/:id/complete` - Mark habit as completed
- `GET /habits/:id/stats/weekly` - Get weekly completion stats

### Challenges (Protected)

- `POST /challenges` - Create a challenge
- `GET /challenges` - Get all active challenges
- `GET /challenges/:id` - Get a specific challenge
- `POST /challenges/:id/join` - Join a challenge
- `DELETE /challenges/:id/leave` - Leave a challenge
- `GET /challenges/:id/participants` - Get challenge participants
- `GET /challenges/:id/scores` - Get challenge scores and leaderboard

## Environment Variables

Create a `.env` file:

```
PORT=5000
JWT_SECRET=your-secret-key-here
DB_PATH=./habitsDB.sqlite
```

## Database

The app uses SQLite with TypeORM. The database file will be created automatically on first run.

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```
