import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface ResetPasswordPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ 
  onNavigate,
  showToast 
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const { updatePassword } = useAuth();

  useEffect(() => {
    // Handle the password reset URL from Supabase
    const handlePasswordReset = async () => {
      try {
        // Get the session to see if we have a valid reset session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          showToast('Invalid or expired reset link', 'error');
          setTimeout(() => onNavigate('home'), 3000);
          return;
        }

        if (session && session.user) {
          // We have a valid session, user can reset password
          setIsValidSession(true);
          showToast('Ready to set your new password', 'success');
        } else {
          // Check if there are auth parameters in the URL
          const urlParams = new URLSearchParams(window.location.search);
          const accessToken = urlParams.get('access_token');
          const tokenHash = window.location.hash;
          
          // If we have tokens in URL, try to set the session
          if (accessToken || tokenHash.includes('access_token')) {
            // Let Supabase handle the auth state from the URL
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for auth state to update
            
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession && newSession.user) {
              setIsValidSession(true);
              showToast('Ready to set your new password', 'success');
            } else {
              showToast('Invalid or expired reset link', 'error');
              setTimeout(() => onNavigate('home'), 3000);
            }
          } else {
            showToast('Invalid or expired reset link', 'error');
            setTimeout(() => onNavigate('home'), 3000);
          }
        }
      } catch (error) {
        console.error('Password reset error:', error);
        showToast('Invalid or expired reset link', 'error');
        setTimeout(() => onNavigate('home'), 3000);
      }
    };

    handlePasswordReset();
  }, [showToast, onNavigate]);

  const validatePassword = () => {
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return false;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    if (!isValidSession) {
      showToast('Invalid session. Please request a new password reset.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (!error) {
        setIsSuccess(true);
        setTimeout(() => {
          onNavigate('home');
        }, 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking session validity
  if (!isValidSession && !isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-purple-900/95 backdrop-blur-sm border border-purple-700 rounded-2xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying reset link...</p>
          <p className="text-purple-300 text-sm mt-2">Please wait while we validate your request</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-purple-900/95 backdrop-blur-sm border border-purple-700 rounded-2xl p-8 w-full max-w-md text-center">
          <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Password Updated!</h2>
          <p className="text-purple-300 mb-6">
            Your password has been successfully updated. You're now logged in and will be redirected to your dashboard.
          </p>
          
          <Button
            onClick={() => onNavigate('home')}
            className="w-full py-3"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-purple-900/95 backdrop-blur-sm border border-purple-700 rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Set New Password</h2>
          <p className="text-purple-300">
            Enter your new password below. Make sure it's strong and secure.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 bg-transparent border-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 bg-transparent border-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-purple-800/30 border border-purple-600 rounded-lg p-4">
            <h4 className="text-purple-200 font-medium mb-2">Password Requirements:</h4>
            <ul className="text-purple-300 text-sm space-y-1">
              <li className={password.length >= 6 ? 'text-green-400' : ''}>
                • At least 6 characters
              </li>
              <li className={password !== confirmPassword ? 'text-red-400' : confirmPassword && password === confirmPassword ? 'text-green-400' : ''}>
                • Passwords must match
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isLoading || password.length < 6 || password !== confirmPassword}
            className="w-full py-3 text-lg"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-purple-400 text-sm">
            After updating your password, you'll be automatically signed in.
          </p>
        </div>
      </div>
    </div>
  );
};