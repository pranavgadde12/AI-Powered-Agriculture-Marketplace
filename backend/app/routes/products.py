"""Product Routes - All product-related endpoints"""

from fastapi import APIRouter, HTTPException
from app.database import get_supabase
from app.models import ProductCreate, ProductResponse

router = APIRouter()

@router.get("/products", response_model=list[ProductResponse])
async def get_all_products():
    """Get all products from marketplace"""
    try:
        supabase = get_supabase()
        response = supabase.table("products").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int):
    """Get specific product"""
    try:
        supabase = get_supabase()
        response = supabase.table("products").select("*").eq("id", product_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/products", response_model=dict)
async def create_product(product: ProductCreate):
    """Create new product (for farmers)"""
    try:
        supabase = get_supabase()
        response = supabase.table("products").insert({
            "name": product.name,
            "price": product.price,
            "location": product.location,
            "category": product.category,
            "farming_method": product.farming_method,
            "harvest_date": product.harvest_date,
            "farmer_id": product.farmer_id,
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create product")
        
        return {"message": "✅ Product created", "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/products/{product_id}")
async def delete_product(product_id: int):
    """Delete product"""
    try:
        supabase = get_supabase()
        response = supabase.table("products").delete().eq("id", product_id).execute()
        return {"message": "✅ Product deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
