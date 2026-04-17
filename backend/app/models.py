"""Data Models - Using Pydantic for validation"""

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
    """Data when updating product"""
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
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

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
    created_at: Optional[datetime] = None
    
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
