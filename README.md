# Crime Reporting System

A full-stack web application for reporting crimes against women, built with Node.js, Express, PostgreSQL, and React.js.

## Features

- User Registration & Authentication (JWT)
- Role-based access control (Citizen, Police, Admin)
- Crime reporting with detailed information
- Status tracking and updates
- Dashboard with statistics (Admin/Police)
- Responsive design

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React.js, Vite
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL

## Project Structure

```
crime-reporting-system/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── index.css
│   └── package.json
└── database/
    └── schema.sql
```

## Setup Instructions

### 1. Database Setup

1. Install PostgreSQL
2. Create a new database:
   ```sql
   CREATE DATABASE crime_reporting_system;
   ```
3. Run the schema:
   ```sql
   \i database/schema.sql
   ```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Default Credentials

- **Admin**: admin@crime.gov / admin123
- **Police**: police@crime.gov / admin123
- **Citizen**: Register a new account

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Reports
- POST /api/reports - Create report
- GET /api/reports - Get all reports
- GET /api/reports/:id - Get report by ID
- PUT /api/reports/:id - Update report status
- DELETE /api/reports/:id - Delete report
- GET /api/reports/types - Get crime types

## Environment Variables

Backend (.env):
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crime_reporting_system
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

## License

MIT
