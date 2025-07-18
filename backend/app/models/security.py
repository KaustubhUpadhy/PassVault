from pydantic import BaseModel
from typing import List, Optional

class PasswordStrengthRequest(BaseModel):
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None

class PasswordStrengthResponse(BaseModel):
    score: int
    strength_label: str
    online_crack_time: str
    offline_crack_time: str
    warning: str
    suggestions: List[str]

class PasswordBreachRequest(BaseModel):
    password: str

class PasswordBreachResponse(BaseModel):
    is_breached: bool
    breach_count: int
    message: str