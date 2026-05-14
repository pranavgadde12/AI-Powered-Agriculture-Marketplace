"""AI Routes - AI assistant endpoints"""

import anthropic
from fastapi import APIRouter, HTTPException
from app.models import AIMessage, AIResponse
from app.config import settings

router = APIRouter()

FARMER_PROMPT = """You are an expert agriculture advisor.
Help farmers with: crop selection, soil health, pest control, irrigation, and livestock care.
Give practical, clear, step-by-step advice. Keep responses concise and actionable."""

CUSTOMER_PROMPT = """You are a food transparency assistant.
Given product data (location, farming method, harvest date),
explain how the product was grown and why it's trustworthy.
Build confidence in the customer. Keep responses concise."""

@router.post("/ai/chat", response_model=AIResponse)
async def chat_with_ai(message: AIMessage):
    """Chat with AI farming advisor"""
    if not settings.anthropic_api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not set in .env")

    try:
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

        system_prompt = FARMER_PROMPT if message.mode == "farmer" else CUSTOMER_PROMPT

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": message.message}],
        )

        return AIResponse(
            response=response.content[0].text,
            tokens_used=response.usage.input_tokens + response.usage.output_tokens,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
