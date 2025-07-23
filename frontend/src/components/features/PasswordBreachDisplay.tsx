import React from 'react';
import { AlertTriangle, Shield, Info } from 'lucide-react';

interface PasswordBreachResult {
  is_breached: boolean;
  breach_count: number;
  message: string;
}

interface PasswordBreachDisplayProps {
  result: PasswordBreachResult;
  className?: string;
}

export const PasswordBreachDisplay: React.FC<PasswordBreachDisplayProps> = ({ 
  result, 
  className = '' 
}) => {
  const getBreachConfig = () => {
    if (result.is_breached) {
      return {
        icon: AlertTriangle,
        iconColor: 'text-red-400',
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-600',
        titleColor: 'text-red-400',
        textColor: 'text-red-200',
        emoji: '🚨',
        status: 'COMPROMISED'
      };
    } else {
      return {
        icon: Shield,
        iconColor: 'text-green-400',
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-600',
        titleColor: 'text-green-400',
        textColor: 'text-green-200',
        emoji: '✅',
        status: 'SECURE'
      };
    }
  };

  const config = getBreachConfig();
  const IconComponent = config.icon;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Status Card */}
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-6`}>
        <div className="flex items-start space-x-3">
          <IconComponent className={`h-6 w-6 ${config.iconColor} mt-1 flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`text-xl font-semibold ${config.titleColor} mb-2`}>
              {config.emoji} Password Status: {config.status}
            </h3>
            <p className={`${config.textColor} text-lg leading-relaxed`}>
              {result.message}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      {result.is_breached ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Breach Count */}
          <div className="bg-red-900/20 rounded-lg p-4 border border-red-800">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-200">Times Found in Breaches:</span>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {result.breach_count.toLocaleString()}
            </p>
          </div>

          {/* Risk Level */}
          <div className="bg-red-900/20 rounded-lg p-4 border border-red-800">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-200">Risk Level:</span>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {result.breach_count > 100000 ? 'CRITICAL' : 
               result.breach_count > 10000 ? 'HIGH' :
               result.breach_count > 1000 ? 'MEDIUM' : 'LOW'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-900/20 rounded-lg p-4 border border-green-800">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-200">Security Status:</span>
          </div>
          <p className="text-green-200">
            This password has not been found in any known data breaches. However, this doesn't guarantee 
            it's a strong password - consider using the Strength Check tool as well.
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-blue-400 font-medium mb-2">💡 Recommendations:</h4>
            {result.is_breached ? (
              <ul className="space-y-1 text-blue-200">
                <li>• <strong>Change this password immediately</strong></li>
                <li>• Use our Password Generator to create a new strong password</li>
                <li>• Enable two-factor authentication (2FA) where possible</li>
                <li>• Check all accounts using this password</li>
                <li>• Consider using a password manager</li>
              </ul>
            ) : (
              <ul className="space-y-1 text-blue-200">
                <li>• This password appears safe from known breaches</li>
                <li>• Use our Strength Check to verify password complexity</li>
                <li>• Consider using unique passwords for each account</li>
                <li>• Enable two-factor authentication for extra security</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* HaveIBeenPwned Attribution */}
      <div className="text-center">
        <p className="text-sm text-purple-400">
          Powered by <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-300">HaveIBeenPwned</a> API
        </p>
      </div>
    </div>
  );
};