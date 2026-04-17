"""Main Application Entry Point"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings, validate_settings
from app.database import test_connection, db
from app.routes import products, orders, ai

# =====================
# STARTUP/SHUTDOWN
# =====================

async def startup_event():
    """Run when app starts"""
    print("\n" + "="*50)
    print("🚀 AI FARM ADVISER BACKEND STARTING")
    print("="*50)
    
    validate_settings()
    print(f"✅ App: {settings.app_name} v{settings.app_version}")
    
    db.connect()
    test_connection()
    
    print("="*50 + "\n")

async def shutdown_event():
    """Run when app stops"""
    print("\n🛑 Shutting down...")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app startup and shutdown"""
    await startup_event()
    yield
    await shutdown_event()

# =====================
# CREATE APP
# =====================

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered agriculture platform",
    lifespan=lifespan
)

# =====================
# MIDDLEWARE
# =====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================
# ROUTES
# =====================

app.include_router(products.router, prefix="/api", tags=["products"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
app.include_router(ai.router, prefix="/api", tags=["ai"])

# =====================
# HEALTH CHECK
# =====================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    }

@app.get("/")
async def root():
    """API info"""
    return {
        "message": f"Welcome to {settings.app_name}",
        "docs": "/docs",
        "health": "/health"
    }

# =====================
# RUN
# =====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True
    )