from fastapi import APIRouter
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/")
async def generate(data: dict):
    blueprint = data.get("blueprint")

    if not blueprint:
        return {"generated_paper": []}

    return AIService.generate_questions(blueprint)