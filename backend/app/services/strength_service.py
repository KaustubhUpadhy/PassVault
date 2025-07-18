from zxcvbn import zxcvbn
from typing import Optional

def check_password_strength(
    password: str,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    email: Optional[str] = None
) -> dict:
    """
    Check password strength using zxcvbn algorithm
    """
    user_inputs = []
    if first_name:
        user_inputs.append(first_name)
    if last_name:
        user_inputs.append(last_name)
    if email:
        user_inputs.append(email)
    user_inputs.extend([
        "password",
        "123456",
        "qwerty", 
        "letmein",
        "admin",
        "welcome",
        "MyPassword",
        "login",
        "user",
        "guest",
        "test",
        "master",
        "root",
        "pass",
        "abc123",
        "password123",
        "admin123",
        "welcome123"
    ])
    results = zxcvbn(password, user_inputs=user_inputs)

    score = results["score"]
    crack_times = results["crack_times_display"]
    feedback = results["feedback"]
    
    strength_labels = {
        0: "Poor",
        1: "Low", 
        2: "Moderate",
        3: "Great",
        4: "Excellent"
    }
    
    return {
        "score": score,
        "strength_label": strength_labels.get(score, "Unknown"),
        "online_crack_time": crack_times["online_no_throttling_10_per_second"],
        "offline_crack_time": crack_times["offline_fast_hashing_1e10_per_second"],
        "warning": feedback.get("warning", ""),
        "suggestions": feedback.get("suggestions", [])
    }