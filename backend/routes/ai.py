from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from core.deps import is_admin
import google.generativeai as genai
import os

router = APIRouter()

class DescriptionRequest(BaseModel):
    productName: str
    category: str = "jewelry"

@router.post("/generate-description")
async def generate_description(data: DescriptionRequest, user=Depends(is_admin)):
    try:
        # Load API Key
        api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Google Gemini API key is missing")

        genai.configure(api_key=api_key)

        # *** CHANGE THIS LINE ***
        model = genai.GenerativeModel("gemini-1.5-flash-latest") 
        # **********************

        prompt = (
            f"Write a compelling and elegant product description for a {data.category} product "
            f"named '{data.productName}' that will be used in an eCommerce website. "
            "Keep it within 2-4 sentences and use persuasive language."
        )

        response = model.generate_content(prompt)
        description = response.text.strip()

        return {"description": description}

    except Exception as e:
        # Add more specific logging for debugging
        print(f"AI generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")