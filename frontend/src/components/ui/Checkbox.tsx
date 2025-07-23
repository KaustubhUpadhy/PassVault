import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 accent-black bg-purple-950 border-purple-700 rounded 
                 focus:ring-purple-500 focus:ring-2 focus:ring-offset-0"
    />
    <label htmlFor={id} className="text-sm text-purple-200">
      {label}
    </label>
  </div>
);