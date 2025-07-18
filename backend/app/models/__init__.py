# This file makes the models directory a Python package
from .security import (
    PasswordStrengthRequest,
    PasswordStrengthResponse,
    PasswordBreachRequest,
    PasswordBreachResponse
)

__all__ = [
    "PasswordStrengthRequest",
    "PasswordStrengthResponse", 
    "PasswordBreachRequest",
    "PasswordBreachResponse"
]