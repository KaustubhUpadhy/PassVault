from fastapi import APIRouter, HTTPException
from app.models.security import (
    PasswordStrengthRequest, 
    PasswordStrengthResponse,
    PasswordBreachRequest,
    PasswordBreachResponse
)
from app.services.strength_service import check_password_strength
from app.services.breach_service import check_password_breach

router = APIRouter(prefix="/security", tags=["security"])

@router.post("/strength", response_model=PasswordStrengthResponse)
async def analyze_password_strength(request: PasswordStrengthRequest):
    """
    Analyze password strength using zxcvbn algorithm
    """
    try:
        result = check_password_strength(
            password=request.password,
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email
        )
        return PasswordStrengthResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing password strength: {str(e)}")

@router.post("/breach", response_model=PasswordBreachResponse)
async def check_breach(request: PasswordBreachRequest):
    """
    Check if password has been compromised in data breaches
    """
    try:
        result = check_password_breach(request.password)
        return PasswordBreachResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking password breach: {str(e)}")