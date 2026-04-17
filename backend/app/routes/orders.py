"""Order Routes - Order management endpoints"""

from fastapi import APIRouter, HTTPException
from app.database import get_supabase
from app.models import OrderCreate, OrderResponse

router = APIRouter()

@router.get("/orders")
async def get_all_orders():
    """Get all orders"""
    try:
        supabase = get_supabase()
        response = supabase.table("orders").select("*").execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/orders")
async def create_order(order: OrderCreate):
    """Create new order request"""
    try:
        supabase = get_supabase()
        response = supabase.table("orders").insert({
            "product_id": order.product_id,
            "customer_id": order.customer_id,
            "status": "pending"
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create order")
        
        return {"message": "✅ Order created", "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/orders/{order_id}")
async def update_order_status(order_id: int, status: str):
    """Update order status"""
    try:
        supabase = get_supabase()
        response = supabase.table("orders").update({
            "status": status
        }).eq("id", order_id).execute()
        
        return {"message": f"✅ Order status updated to {status}", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
