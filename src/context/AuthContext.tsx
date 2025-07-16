import { useApp } from './AppContext';

// This is a simplified version that uses AppContext
// In a larger app, you might want a separate AuthContext
export const useAuth = () => {
  const { user, isAuthenticated, login, logout, signup } = useApp();
  return { user, isAuthenticated, login, logout, signup };
};
