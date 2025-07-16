import React from 'react';
import { Copy, Check } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  placeholder?: string;
  readOnly?: boolean;
  onCopy?: () => void;
  showCopyButton?: boolean;
  copied?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  value, 
  placeholder, 
  readOnly = false, 
  onCopy, 
  showCopyButton = false, 
  copied = false 
}) => (
  <div className="flex space-x-2">
    <input
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      className="flex-1 bg-purple-950/50 border border-purple-700 text-white font-mono text-lg px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
    />
    {showCopyButton && onCopy && (
      <button
        onClick={onCopy}
        disabled={!value}
        className="bg-purple-700 hover:bg-purple-600 disabled:bg-purple-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors border-none cursor-pointer flex items-center justify-center"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    )}
  </div>
);