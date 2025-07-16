export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PasswordSettings {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface SavedPassword {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
}

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface PasswordStrength {
  score: number;
  feedback: string[];
  crackTime?: string;
}

export interface BreachResult {
  isBreached: boolean;
  count: number;
  breachDetails?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}