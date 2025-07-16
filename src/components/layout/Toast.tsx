import React, { useEffect } from 'react';
import { Toast as ToastType } from '../../types';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform animate-in slide-in-from-right ${
      toast.type === "error" ? "bg-red-600 text-white" : 
      toast.type === "info" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
    }`}>
      {toast.message}
    </div>
  );
};