"""AI Routes - AI assistant endpoints"""

from fastapi import APIRouter, HTTPException
from app.models import AIMessage, AIResponse

router = APIRouter()

@router.post("/ai/chat", response_model=AIResponse)
async def chat_with_ai(message: AIMessage):
    """Chat with AI farming advisor"""
    try:
        # For now, return a placeholder response
        # In Phase 5, we'll integrate with OpenAI
        
        return AIResponse(
            response="🤖 AI integration coming soon! Your message: " + message.message,
            tokens_used=0
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
