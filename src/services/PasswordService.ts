const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export class PasswordService {
  static async generatePassword(settings: {
    length: number;
    include_uppercase: boolean;
    include_lowercase: boolean;
    include_numbers: boolean;
    include_symbols: boolean;
  }): Promise<{
    password: string;
    entropy_bits: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/security/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        length: settings.length,
        include_uppercase: settings.include_uppercase,
        include_lowercase: settings.include_lowercase,
        include_numbers: settings.include_numbers,
        include_symbols: settings.include_symbols,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate password');
    }

    return response.json();
  }

  static async checkStrength(
    password: string, 
    firstName?: string, 
    lastName?: string, 
    email?: string
  ): Promise<{
    score: number;
    strength_label: string;
    online_crack_time: string;
    offline_crack_time: string;
    warning: string;
    suggestions: string[];
  }> {
    const response = await fetch(`${API_BASE_URL}/api/security/strength`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        first_name: firstName,
        last_name: lastName,
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to check password strength');
    }

    return response.json();
  }

  static async checkBreach(password: string): Promise<{
    is_breached: boolean;
    breach_count: number;
    message: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/security/breach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to check password breach');
    }

    return response.json();
  }

  // Keep existing methods for backward compatibility
  static async savePassword(passwordData: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...passwordData
    };
  }

  static async getSavedPasswords(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  }
}