import { useApp } from '../context/AppContext';

export const useToast = () => {
  const { showToast } = useApp();
  
  return { showToast };
};