from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings  # Import from app.config since we're running from backend/
from app.routers import security  # Import from app.routers since we're running from backend/
import os
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi import Request

# Create FastAPI app
app = FastAPI(
    title="PassVault API",
    description="Secure password management and analysis API",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
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

@app.api_route("/",methods=["GET", "HEAD"])
async def root(request:Request):
    if request.method == "HEAD":
        return JSONResponse(content=None, status_code=200)
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

@app.get("/api/health/db")
async def database_health():
    try:
        return {
            "status": "db_healthy",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail="Database unhealthy")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"Global exception: {exc}")
    return HTTPException(
        status_code=500,
        detail="An unexpected error occurred. Please try again later."
    )

@app.on_event("startup")
async def startup_event():
    print("PassVault API starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    print("PassVault API shutting down...")