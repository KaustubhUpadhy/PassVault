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

        <main className="flex-1 flex items-center justify-center px-6">
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
                onClick={() => onNavigate('generator')}
              />
              <FeatureCard
                icon={Shield}
                title="Strength Check"
                description="Analyze password strength using advanced algorithms"
                onClick={() => onNavigate('strength')}
              />
              <FeatureCard
                icon={Eye}
                title="Breach Check"
                description="Check if your password has been compromised in data breaches"
                onClick={() => onNavigate('breach')}
              />
              <FeatureCard
                icon={Database}
                title="Saved Passwords"
                description="Manage your encrypted passwords stored in the cloud"
                onClick={() => onNavigate('saved')}
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