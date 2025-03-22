# RBAC-Bookstore-API

## Overview

This project is a RESTful API built with **Node.js** and **Express**, designed to implement role-based access control (RBAC) with different authorization levels. It provides secure authentication using **JWT** and supports user roles and permissions. The system uses **MongoDB** for data storage and includes full CRUD operations with validation.

## Features

✅ User authentication with JWT\
✅ Full **CRUD** operations for books and roles\
✅ **Role-based access control (RBAC)** for Admin, Editor, and Viewer\
✅ Secure **API endpoints** protected by middleware\
✅ Secure authentication using **JWT**\
✅ **Data validation** to ensure integrity\
✅ **MongoDB** integration using **Mongoose**\
✅ **Environment-based configuration** support\
✅ **Centralized error handling** for better debugging

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Validation:** Joi / Mongoose
- **Authentication:** JWT
- **Security:** Bcrypt for password hashing
- **Test:** jest / supertest

## Installation

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/HassanEssam0110/Task-5-Authorization-Challenge.git
   cd Task-5-Authorization-Challenge
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Create `.env.development.local` and `.env.production.local` inside the `config` folder.
   - Example `.env` files are provided below.

## Environment Variables

Environment variables are stored in the `config` folder.

### `.env.development.local`

```env
#PORT
PORT=3000

# ENVIRONMENT
NODE_ENV="development"

# Database
MONGO_DB_URI="mongodb://127.0.0.1:27017/DB_Authorization_Challenge"

# JWT
JWT_SECRET="secretKey_goes_here"
JWT_EXPIRES_IN="30d"
JWT_COOKIES_EXPIRES_IN=30


# BYCRYPT
SALT_ROUNDS=10
```

### `.env.production.local`

```env
#PORT
PORT=443

# ENVIRONMENT
NODE_ENV="production"

# Database
MONGO_DB_URI="mongodb://127.0.0.1:27017/DB_Authorization_Challenge"

# JWT
JWT_SECRET="@t_secretKey_goes_here"
JWT_EXPIRES_IN="30d"
JWT_COOKIES_EXPIRES_IN=30


# BYCRYPT
SALT_ROUNDS=10
```

## Running the Application

### Development Mode

```sh
npm run start:dev
```

### Production Mode

```sh
npm run start:prod
```

**- Before using Test Mode, you need to seed the data.**

### Import Dummy Data

```sh
npm run  seed:import
```

### Delete Dummy Data

```sh
npm run seed:delete
```

### Test Mode

```sh
npm run test
```

## Usage

### API Base URL

- Development: `http://127.0.0.1:3000`
- Production: `http://127.0.0.1:443`

### Authentication

- Obtain a JWT token by logging in and include it in the `cookies` for protected routes.

  **OR**

- Obtain a JWT token by logging in and include it in the `Authorization` header for protected routes.

## API Endpoints

All endpoints are prefixed with `/api/v1`

### **Authentication**

| Method | Endpoint                | Access                |
| ------ | ----------------------- | --------------------- |
| POST   | `/api/v1/auth/register` | Public                |
| POST   | `/api/v1/auth/login`    | Public                |
| GET    | `/api/v1/users/getMe`   | Admin, Editor, Viewer |

#### Register a New User

**POST** `/api/v1/auth/register`

```json
{
  "username": "Jhon Deo",
  "email": "jhondeo77@email.com",
  "password": "Asd@1234",
  "confirmPassword": "Asd@1234"
}
```

#### Login

**POST** `/api/v1/auth/login`

```json
{
  "email": "jhondeo77@email.com",
  "password": "Asd@1234"
}
```

#### Get Current User

**GET** api/v1/users/getMe

Requires authentication with a valid token.

### **Books**

| Method | Endpoint                             | Access                |
| ------ | ------------------------------------ | --------------------- |
| POST   | `/api/v1/books`                      | Admin ,Editor         |
| GET    | `/api/v1/books`                      | Admin, Editor, Viewer |
| GET    | `/api/v1/books/:id`                  | Admin, Editor, Viewer |
| PUT    | `/api/v1/books/:id`                  | Admin ,Editor         |
| DELETE | `/api/v1/books/:id`                  | Admin                 |
| DELETE | `/api/v1/books/:id?softDelete=false` | Admin                 |

#### Create a New Book

**POST** `/api/v1/books`

```json
{
  "title": "Brave New World",
  "author": "Aldous Huxley",
  "publishedDate": "1932-08-01"
}
```

### **Roles**

| Method | Endpoint                             | Access |
| ------ | ------------------------------------ | ------ |
| POST   | `/api/v1/roles`                      | Admin  |
| GET    | `/api/v1/roles`                      | Admin  |
| GET    | `/api/v1/roles/:id`                  | Admin  |
| PUT    | `/api/v1/roles/:id`                  | Admin  |
| DELETE | `/api/v1/roles/:id`                  | Admin  |
| DELETE | `/api/v1/roles/:id?softDelete=false` | Admin  |

#### Create a New Role

**POST** `/api/v1/roles`

**Roles in this system** `"Amdin","Editor","Viewer"`

**permissions in this system** `"Read","Create","Update","Delete"`

```json
{
  "name": "Editor",
  "permissions": ["Read", "Create", "Update"]
}
```

## Role-Based Access Control

- **Admin**: Can perform all operations.
- **Editor**: Can Read, Create and Update Books.
- **Viewer**: Can only Read data (GET requests).

## Error Handling

The API returns appropriate HTTP status codes and messages for different scenarios:

- **400**: Bad Request
- **401**: Unauthorized (e.g., missing or invalid token)
- **403**: Forbidden (e.g., insufficient permissions)
- **404**: Not Found (e.g., resource does not exist)
- **422**: Unprocessable Entity (e.g., validation errors)
- **500**: Internal Server Error

## Dependencies

```json
{
  "bcryptjs": "^3.0.2",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "helmet": "^8.0.0",
  "joi": "^17.13.3",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.12.1",
  "morgan": "^1.10.0"
}
```

---

🚀 **Happy Coding!** 🚀
