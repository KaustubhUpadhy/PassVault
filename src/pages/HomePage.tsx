import React, { useState } from 'react';
import { Key, Shield, Eye, Database } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { FeatureCard } from '../components/features/FeatureCard';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const { isAuthenticated } = useAuth();

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <Header onNavigate={onNavigate} />

        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-6xl mx-auto">
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                <span className="text-white">Pass</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Vault</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-300 mb-8 max-w-2xl mx-auto">
                Generate, check, and manage your passwords securely in the cloud
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <FeatureCard
                icon={Key}
                title="Password Generator"
                description="Generate strong, secure passwords with custom options"
                onClick={isAuthenticated ? () => onNavigate('generator') : () => handleAuthClick('signup')}
              />
              <FeatureCard
                icon={Shield}
                title="Strength Check"
                description="Analyze password strength using advanced algorithms"
                onClick={isAuthenticated ? () => onNavigate('strength') : () => handleAuthClick('signup')}
              />
              <FeatureCard
                icon={Eye}
                title="Breach Check"
                description="Check if your password has been compromised in data breaches"
                onClick={isAuthenticated ? () => onNavigate('breach') : () => handleAuthClick('signup')}
              />
              <FeatureCard
                icon={Database}
                title="Saved Passwords"
                description="Manage your encrypted passwords stored in the cloud"
                onClick={isAuthenticated ? () => onNavigate('saved') : () => handleAuthClick('signup')}
              />
            </div>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <Button onClick={() => handleAuthClick('signup')}>
                  Get Started
                </Button>
                <Button variant="secondary" onClick={() => handleAuthClick('signin')}>
                  Login
                </Button>
              </div>
            )}

            <div className="mt-20 mb-16 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Enterprise-Grade Security Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Client-Side Encryption</h3>
                  <p className="text-purple-300">Your passwords are encrypted on your device before being stored</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Zero-Knowledge Architecture</h3>
                  <p className="text-purple-300">We cannot see your passwords even if we wanted to</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Secure Cloud Sync</h3>
                  <p className="text-purple-300">Access your encrypted vault from anywhere, anytime</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </>
  );
};