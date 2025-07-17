import React, { useState } from 'react';
import { ArrowLeft, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileMenu } from '../auth/ProfileMenu';
import { AuthModal } from '../auth/AuthModal';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "PassVault", 
  showBack = false, 
  onBack,
  onNavigate
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const { isAuthenticated, isLoading } = useAuth();

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="w-full p-6 flex justify-between items-center border-b border-purple-800">
        <div className="flex items-center space-x-4">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 bg-transparent text-purple-300 hover:text-white hover:bg-purple-800 px-3 py-2 rounded-lg transition-colors border-none cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-purple-300">
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => onNavigate && onNavigate('about')}
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                About
              </button>
              <button
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                Security Reports 
              </button>{/* Security dashboard (password health, breach monitoring)opens up a seperate page on clicking run the security check button option which runs and scans all automatically */}
              <ProfileMenu />
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate && onNavigate('about')}
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                About
              </button>
              {!isLoading && (
                <>
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 border-none cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </>
          )}
        </nav>

        <button
          className="md:hidden text-purple-300 bg-transparent border-none cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </>
  );
};