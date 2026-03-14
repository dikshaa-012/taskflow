# TaskFlow — Full Stack Task Management App

A production-ready task management application built with **Next.js 14**, **MongoDB**, and **JWT authentication**. 

## 🚀 Live Demo
https://taskflow-blush-six.vercel.app/

## 📁 GitHub Repository
https://github.com/dikshaa-012/taskflow

---

## Test Credentials
A demo account is already registered. Use these to log in directly:

| Field | Value |
|-------|-------|
| Email | jane@example.com |
| Password | SecurePass1 |

> Go to [Sign In](https://taskflow-blush-six.vercel.app/login) — no need to register.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (HTTP-only cookies) |
| Password Hashing | bcryptjs (salt rounds: 12) |
| Payload Encryption | AES via crypto-js |
| Validation | Zod |
| Deployment | Vercel / Railway / Render |

---

## Architecture Overview

```
taskflow/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts   # POST /api/auth/register
│   │   │   │   ├── login/route.ts      # POST /api/auth/login
│   │   │   │   ├── logout/route.ts     # POST /api/auth/logout
│   │   │   │   └── me/route.ts         # GET  /api/auth/me
│   │   │   └── tasks/
│   │   │       ├── route.ts            # GET/POST /api/tasks
│   │   │       └── [id]/route.ts       # GET/PATCH/DELETE /api/tasks/:id
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Server-side auth guard
│   │   │   └── page.tsx               # Task list with search/filter/pagination
│   │   ├── layout.tsx
│   │   └── page.tsx                   # Landing page
│   ├── components/
│   │   ├── DashboardShell.tsx         # Sidebar layout
│   │   ├── TaskCard.tsx               # Individual task card
│   │   └── TaskModal.tsx              # Create/Edit modal
│   ├── lib/
│   │   ├── db.ts                      # MongoDB connection (singleton)
│   │   ├── jwt.ts                     # Token sign/verify utilities
│   │   ├── encryption.ts              # AES encrypt/decrypt
│   │   ├── validation.ts              # Zod schemas
│   │   ├── response.ts                # Standardized API responses
│   │   ├── models/
│   │   │   ├── User.ts                # User schema + bcrypt hook
│   │   │   └── Task.ts                # Task schema + indexes
│   │   └── middleware/
│   │       └── auth.ts                # withAuth HOC for API routes
│   └── middleware.ts                  # Next.js edge middleware (route protection)
```

### Security Architecture

1. **JWT in HTTP-only cookies** — tokens are never accessible via `document.cookie` (XSS protection)
2. **bcrypt hashing** — passwords hashed with salt rounds of 12 before storage
3. **AES-256 encryption** — sensitive payloads encrypted via `crypto-js`
4. **Zod validation** — all inputs validated server-side before DB queries
5. **Authorization checks** — every task query scoped to `userId` (prevents IDOR)
6. **Regex sanitization** — search input sanitized before regex construction
7. **Environment variables** — all secrets in `.env.local`, never hardcoded
8. **Edge middleware** — unauthenticated requests to `/dashboard` or `/api/*` blocked before hitting route handlers

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works) or local MongoDB

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your values (see below)

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

### Environment Variables

```env
# .env.local
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow
JWT_SECRET=your-long-random-secret-min-32-chars
ENCRYPTION_KEY=your-32-char-aes-key-exactly-here!
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Generating secrets:**
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption Key (must be exactly 32 chars for AES-256)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or via CLI:
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add ENCRYPTION_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

---

## API Documentation

### Base URL
```
https://your-deployed-url.vercel.app/api
```

### Authentication

All protected routes require a valid JWT cookie (set automatically on login).

---

### Auth Endpoints

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass1"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "An account with this email already exists"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "password": ["Password must contain at least one uppercase letter"]
  }
}
```

---

#### `POST /api/auth/login`
Log in and receive a JWT cookie.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass1"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```
> Sets `token` cookie: `HttpOnly; Secure; SameSite=Lax; Max-Age=604800`

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### `POST /api/auth/logout`
Clear the auth cookie.

**Success Response (200):**
```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

---

#### `GET /api/auth/me` 🔒
Get the authenticated user's profile.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2024-09-01T10:00:00.000Z"
    }
  }
}
```

---

### Task Endpoints

All task endpoints require authentication (🔒).

#### `GET /api/tasks` 🔒
List tasks with pagination, filtering, and search.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |
| `status` | string | `all` | Filter: `all`, `pending`, `in-progress`, `completed` |
| `search` | string | `` | Search by title (case-insensitive) |

**Example:**
```
GET /api/tasks?page=1&limit=9&status=pending&search=report
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "title": "Write weekly report",
      "description": "Summarize sprint progress",
      "status": "pending",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "createdAt": "2024-09-10T08:30:00.000Z",
      "updatedAt": "2024-09-10T08:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 23,
    "page": 1,
    "limit": 9,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### `POST /api/tasks` 🔒
Create a new task.

**Request Body:**
```json
{
  "title": "Design new landing page",
  "description": "Update hero section and add testimonials",
  "status": "in-progress"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "title": "Design new landing page",
      "description": "Update hero section and add testimonials",
      "status": "in-progress",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "createdAt": "2024-09-11T09:00:00.000Z",
      "updatedAt": "2024-09-11T09:00:00.000Z"
    }
  }
}
```

---

#### `GET /api/tasks/:id` 🔒
Get a single task by ID.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "title": "Design new landing page",
      "description": "Update hero section and add testimonials",
      "status": "in-progress",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "createdAt": "2024-09-11T09:00:00.000Z",
      "updatedAt": "2024-09-11T09:00:00.000Z"
    }
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### `PATCH /api/tasks/:id` 🔒
Update a task (partial update supported).

**Request Body (all fields optional):**
```json
{
  "title": "Design new landing page v2",
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "title": "Design new landing page v2",
      "description": "Update hero section and add testimonials",
      "status": "completed",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "createdAt": "2024-09-11T09:00:00.000Z",
      "updatedAt": "2024-09-11T11:30:00.000Z"
    }
  }
}
```

---

#### `DELETE /api/tasks/:id` 🔒
Delete a task.

**Success Response (200):**
```json
{
  "success": true,
  "data": { "message": "Task deleted successfully" }
}
```

---

### Error Response Format

All errors follow this structure:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": { } // optional: field-level validation errors
}
```

### HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 500 | Internal Server Error |

---

## Database Schema

### User
```
_id         ObjectId   (auto)
name        String     required, max 50
email       String     required, unique, lowercase
password    String     required, hashed (bcrypt), select: false
createdAt   Date       (auto)
updatedAt   Date       (auto)
```

### Task
```
_id          ObjectId   (auto)
title        String     required, max 100
description  String     max 500, default ""
status       String     enum: pending | in-progress | completed, default "pending"
userId       ObjectId   ref: User, indexed
createdAt    Date       (auto)
updatedAt    Date       (auto)

Indexes:
  - { userId: 1, status: 1 }  compound index
  - { title: "text" }          text search index
```

---

## Security Checklist

- [x] Passwords hashed with bcrypt (12 salt rounds)
- [x] JWT stored in HTTP-only cookies (no JS access)
- [x] Secure + SameSite flags on cookies in production
- [x] AES payload encryption available via `encrypt()`/`decrypt()`
- [x] Input validation on all endpoints (Zod)
- [x] Authorization: users can only access their own tasks
- [x] Mongoose parameterized queries (no raw string interpolation)
- [x] Regex input sanitized before use in queries
- [x] No secrets hardcoded (all in `.env.local`)
- [x] ObjectId validation before DB queries (prevents injection via ID param)
- [x] Edge middleware blocks unauthenticated requests early

---

## Evaluation Criteria Coverage

| Criterion | Implementation |
|-----------|---------------|
| Code Structure | Feature-based layout, TypeScript, HOC pattern for auth middleware |
| Auth & Security | JWT cookies, bcrypt, AES encryption, Zod validation, IDOR protection |
| Database Design | Indexed schemas, compound indexes, text search index |
| API Design | RESTful, consistent response format, proper HTTP status codes |
| Frontend & UX | Protected routes, search debounce, pagination, loading states, modals |
| Deployment | Vercel-ready, env vars documented, build tested |
| Documentation | This README + inline API docs |
