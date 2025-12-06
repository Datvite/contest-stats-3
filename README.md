# PREHSG Contest Hub Setup

This file documents the complete setup and structure of the PREHSG Contest Hub application.

## Project Overview

Full-stack web application for managing PREHSG contests with:
- Modern React + Vite frontend
- FastAPI backend with SQLModel ORM
- SQLite database
- Complete CRUD admin panel
- Beautiful UI with Tailwind CSS + shadcn/ui

## Directory Structure

```
contest-stats-3/
├── frontend/                          # React Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx             # Main navigation
│   │   │   ├── Sidebar.tsx            # Year accordion sidebar
│   │   │   ├── ContestCard.tsx        # Contest display card
│   │   │   ├── AdminPanel.tsx         # Admin CRUD interface
│   │   │   └── Button.tsx             # Custom button component
│   │   ├── pages/
│   │   │   ├── HomePage.tsx           # Main page
│   │   │   └── AdminPage.tsx          # Admin page
│   │   ├── lib/
│   │   │   └── api.ts                 # Axios API client
│   │   ├── App.tsx                    # Router setup
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── package.json                   # Dependencies
│   ├── vite.config.ts                 # Vite config
│   ├── tailwind.config.js             # Tailwind config
│   ├── postcss.config.js              # PostCSS config
│   ├── tsconfig.json                  # TypeScript config
│   ├── index.html                     # HTML template
│   └── README.md
│
├── backend/                           # FastAPI application
│   ├── main.py                        # FastAPI app + routes
│   ├── database.py                    # DB configuration
│   ├── models.py                      # SQLModel definitions
│   ├── init_db.py                     # DB initialization
│   ├── routers/
│   │   ├── __init__.py
│   │   └── contests.py                # Contest CRUD routes
│   ├── requirements.txt               # Python dependencies
│   ├── contest_hub.db                 # SQLite database (created on first run)
│   └── README.md
│
└── README.md                          # This file
```

## Installation & Running

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database with sample data
python init_db.py

# Run server (should print "Application startup complete" at http://0.0.0.0:8000)
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend running at**: `http://localhost:8000`
**API Docs**: `http://localhost:8000/docs`

### Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend running at**: `http://localhost:5173`

## Component Overview

### Frontend Components

#### Header.tsx
- Main navigation bar
- Class selection buttons (9, 10, 11, 12)
- Admin button
- Sticky positioning
- Smooth animations

#### Sidebar.tsx
- Year-based accordion (Radix UI)
- Dynamically populated from API
- Filters contests by selected class
- Shows Pre #1, Pre #2, Pre #3 for each year

#### ContestCard.tsx
- Individual contest display
- Shows contest name and pre number
- Contest and Solution buttons
- Hover animations with Framer Motion
- Smooth transitions

#### AdminPanel.tsx
- Complete CRUD interface
- Modal dialog for add/edit
- Table view of all contests
- Delete with confirmation
- Form validation
- Error handling

#### Button.tsx
- Custom button component (shadcn/ui pattern)
- Multiple variants: default, outline, ghost, destructive
- Multiple sizes: default, sm, lg

### Frontend Pages

#### HomePage.tsx
- Main page with class selection
- Displays sidebar when class is selected
- Fetches contests from API
- Responsive layout

#### AdminPage.tsx
- Dedicated admin interface
- Back button to home
- Includes AdminPanel component

### Backend Routes

#### GET /contests
Returns all contests, ordered by year (descending) and pre number.

Response:
```json
[
  {
    "id": 1,
    "class_level": 9,
    "year": 2025,
    "pre_number": 1,
    "contest_url": "https://...",
    "solution_url": "https://..."
  }
]
```

#### POST /contests
Creates new contest. Returns created contest with ID.

Request body:
```json
{
  "class_level": 9,
  "year": 2025,
  "pre_number": 1,
  "contest_url": "https://example.com/contest",
  "solution_url": "https://example.com/solution"
}
```

#### PUT /contests/{id}
Updates existing contest.

#### DELETE /contests/{id}
Deletes contest (returns 204 No Content).

#### GET /contests/class/{class_level}
Gets contests for specific class (9-12).

#### GET /contests/year/{year}
Gets contests for specific year.

#### GET /health
Health check endpoint.

#### GET /
API information endpoint.

## API Client

The frontend uses axios (`src/lib/api.ts`):

```typescript
import { api } from '../lib/api';

// GET
const response = await api.get('/contests');

// POST
await api.post('/contests', contestData);

// PUT
await api.put(`/contests/${id}`, updatedData);

// DELETE
await api.delete(`/contests/${id}`);
```

## Database

SQLite database with SQLModel ORM. Schema:

```
Table: contests
- id (Integer, Primary Key)
- class_level (Integer, 9-12)
- year (Integer, 2000-2100)
- pre_number (Integer, 1-3)
- contest_url (String)
- solution_url (String)
```

Sample data is loaded via `init_db.py` with contests for:
- Classes 9, 10, 11, 12
- Years 2024, 2025
- Pre #1, Pre #2, Pre #3 for each class/year

## Configuration Files

### Frontend

**vite.config.ts**: Vite build configuration with API proxy
- Proxy `/api` requests to `http://localhost:8000`
- Development server on port 5173

**tailwind.config.js**: Tailwind CSS configuration
- Inter font
- Custom background color (#f9fafb)
- Animation keyframes for accordion
- Responsive breakpoints

**tsconfig.json**: TypeScript configuration
- ES2020 target
- Strict mode enabled
- JSX support

**postcss.config.js**: PostCSS with Tailwind and Autoprefixer

### Backend

**main.py**: FastAPI application
- CORS middleware for development
- Routers included
- Lifespan context for startup/shutdown
- Health check and info endpoints

**database.py**: Database configuration
- SQLite connection
- Session dependency
- Table creation

**models.py**: SQLModel definitions
- ContestBase: Base fields
- Contest: Database model
- ContestCreate: Request model
- ContestUpdate: Update model
- ContestRead: Response model

## Styling & Design

- **Font**: Inter (from Google Fonts)
- **Framework**: TailwindCSS
- **Components**: shadcn/ui patterns
- **Animations**: Framer Motion
- **Background**: #f9fafb (light gray)
- **Primary**: Blue (#3b82f6)
- **Spacing**: Large (gap-6, p-6)
- **Border Radius**: xl (0.75rem)
- **Shadows**: md on cards, lg on hover

## Animations

- Header slide down on load
- Sidebar slide in from left
- Contest cards fade in with slight upward movement
- Hover effects with shadow increase
- Dialog overlays with backdrop blur
- Table rows animate on add/delete

## Development Features

### Frontend
- ✅ Hot Module Replacement (HMR)
- ✅ TypeScript strict mode
- ✅ ESLint configured
- ✅ Vite optimized builds

### Backend
- ✅ Auto-reload with `--reload` flag
- ✅ SQLAlchemy echo for SQL debugging (disabled by default)
- ✅ Type hints throughout
- ✅ Interactive API docs (Swagger)

## Common Tasks

### Add a New Contest

**Via Admin Panel**:
1. Click "Admin" button
2. Click "Add Contest"
3. Fill form with class, year, pre number, URLs
4. Click "Add"

**Via API**:
```bash
curl -X POST http://localhost:8000/contests \
  -H "Content-Type: application/json" \
  -d '{
    "class_level": 9,
    "year": 2025,
    "pre_number": 1,
    "contest_url": "https://example.com",
    "solution_url": "https://example.com"
  }'
```

### Edit a Contest

Via Admin Panel: Click edit icon in table row

### Delete a Contest

Via Admin Panel: Click delete icon with confirmation

### View API Documentation

Visit `http://localhost:8000/docs` when backend is running.

## Troubleshooting

### Frontend won't load
- Ensure backend is running on port 8000
- Check that npm dependencies are installed: `npm install`
- Clear browser cache or use incognito mode

### Backend port already in use
- Kill process on port 8000 or use different port:
  ```bash
  python -m uvicorn main:app --port 8001
  ```

### Database not initialized
- Run `python init_db.py` to create tables and sample data

### API calls failing
- Check CORS configuration in `main.py`
- Verify backend is running: `curl http://localhost:8000/health`
- Check browser console for detailed error

## Production Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, or static host
```

### Backend
```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://user:password@host/dbname"
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

## Next Steps

1. ✅ Backend and Frontend setup complete
2. ✅ CRUD operations working
3. ✅ Beautiful UI with animations
4. Consider: Authentication, database backup, monitoring

---

**Setup Complete! 🎉**

Both frontend and backend are now ready to use. Open `http://localhost:5173` in your browser.
