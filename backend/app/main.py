from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings  # Fixed import path
from routers import security  # Fixed import path
import os
from datetime import datetime

# Create FastAPI app
app = FastAPI(
    title="PassVault API",
    description="Secure password management and analysis API",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,  # Hide docs in prod
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(security.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "PassVault API is running",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "service": "PassVault API"
    }

# Add a database health check endpoint
@app.get("/api/health/db")
async def database_health():
    try:
        # Add any database ping here if you have one
        return {
            "status": "db_healthy",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail="Database unhealthy")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"Global exception: {exc}")  # For debugging
    return HTTPException(
        status_code=500,
        detail="An unexpected error occurred. Please try again later."
    )

# Add startup event
@app.on_event("startup")
async def startup_event():
    print("PassVault API starting up...")

# Add shutdown event  
@app.on_event("shutdown")
async def shutdown_event():
    print("PassVault API shutting down...")