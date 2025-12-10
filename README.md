# PREHSG Contest Hub - API Documentation

**Version**: 1.0.0  
**Base URL**: `http://localhost:8000`  
**Frontend URL**: `http://localhost:5173`  
**Admin Panel**: `http://localhost:5173/a9F2kQ7mB41xZp8tR0Ls/`

---

## Quick Links

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Responses](#error-responses)
- [Examples](#examples)
- [Tech Stack](#tech-stack)

---

## Getting Started

### Prerequisites
```
Node.js 18+
Python 3.9+
```

### Installation

**Option 1: Automated (Windows)**
```bash
setup.bat
```

**Option 2: Manual Setup**

Backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
python -m uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Access Points
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Server | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |
| Admin Panel | http://localhost:5173/a9F2kQ7mB41xZp8tR0Ls/ |

---

## Authentication

### Login Endpoint

**POST** `/auth/login`

**Request Body**:
```json
{
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Token Usage**:
All protected endpoints require the Authorization header:
```
Authorization: Bearer {access_token}
```

**Token Expiration**: 30 minutes

**Default Password**: `chtcoder@prehsg`

---

## API Endpoints

### Contests

#### GET /contests

**Description**: Retrieve all contests with solutions

**Authentication**: None (Public)

**Query Parameters**: None

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "class_level": 9,
    "year": 2024,
    "pre_number": 1,
    "contest_url": "https://example.com/contest",
    "solution_url": "https://example.com/solution",
    "solutions": [
      {
        "id": 1,
        "contest_id": 1,
        "item_number": 1,
        "title": "Bài 1",
        "solution_url": "https://example.com/bai1"
      }
    ]
  }
]
```

**Cache**: Enabled (invalidated on mutations)

**cURL Example**:
```bash
curl -X GET http://localhost:8000/contests
```

---

#### POST /contests

**Description**: Create a new contest

**Authentication**: Required ✓

**Request Body**:
```json
{
  "class_level": 9,
  "year": 2025,
  "pre_number": 1,
  "contest_url": "https://example.com/contest",
  "solution_url": "https://example.com/solution"
}
```

**Response** (201 Created):
```json
{
  "id": 15,
  "class_level": 9,
  "year": 2025,
  "pre_number": 1,
  "contest_url": "https://example.com/contest",
  "solution_url": "https://example.com/solution",
  "solutions": []
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/contests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "class_level": 9,
    "year": 2025,
    "pre_number": 1,
    "contest_url": "https://example.com/contest",
    "solution_url": "https://example.com/solution"
  }'
```

---

#### PUT /contests/{id}

**Description**: Update an existing contest

**Authentication**: Required ✓

**Path Parameters**:
- `id` (integer, required): Contest ID

**Request Body**:
```json
{
  "class_level": 9,
  "year": 2025,
  "pre_number": 1,
  "contest_url": "https://example.com/contest",
  "solution_url": "https://example.com/solution"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "class_level": 9,
  "year": 2025,
  "pre_number": 1,
  "contest_url": "https://example.com/contest",
  "solution_url": "https://example.com/solution",
  "solutions": [...]
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:8000/contests/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "class_level": 9,
    "year": 2025,
    "pre_number": 1,
    "contest_url": "https://example.com/contest",
    "solution_url": "https://example.com/solution"
  }'
```

---

#### DELETE /contests/{id}

**Description**: Delete a contest (cascade deletes solutions)

**Authentication**: Required ✓

**Path Parameters**:
- `id` (integer, required): Contest ID

**Response** (204 No Content)

**cURL Example**:
```bash
curl -X DELETE http://localhost:8000/contests/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Solutions

#### GET /contests/{id}/solutions

**Description**: Get all solutions for a specific contest

**Authentication**: None (Public)

**Path Parameters**:
- `id` (integer, required): Contest ID

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "contest_id": 1,
    "item_number": 1,
    "title": "Bài 1",
    "solution_url": "https://example.com/bai1"
  },
  {
    "id": 2,
    "contest_id": 1,
    "item_number": 2,
    "title": "Bài 2",
    "solution_url": "https://example.com/bai2"
  }
]
```

**cURL Example**:
```bash
curl -X GET http://localhost:8000/contests/1/solutions
```

---

#### POST /contests/{id}/solutions

**Description**: Add a solution to a contest

**Authentication**: Required ✓

**Path Parameters**:
- `id` (integer, required): Contest ID

**Request Body**:
```json
{
  "item_number": 1,
  "title": "Bài 1",
  "solution_url": "https://example.com/bai1"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "contest_id": 1,
  "item_number": 1,
  "title": "Bài 1",
  "solution_url": "https://example.com/bai1"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/contests/1/solutions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_number": 1,
    "title": "Bài 1",
    "solution_url": "https://example.com/bai1"
  }'
```

---

#### DELETE /contests/{id}/solutions/{solution_id}

**Description**: Delete a solution

**Authentication**: Required ✓

**Path Parameters**:
- `id` (integer, required): Contest ID
- `solution_id` (integer, required): Solution ID

**Response** (204 No Content)

**cURL Example**:
```bash
curl -X DELETE http://localhost:8000/contests/1/solutions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Data Models

### Contest Model

```json
{
  "id": "integer (auto-generated)",
  "class_level": "integer (required)",
  "year": "integer (required)",
  "pre_number": "integer (required)",
  "contest_url": "string (required)",
  "solution_url": "string (required)",
  "solutions": "Solution[] (nested, auto-populated)"
}
```

**Constraints**:
- `class_level`: 6-12
- `year`: Current year or future
- `pre_number`: 1+

---

### Solution Model

```json
{
  "id": "integer (auto-generated)",
  "contest_id": "integer (foreign key, required)",
  "item_number": "integer (required)",
  "title": "string (required)",
  "solution_url": "string (required)"
}
```

**Constraints**:
- CASCADE DELETE when contest is deleted
- `item_number`: Unique per contest

---

### Token Response

```json
{
  "access_token": "string (JWT token)",
  "token_type": "string (always 'bearer')"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request body or parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid password or token"
}
```

### 403 Forbidden
```json
{
  "detail": "Token expired or invalid"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Examples

### Complete Workflow: Admin Creates Contest with Solutions

**Step 1: Login**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "chtcoder@prehsg"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Step 2: Create Contest**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8000/contests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "class_level": 9,
    "year": 2025,
    "pre_number": 1,
    "contest_url": "https://example.com/contest",
    "solution_url": "https://example.com/solution"
  }'
```

Response:
```json
{
  "id": 1,
  "class_level": 9,
  "year": 2025,
  "pre_number": 1,
  "contest_url": "https://example.com/contest",
  "solution_url": "https://example.com/solution",
  "solutions": []
}
```

**Step 3: Add Solutions**
```bash
curl -X POST http://localhost:8000/contests/1/solutions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_number": 1,
    "title": "Bài 1",
    "solution_url": "https://example.com/bai1"
  }'
```

**Step 4: Verify Contest with Solutions**
```bash
curl -X GET http://localhost:8000/contests
```

Response includes contest with nested solutions array.

---

## Tech Stack

### Frontend
- **React** 18.2.0 - UI Framework
- **TypeScript** 5.2.2 - Type Safety
- **Vite** 5.0 - Build Tool
- **Tailwind CSS** 3.3.6 - Styling
- **React Router** 6.18 - Routing
- **Axios** 1.6.2 - HTTP Client
- **Radix UI** - Component Library
- **Lucide React** - Icons

### Backend
- **FastAPI** 0.104.1 - Web Framework
- **SQLModel** 0.0.14 - ORM
- **SQLAlchemy** 2.0.23 - Database Layer
- **Uvicorn** 0.24.0 - ASGI Server
- **SQLite** - Database
- **Python 3.9+** - Runtime

### Features
- ✅ Token-based Authentication (JWT)
- ✅ In-Memory Caching with Invalidation
- ✅ Database Indexing (Fast Queries)
- ✅ GZIP Compression
- ✅ Cascade Delete Relationships
- ✅ Real-time CRUD Operations
- ✅ Secret URL Admin Panel
- ✅ Password Protection
- ✅ Token Expiration (30 min)

---

## Admin Panel

**URL**: `http://localhost:5173/a9F2kQ7mB41xZp8tR0Ls/`

**Features**:
- ✅ Create/Read/Update/Delete Contests
- ✅ Manage Solutions per Contest
- ✅ Real-time List Updates
- ✅ Token-based Authorization
- ✅ Cascade Delete Protection

**Password**: `chtcoder@prehsg`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python 3.9+, verify FastAPI installed, check port 8000 |
| Frontend won't start | Check Node 18+, delete node_modules, reinstall, check port 5173 |
| Database errors | Delete contest_hub.db, run init_db.py |
| Admin panel not loading | Verify URL, check backend running, verify password |
| Token expired | Re-login at admin panel |

---

## Project Structure

```
contest-stats-3/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/          # React Components
│   │   ├── pages/               # Page Components
│   │   ├── lib/                 # Utilities (api.ts)
│   │   └── App.tsx              # Main Router
│   └── package.json
│
├── backend/                     # FastAPI
│   ├── main.py                  # App Setup
│   ├── models.py                # Data Models
│   ├── database.py              # DB Config
│   ├── cache.py                 # Cache System
│   ├── routers/                 # API Routes
│   ├── requirements.txt
│   └── contest_hub.db           # SQLite Database
│
├── README.md                    # This File
├── setup.bat                    # Windows Setup
└── setup.sh                     # Linux/Mac Setup
```

---

## API Rate Limits

- **GET /contests**: 1000 requests/hour (cached after first request)
- **Authenticated endpoints**: 100 requests/hour per token
- **Token lifetime**: 30 minutes

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API Docs at http://localhost:8000/docs
3. Check application logs
4. Verify all prerequisites are installed

---

**Version**: 1.0.0  
**Last Updated**: December 10, 2025  
**Status**: Production Ready ✅
