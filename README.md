# Healthcare Backend API

A RESTful healthcare backend built with Node.js, Express.js, PostgreSQL, Prisma ORM, and JWT authentication.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Patient CRUD operations with user-specific ownership
- Doctor CRUD operations
- Patient-doctor assignment and removal
- Request validation and centralized error handling
- PostgreSQL database with relational models

## Tech Stack

- Node.js and Express.js
- PostgreSQL
- Prisma ORM
- JSON Web Tokens (`jsonwebtoken`)
- bcrypt (`bcryptjs`)

## Prerequisites

- Node.js and npm
- PostgreSQL

## Installation

1. Clone the repository.
2. Install dependencies:

   `npm install`

3. Create a PostgreSQL database named `healthcare_db`.
4. Create a `.env` file using `.env.example` as a template.
5. Configure `DATABASE_URL`, `JWT_SECRET`, and `PORT`.
6. Run database migrations:

   `npx prisma migrate deploy`

   `npx prisma generate`

7. Start the server:

   `npm start`

For local development, use `npm run dev`.

## API Endpoints

### Authentication

- `POST /api/auth/register/`
- `POST /api/auth/login/`

### Patients

- `POST /api/patients/`
- `GET /api/patients/`
- `GET /api/patients/:id/`
- `PUT /api/patients/:id/`
- `DELETE /api/patients/:id/`

### Doctors

- `POST /api/doctors/`
- `GET /api/doctors/`
- `GET /api/doctors/:id/`
- `PUT /api/doctors/:id/`
- `DELETE /api/doctors/:id/`

### Patient-Doctor Mappings

- `POST /api/mappings/`
- `GET /api/mappings/`
- `GET /api/mappings/:patient_id/`
- `DELETE /api/mappings/:id/`

## Authentication

Log in to obtain a JWT. For protected endpoints, include it in the request header:

`Authorization: Bearer YOUR_JWT_TOKEN`

## Database Models

- User
- Patient
- Doctor
- PatientDoctor

## Testing

Test the APIs using Postman with valid request bodies and JWT authentication.

## Security Notes

- Passwords are stored as hashes.
- Patient records are restricted to their owners.
- Doctor records are shared among authenticated users in this implementation.
- Configure secrets through environment variables.
