import React, { useState } from 'react';
import { X, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onBackToLogin 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (!error) {
        setIsEmailSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsEmailSent(false);
    onClose();
  };

  const handleBackToLogin = () => {
    setEmail('');
    setIsEmailSent(false);
    onBackToLogin();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-purple-900/95 backdrop-blur-sm border border-purple-700 rounded-2xl p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Back to Login Button */}
        <button
          onClick={handleBackToLogin}
          className="absolute top-4 left-4 text-purple-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer flex items-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8 mt-4">
          {!isEmailSent ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">
                Reset Password
              </h2>
              <p className="text-purple-300">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </>
          ) : (
            <>
              <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-purple-300">
                We've sent password reset instructions to:
              </p>
              <p className="text-white font-semibold mt-1">{email}</p>
            </>
          )}
        </div>

        {!isEmailSent ? (
          // Email Input Form
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-3 text-lg"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>
        ) : (
          // Success State
          <div className="space-y-6">
            <div className="bg-purple-800/30 border border-purple-600 rounded-lg p-4">
              <h4 className="text-purple-200 font-medium mb-2">📧 What's next?</h4>
              <ul className="text-purple-300 text-sm space-y-1">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the reset link in the email</li>
                <li>• Enter your new password</li>
                <li>• You'll be automatically signed in</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                variant="secondary"
                className="flex-1"
              >
                Try Another Email
              </Button>
              <Button
                onClick={handleBackToLogin}
                className="flex-1"
              >
                Back to Login
              </Button>
            </div>
          </div>
        )}

        {/* Additional Help */}
        {!isEmailSent && (
          <div className="mt-8 text-center">
            <p className="text-purple-400 text-sm">
              Remember your password?{' '}
              <button
                onClick={handleBackToLogin}
                className="text-purple-300 hover:text-white font-semibold bg-transparent border-none cursor-pointer"
              >
                Back to Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};