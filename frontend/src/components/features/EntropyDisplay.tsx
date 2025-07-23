import React from 'react';
import { Shield, Info } from 'lucide-react';

interface EntropyDisplayProps {
  entropy: number;
  className?: string;
}

export const EntropyDisplay: React.FC<EntropyDisplayProps> = ({ entropy, className = '' }) => {
  const getEntropyConfig = (entropy: number) => {
    if (entropy < 30) {
      return { 
        color: 'text-red-400', 
        bgColor: 'bg-red-500', 
        label: 'Very Weak',
        percentage: Math.min((entropy / 30) * 100, 100)
      };
    } else if (entropy < 50) {
      return { 
        color: 'text-yellow-400', 
        bgColor: 'bg-yellow-500', 
        label: 'Weak',
        percentage: Math.min(((entropy - 30) / 20) * 100 + 25, 100)
      };
    } else if (entropy < 70) {
      return { 
        color: 'text-orange-400', 
        bgColor: 'bg-orange-500', 
        label: 'Good',
        percentage: Math.min(((entropy - 50) / 20) * 100 + 50, 100)
      };
    } else if (entropy < 90) {
      return { 
        color: 'text-green-400', 
        bgColor: 'bg-green-500', 
        label: 'Strong',
        percentage: Math.min(((entropy - 70) / 20) * 100 + 75, 100)
      };
    } else {
      return { 
        color: 'text-green-300', 
        bgColor: 'bg-green-600', 
        label: 'Very Strong',
        percentage: 100
      };
    }
  };

  const config = getEntropyConfig(entropy);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className={`h-4 w-4 ${config.color}`} />
          <span className="text-sm font-medium text-purple-200">Entropy</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${config.color}`}>
            {entropy.toFixed(1)} bits
          </span>
          <span className={`text-xs ${config.color}`}>
            ({config.label})
          </span>
        </div>
      </div>
      
      {/* Entropy Bar */}
      <div className="w-full bg-purple-800 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${config.bgColor}`}
          style={{ width: `${config.percentage}%` }}
        />
      </div>
      
      {/* Info */}
      <div className="flex items-start space-x-2 text-xs text-purple-400">
        <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <span>
          Higher entropy means more randomness and stronger security. 
          {entropy >= 70 ? ' Excellent security!' : entropy >= 50 ? ' Good security.' : ' Consider increasing length or complexity.'}
        </span>
      </div>
    </div>
  );
};