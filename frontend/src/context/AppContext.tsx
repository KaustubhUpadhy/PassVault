import React, { createContext, useContext, useState } from 'react';
import { User, SavedPassword, Toast } from '../types';
import { AuthService } from '../services/AuthService';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  savedPasswords: SavedPassword[];
  toast: Toast | null;
  showToast: (message: string, type?: Toast['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedPasswords, setSavedPasswords] = useState<SavedPassword[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const user = await AuthService.login(email, password);
      setUser(user);
      showToast("Logged in successfully!");
    } catch (error) {
      showToast("Login failed", "error");
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setSavedPasswords([]);
      showToast("Logged out successfully!");
    } catch (error) {
      showToast("Logout failed", "error");
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const user = await AuthService.signup(email, password, name);
      setUser(user);
      showToast("Account created successfully!");
    } catch (error) {
      showToast("Signup failed", "error");
    }
  };

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type });
  };

  const value: AppContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    savedPasswords,
    toast,
    showToast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
