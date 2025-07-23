import React from 'react';
import { AlertTriangle, Lightbulb, Clock } from 'lucide-react';

interface PasswordStrengthResult {
  score: number;
  strength_label: string;
  online_crack_time: string;
  offline_crack_time: string;
  warning: string;
  suggestions: string[];
}

interface PasswordStrengthDisplayProps {
  result: PasswordStrengthResult;
  className?: string;
}

export const PasswordStrengthDisplay: React.FC<PasswordStrengthDisplayProps> = ({ 
  result, 
  className = '' 
}) => {
  const getStrengthConfig = (score: number) => {
    switch (score) {
      case 0:
        return { 
          color: 'bg-red-500', 
          textColor: 'text-red-400', 
          emoji: '🔴',
          percentage: 20 
        };
      case 1:
        return { 
          color: 'bg-yellow-500', 
          textColor: 'text-yellow-400', 
          emoji: '🟡',
          percentage: 40 
        };
      case 2:
        return { 
          color: 'bg-orange-500', 
          textColor: 'text-orange-400', 
          emoji: '🟠',
          percentage: 60 
        };
      case 3:
        return { 
          color: 'bg-green-500', 
          textColor: 'text-green-400', 
          emoji: '🟢',
          percentage: 80 
        };
      case 4:
        return { 
          color: 'bg-green-700', 
          textColor: 'text-green-300', 
          emoji: '🟢',
          percentage: 100 
        };
      default:
        return { 
          color: 'bg-gray-500', 
          textColor: 'text-gray-400', 
          emoji: '⚪',
          percentage: 0 
        };
    }
  };

  const strengthConfig = getStrengthConfig(result.score);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Strength Score and Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            {strengthConfig.emoji} Password Strength: {result.strength_label} (Score: {result.score}/4)
          </h3>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-purple-800 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${strengthConfig.color}`}
            style={{ width: `${strengthConfig.percentage}%` }}
          />
        </div>
      </div>

      {/* Crack Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-900/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">Time to crack online:</span>
          </div>
          <p className="text-white font-mono">{result.online_crack_time}</p>
        </div>
        
        <div className="bg-purple-900/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">Time to crack offline:</span>
          </div>
          <p className="text-white font-mono">{result.offline_crack_time}</p>
        </div>
      </div>

      {/* Warning (only if exists) */}
      {result.warning && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-medium mb-1">⚠️ Warning</h4>
              <p className="text-yellow-200">{result.warning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions (only if they exist) */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-blue-400 font-medium mb-2">💡 Suggestions:</h4>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-blue-200">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};