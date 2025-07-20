from fastapi import APIRouter, HTTPException
from app.models.security import (
    PasswordGeneratorRequest,
    PasswordGeneratorResponse,
    PasswordStrengthRequest, 
    PasswordStrengthResponse,
    PasswordBreachRequest,
    PasswordBreachResponse
)
from app.services.generator_service import generate_secure_password
from app.services.strength_service import check_password_strength
from app.services.breach_service import check_password_breach

router = APIRouter(prefix="/security", tags=["security"])

@router.post("/generate", response_model=PasswordGeneratorResponse)
async def generate_password(request: PasswordGeneratorRequest):
    """
    Generate a secure password with specified parameters
    """
    try:
        # Validate length
        if not 12 <= request.length <= 50:
            raise HTTPException(status_code=400, detail="Password length must be between 12 and 50 characters")
        
        result = generate_secure_password(
            length=request.length,
            include_uppercase=request.include_uppercase,
            include_lowercase=request.include_lowercase,
            include_numbers=request.include_numbers,
            include_symbols=request.include_symbols
        )
        return PasswordGeneratorResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating password: {str(e)}")

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