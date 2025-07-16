import React from 'react';

interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  required = false,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`bg-purple-950/50 border border-purple-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${className}`}
    />
  );
};