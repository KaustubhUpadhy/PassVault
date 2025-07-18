import hashlib
import requests
from typing import Union

def hash_password(password: str) -> str:
    """Hash password using SHA1"""
    hashed_password = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
    return hashed_password

def api_search(prefix_5: str) -> str:
    """Search HaveIBeenPwned API with first 5 characters of hash"""
    url = f"https://api.pwnedpasswords.com/range/{prefix_5}"
    
    try:
        response = requests.get(url, timeout=10)  # Add timeout
        if response.status_code != 200:
            raise RuntimeError(f"API error: {response.status_code}")
        return response.text
    except requests.exceptions.Timeout:
        raise RuntimeError("Request timeout - HaveIBeenPwned API is slow")
    except requests.exceptions.ConnectionError:
        raise RuntimeError("Connection error - Check your internet connection")

def check_breach_count(api_response: str, suffix: str) -> int:
    """Check if password hash suffix exists in breach database"""
    hashes = (line.split(':') for line in api_response.splitlines())
    for h, count in hashes:
        if h == suffix:
            return int(count)
    return 0

def check_password_breach(password: str) -> dict:
    """
    Check if password has been breached using HaveIBeenPwned API
    """
    try:
        hashed_password = hash_password(password)
        prefix, suffix = hashed_password[:5], hashed_password[5:]
        response = api_search(prefix)
        count = check_breach_count(response, suffix)
        
        if count > 0:
            return {
                "is_breached": True,
                "breach_count": count,
                "message": f"This password has been found in {count:,} data breaches."
            }
        else:
            return {
                "is_breached": False,
                "breach_count": 0,
                "message": "This password has not been found in any known data breaches."
            }
    except Exception as e:
        raise RuntimeError(f"Error checking password breach: {str(e)}")