"""
PREHSG Contest Management Backend
FastAPI + SQLModel for data management
"""
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from contextlib import asynccontextmanager

from database import create_db_and_tables, engine
from models import Contest
from routers import contests as contests_router
from routers import auth as auth_router

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database and tables
    create_db_and_tables()
    yield
    # Shutdown: Cleanup if needed
    pass

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="PREHSG Contest Hub API",
    description="API for managing PREHSG contests",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for React development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://list.thptchuyenhatinh.edu.vn",
        "http://98.70.34.119:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contests_router.router)
app.include_router(auth_router.router)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "PREHSG Contest Hub API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "contests": "/contests",
        },
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
