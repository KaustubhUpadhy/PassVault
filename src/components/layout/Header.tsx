import React, { useState } from 'react';
import { ArrowLeft, Shield, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "PassVault", 
  showBack = false, 
  onBack 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useApp();

  return (
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

      <nav className="hidden md:flex space-x-6 text-purple-300">
        {isAuthenticated ? (
          <>
            <button className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Dashboard
            </button>
            <button onClick={logout} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Features
            </button>
            <button className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Security
            </button>
            <button className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              About
            </button>
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
  );
};