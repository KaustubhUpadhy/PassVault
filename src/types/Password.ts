export interface SavedPassword {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface PasswordSettings {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface PasswordStrength {
  score: number;
  feedback: string[];
  crackTime: string;
}

export interface BreachResult {
  isBreached: boolean;
  count: number;
  breachDetails?: string[];
}