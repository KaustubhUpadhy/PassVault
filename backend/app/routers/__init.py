# This file makes the routers directory a Python package
from .security import router as security_router

__all__ = [
    "security_router"
]