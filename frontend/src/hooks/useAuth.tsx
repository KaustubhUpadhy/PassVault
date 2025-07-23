import { useApp } from '../context/AppContext';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, signup } = useApp();
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
  };
};
