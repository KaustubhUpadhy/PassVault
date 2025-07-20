import secrets
import math
import string

class SecurePasswordGenerator:
    """
    A secure password generator using cryptographically strong randomness
    """
    
    def __init__(self):
        # Character sets
        self.uppercase = string.ascii_uppercase
        self.lowercase = string.ascii_lowercase
        self.digits = string.digits
        self.special_chars = "!@#$%^&*()-_=+[]{}|;:,.<>?/`~"
        
    def generate_password(self, length=12, include_uppercase=True, include_lowercase=True, 
                         include_numbers=True, include_symbols=True):
        """
        Generate a secure password with specified parameters
        
        Args:
            length (int): Password length (12-50)
            include_uppercase (bool): Include uppercase letters
            include_lowercase (bool): Include lowercase letters
            include_numbers (bool): Include numbers
            include_symbols (bool): Include special characters
            
        Returns:
            dict: Password and entropy
        """
        # Validate input
        if not 12 <= length <= 50:
            raise ValueError("Password length must be between 12 and 50 characters")
        
        # Build character set
        charset = self._build_charset(include_uppercase, include_lowercase, 
                                    include_numbers, include_symbols)
        
        if not charset:
            raise ValueError("At least one character type must be selected")
        
        # Auto-determine unique characters based on charset size
        unique_chars = length <= len(charset)
        
        # Generate password ensuring all selected character types are included
        password = self._generate_with_requirements(
            length, charset, include_uppercase, include_lowercase, 
            include_numbers, include_symbols, unique_chars
        )
        
        # Calculate entropy
        entropy = self._calculate_entropy(len(charset), length)
        
        return {
            "password": password,
            "entropy_bits": round(entropy, 2)
        }
    
    def _build_charset(self, include_uppercase, include_lowercase, 
                      include_numbers, include_symbols):
        """Build the character set based on requirements"""
        charset = ""
        
        if include_uppercase:
            charset += self.uppercase
        if include_lowercase:
            charset += self.lowercase
        if include_numbers:
            charset += self.digits
        if include_symbols:
            charset += self.special_chars
            
        return charset
    
    def _generate_with_requirements(self, length, charset, include_uppercase, 
                                  include_lowercase, include_numbers, 
                                  include_symbols, unique_chars):
        """Generate password ensuring all required character types are present"""
        
        # Calculate minimum characters needed from each type
        required_chars = []
        
        if include_uppercase:
            required_chars.append(secrets.choice(self.uppercase))
        if include_lowercase:
            required_chars.append(secrets.choice(self.lowercase))
        if include_numbers:
            required_chars.append(secrets.choice(self.digits))
        if include_symbols:
            required_chars.append(secrets.choice(self.special_chars))
        
        # Fill remaining positions
        remaining_length = length - len(required_chars)
        
        if unique_chars:
            # Remove already used characters for unique generation
            available_chars = list(charset)
            for char in required_chars:
                available_chars.remove(char)
            
            # Generate remaining unique characters
            additional_chars = []
            for _ in range(remaining_length):
                if available_chars:
                    char = secrets.choice(available_chars)
                    additional_chars.append(char)
                    available_chars.remove(char)
                else:
                    break
        else:
            # Generate remaining characters (duplicates allowed)
            additional_chars = [secrets.choice(charset) for _ in range(remaining_length)]
        
        # Combine and shuffle
        all_chars = required_chars + additional_chars
        
        # Secure shuffle using secrets
        for i in range(len(all_chars) - 1, 0, -1):
            j = secrets.randbelow(i + 1)
            all_chars[i], all_chars[j] = all_chars[j], all_chars[i]
        
        return ''.join(all_chars)
    
    def _calculate_entropy(self, charset_size, length):
        """Calculate password entropy in bits"""
        return math.log2(charset_size) * length

def generate_secure_password(length=12, include_uppercase=True, include_lowercase=True, 
                           include_numbers=True, include_symbols=True):
    """
    API-compatible version for integration with FastAPI backend
    
    Returns:
        dict: Generated password and entropy
    """
    generator = SecurePasswordGenerator()
    return generator.generate_password(
        length=length,
        include_uppercase=include_uppercase,
        include_lowercase=include_lowercase,
        include_numbers=include_numbers,
        include_symbols=include_symbols
    )