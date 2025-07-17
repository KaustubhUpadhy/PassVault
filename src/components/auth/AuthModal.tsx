import React, { useState } from 'react';
import { X, Mail, Lock, User, Github } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signup' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signIn, signInWithGoogle, signInWithGitHub } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(formData);
        if (!error) {
          onClose();
        }
      } else {
        const { error } = await signIn({
          email: formData.email,
          password: formData.password,
        });
        if (!error) {
          onClose();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGitHub();
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-purple-900/95 backdrop-blur-sm border border-purple-700 rounded-2xl p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-purple-300">
            {mode === 'signup' 
              ? 'Sign up to secure your passwords' 
              : 'Login to access your vault'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-200 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Password
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-lg"
          >
            {isLoading 
              ? 'Loading...' 
              : mode === 'signup' 
                ? 'Create Account' 
                : 'Login'
            }
          </Button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-purple-700"></div>
          <span className="px-4 text-purple-300 text-sm">
            Or {mode === 'signup' ? 'sign up' : 'login'} with
          </span>
          <div className="flex-1 border-t border-purple-700"></div>
        </div>

        {/* Social Auth Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleSocialAuth('google')}
            disabled={isLoading}
            variant="secondary"
            className="w-full flex items-center justify-center space-x-2 py-3"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </Button>

          <Button
            onClick={() => handleSocialAuth('github')}
            disabled={isLoading}
            variant="secondary"
            className="w-full flex items-center justify-center space-x-2 py-3"
          >
            <Github className="h-5 w-5" />
            <span>Continue with GitHub</span>
          </Button>
        </div>

        {/* Switch Mode */}
        <div className="mt-8 text-center">
          <p className="text-purple-300">
            {mode === 'signup' 
              ? 'Already have an account?' 
              : "Don't have an account?"
            }
            <button
              onClick={switchMode}
              className="ml-2 text-purple-400 hover:text-purple-300 font-semibold bg-transparent border-none cursor-pointer"
            >
              {mode === 'signup' ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};