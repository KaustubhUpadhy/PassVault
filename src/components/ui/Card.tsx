import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverable = false 
}) => {
  const baseClasses = "bg-purple-900/30 backdrop-blur-sm border border-purple-800 rounded-lg p-6";
  const hoverClasses = hoverable ? "hover:bg-purple-800/40 hover:border-purple-600 hover:scale-105 cursor-pointer transition-all duration-300 transform hover:shadow-2xl" : "";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};