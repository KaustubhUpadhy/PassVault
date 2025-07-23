import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: 'red' | 'blue';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonColor = 'blue'
}) => {
  if (!isOpen) return null;

  const confirmButtonClass = confirmButtonColor === 'red' 
    ? 'bg-red-600 hover:bg-red-500' 
    : 'bg-blue-600 hover:bg-blue-500';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-purple-900/95 backdrop-blur-sm border border-purple-700 rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-purple-300 mb-6">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors border-none cursor-pointer"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${confirmButtonClass} text-white py-2 rounded-lg transition-colors border-none cursor-pointer`}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};