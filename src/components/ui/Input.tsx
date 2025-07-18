import React from 'react';

interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;  // Add this line
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  required = false,
  id,
  name,
  autoComplete,
  onKeyPress,  // Add this line
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}  // Add this line
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      className={`bg-purple-950/50 border border-purple-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 placeholder-purple-400 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-600'
      } ${className}`}
    />
  );
};