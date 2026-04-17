# 🎓 BUILDING AI FARM ADVISER - STEP-BY-STEP FOR FRESHERS

## 📌 What This Guide Does

This is NOT just code. This is **how a senior engineer thinks about building apps**.

You'll learn:
- How to structure a project properly
- Why we make certain decisions
- Testing mindset (test after each step)
- Common mistakes freshers make
- Best practices used in real companies

---

## 🎯 Our Strategy

Instead of building everything at once, we'll build in **phases**:

```
Phase 1: Backend Foundation     (Organize code properly) ✅
Phase 2: Product APIs          (Core marketplace feature)
Phase 3: Frontend Integration  (Connect to real backend)
Phase 4: Order System          (Customer requests)
Phase 5: AI Integration        (Smart advice)
Phase 6: Testing & Deployment  (Make it production-ready)
```

Each phase:
- ✅ Has clear objectives
- ✅ Shows exact files to create
- ✅ Includes testing instructions
- ✅ Has Git commits to mark progress

---

# 🔧 PHASE 1: BACKEND FOUNDATION (Current Step)

## 🎯 Objective
Transform `main.py` from a single file into a **properly structured backend** that's:
- Easy to maintain
- Scalable
- Professional-grade
- Testable

## 📁 Current vs Target Structure

### ❌ BEFORE (What you have now)
```
backend/main.py
- Everything in one file
- Hard to maintain
- Hard to test
- Not scalable
```

### ✅ AFTER (What we're building)
```
backend/
├── main.py                    (Just imports and runs app)
├── requirements.txt           (Dependencies)
├── .env.example               (Config template)
│
└── app/
    ├── __init__.py           
    ├── config.py             (Supabase & env config)
    ├── database.py           (DB connection)
    ├── models.py             (Pydantic schemas)
    │
    └── routes/
        ├── __init__.py
        ├── products.py       (Product endpoints)
        ├── orders.py         (Order endpoints)
        └── ai.py             (AI endpoints)
```

## ✨ Why This Structure?

| Problem | Solution |
|---------|----------|
| Everything in main.py | Separate into routes/ |
| Config hardcoded | Move to config.py + .env |
| No data validation | Create schemas in models.py |
| Can't reuse code | Create app/ package |
| Hard to test | Each route file is testable |

---

## 📋 STEP 1.1: Create .env File (Store Secrets)

### The Concept
```
❌ WRONG:  key = "secret_abc123" in code
✅ RIGHT: key = os.getenv("SUPABASE_KEY") from .env file
```

**Why?**
- Keep secrets out of GitHub
- Easy to change per environment
- Different keys for dev/production

### What to Do
Create file: `backend/.env`

```
# Supabase Configuration
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_KEY=your_secret_key_here

# API Configuration
API_HOST=127.0.0.1
API_PORT=8000

# AI Configuration
OPENAI_API_KEY=your_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost/farm_db
```

**⚠️ NOTE:** Replace placeholder values with your actual credentials!
Never commit `.env` file to GitHub (it's in `.gitignore`)

Also create: `backend/.env.example` (template without secrets)
```
SUPABASE_URL=
SUPABASE_KEY=
OPENAI_API_KEY=
```

### Teaching Point
**In real companies:**
- `.env` is in `.gitignore` (never committed)
- `.env.example` is committed (shows what's needed)
- Different servers have different `.env` files
- This prevents accidentally leaking API keys

---

## 📋 STEP 1.2: Create Config File

### The Concept
```
One place to read all configuration
No hardcoding anything
Easy to switch between dev/prod
```

### Create File: `backend/app/config.py`

```python
"""
Configuration Management
========================

This file loads all settings from environment variables.
One place to manage all configuration.

Why this approach?
- Settings in one place
- Easy to switch between environments
- Type-safe with Pydantic
- Never hardcode secrets
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """All app settings loaded from environment"""
    
    # Supabase (Database)
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    
    # App Settings
    app_name: str = "AI Farm Adviser"
    app_version: str = "1.0.0"
    
    # API Server
    api_host: str = os.getenv("API_HOST", "127.0.0.1")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    
    # AI (OpenAI)
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS
    cors_origins: list = ["*"]  # Allow all for now
    
    class Config:
        env_file = ".env"  # Load from .env file
        case_sensitive = False

# Create single settings instance used throughout app
settings = Settings()

# Validation
def validate_settings():
    """Check required settings are present"""
    if not settings.supabase_url:
        raise ValueError("❌ SUPABASE_URL not set in .env")
    if not settings.supabase_key:
        raise ValueError("❌ SUPABASE_KEY not set in .env")
    print("✅ All required settings loaded successfully")

if __name__ == "__main__":
    validate_settings()
```

### Teaching Points

**What's happening:**
1. `BaseSettings` - Pydantic class for configuration
2. `os.getenv()` - Reads from .env file
3. `Settings()` - Creates single global config object
4. `validate_settings()` - Checks before app starts

**Why this pattern:**
- **DRY (Don't Repeat Yourself)** - Define settings once
- **Type Safety** - Pydantic validates config types
- **Centralized** - Change one file, it affects entire app
- **Testable** - Can inject different settings for tests

---

## 📋 STEP 1.3: Create Database Connection

### The Concept
```
Instead of creating Supabase connection in every file,
create it ONCE in database.py and import everywhere
```

### Create File: `backend/app/database.py`

```python
"""
Database Connection
===================

Central place to create and manage database connections.

Why?
- Don't repeat connection code
- Easy to swap database later
- Single source of truth
"""

from supabase import create_client
from app.config import settings

class Database:
    """Manages Supabase connection"""
    
    _instance = None  # Singleton pattern
    
    def __new__(cls):
        """Ensure only one database connection"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.client = None
        return cls._instance
    
    def connect(self):
        """Initialize Supabase connection"""
        if self.client is None:
            print("🔌 Connecting to Supabase...")
            self.client = create_client(
                settings.supabase_url,
                settings.supabase_key
            )
            print("✅ Connected to Supabase")
        return self.client
    
    def get_client(self):
        """Get existing connection"""
        if self.client is None:
            self.connect()
        return self.client

# Create global database instance
db = Database()

def get_supabase():
    """Function to get database connection"""
    return db.get_client()

def test_connection():
    """Test if database is working"""
    try:
        client = get_supabase()
        # Try a simple query
        response = client.table("products").select("count", count="exact").execute()
        print(f"✅ Database connected. Products count: {response.count or 0}")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
```

### Teaching Points

**Key Concepts:**
1. **Singleton Pattern** - Ensures only ONE database connection
2. **Why?** - Database connections are expensive. Don't create multiple.
3. **`get_supabase()`** - Anywhere in app, call this to use database

**In real companies:**
- Use connection pooling for scaling
- Health checks to monitor DB status
- Retry logic for network failures

---

## 📋 STEP 1.4: Create Data Models (Schemas)

### The Concept
```
Pydantic models validate incoming data
Ensure data is correct BEFORE processing
```

### Create File: `backend/app/models.py`

```python
"""
Data Models / Schemas
====================

Define what data looks like using Pydantic.

Why Pydantic?
- Validates data automatically
- Converts types (string "123" → int 123)
- Generates API documentation
- Catches errors before they reach database
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# =====================
# PRODUCT MODELS
# =====================

class ProductBase(BaseModel):
    """Base fields all product models share"""
    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    price: float = Field(..., gt=0, description="Price must be positive")
    location: str = Field(..., min_length=1, description="Farm location")
    category: str = Field(..., description="Product category")
    farming_method: str = Field(..., description="How it's grown")
    harvest_date: str = Field(..., description="Harvest date (YYYY-MM-DD)")

class ProductCreate(ProductBase):
    """Data when creating a new product"""
    farmer_id: Optional[int] = None

class ProductUpdate(BaseModel):
    """Data when updating product (all fields optional)"""
    name: Optional[str] = None
    price: Optional[float] = None
    location: Optional[str] = None
    category: Optional[str] = None
    farming_method: Optional[str] = None
    harvest_date: Optional[str] = None

class ProductResponse(ProductBase):
    """Product as returned from API"""
    id: int
    farmer_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True  # Allow reading from ORM objects

# =====================
# ORDER MODELS
# =====================

class OrderCreate(BaseModel):
    """Data when creating order"""
    product_id: int = Field(..., gt=0, description="Product ID")
    customer_id: int = Field(..., gt=0, description="Customer ID")

class OrderUpdate(BaseModel):
    """Data when updating order status"""
    status: str = Field(..., description="pending, accepted, rejected")

class OrderResponse(BaseModel):
    """Order as returned from API"""
    id: int
    product_id: int
    customer_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# =====================
# AI MODELS
# =====================

class AIMessage(BaseModel):
    """Message sent to AI"""
    message: str = Field(..., min_length=1, max_length=1000)
    context: Optional[str] = None

class AIResponse(BaseModel):
    """Response from AI"""
    response: str
    tokens_used: Optional[int] = None
```

### Teaching Points

**What each part does:**
```
Field(..., gt=0)              # Must be greater than 0
min_length=1, max_length=255  # String length validation
Optional[int]                 # Can be None or int
class Config: from_attributes # Read from database objects
```

**Why validation matters:**
```
❌ User submits: price = -100 (negative!)
   Without validation: Gets stored as negative
   With Pydantic: Rejected with error
   
✅ Pydantic catches errors EARLY
```

---

## 📋 STEP 1.5: Refactor main.py

### The Concept
```
Keep main.py small and clean
Just import and run
All logic goes to routes/
```

### Update File: `backend/main.py`

```python
"""
Main Application Entry Point
============================

This file:
1. Creates FastAPI app
2. Configures middleware
3. Imports all routes
4. Starts the server

Keep this file CLEAN and SHORT.
All business logic goes elsewhere.
"""

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
    
    # Validate configuration
    validate_settings()
    print(f"✅ App: {settings.app_name} v{settings.app_version}")
    
    # Connect to database
    db.connect()
    
    # Test database
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

# Include route modules
app.include_router(products.router, prefix="/api", tags=["products"])
app.include_router(orders.router, prefix="/api", tags=["orders"])
app.include_router(ai.router, prefix="/api", tags=["ai"])

# =====================
# HEALTH CHECK
# =====================

@app.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    }

# =====================
# ROOT
# =====================

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
```

### Teaching Points

**What's new:**
1. **lifespan()** - Manages startup/shutdown
2. **include_router()** - Adds routes from other files
3. **Middleware** - CORS configured from settings
4. **Health check** - Easy way to test if backend is running

---

## 📋 STEP 1.6: Create Routes Package

### The Concept
```
Each route file handles one resource type
products.py → all product endpoints
orders.py → all order endpoints
ai.py → all AI endpoints

Easy to maintain, extend, test
```

### Create File: `backend/app/routes/__init__.py`
(Empty file to make routes a Python package)

---

## ✅ TESTING PHASE 1

Now let's test if our reorganized backend works:

### TEST 1: Check Configuration
```bash
cd backend
python -c "from app.config import settings; settings.__repr__()"
```

**Expected:** No errors, settings loaded

### TEST 2: Test Database Connection
```bash
python -c "from app.database import test_connection; test_connection()"
```

**Expected:** `✅ Database connected`

### TEST 3: Start Backend
```bash
python -m uvicorn main:app --reload
```

**Expected Output:**
```
🚀 AI FARM ADVISER BACKEND STARTING
==================================================
✅ App: AI Farm Adviser v1.0.0
🔌 Connecting to Supabase...
✅ Connected to Supabase
✅ Database connected. Products count: 0
==================================================

INFO:     Uvicorn running on http://127.0.0.1:8000
```

### TEST 4: Visit API
Open browser: `http://localhost:8000`

**Expected:** 
```json
{
  "message": "Welcome to AI Farm Adviser",
  "docs": "/docs",
  "health": "/health"
}
```

### TEST 5: Health Check
Open: `http://localhost:8000/health`

**Expected:**
```json
{
  "status": "healthy",
  "app": "AI Farm Adviser",
  "version": "1.0.0"
}
```

---

## 🎓 WHAT YOU LEARNED

| Concept | Why It Matters |
|---------|---------------|
| `.env` file | Secrets stay secret |
| `config.py` | Settings in one place |
| `database.py` | Connection pooling, singleton |
| `models.py` | Data validation |
| Organized routes | Easy to maintain |
| Middleware | Security & CORS handling |

---

## 🔄 Now Create These Files

Instructions:
1. Create `backend/.env` with Supabase credentials
2. Create `backend/app/config.py` (code above)
3. Create `backend/app/database.py` (code above)
4. Create `backend/app/models.py` (code above)
5. Update `backend/main.py` (code above)
6. Create `backend/app/routes/__init__.py` (empty)
7. Run tests above

## 📝 Next Phase

Once tests pass, we'll build:
- **Phase 2: Product APIs** - Actual endpoints to create/read/update/delete products

---

## 🐛 Troubleshooting

### Error: ModuleNotFoundError
```
from app.config import settings

Fix: Make sure you're running from backend/ directory
cd backend && python -m uvicorn main:app --reload
```

### Error: .env file not found
```
Fix: Create backend/.env with your Supabase credentials
```

### Error: SUPABASE_URL not set
```
Fix: Check .env file has:
SUPABASE_URL=https://...
SUPABASE_KEY=sb_secret_...
```

---

**You're now building like a professional engineer!** 🎯

