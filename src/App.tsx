import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { GeneratorPage } from './pages/GeneratorPage';
import { StrengthCheckPage } from './pages/StrengthCheckPage';
import { BreachCheckPage } from './pages/BreachCheckPage';
import { SavedPasswordsPage } from './pages/SavedPasswordsPage';
import { AboutPage } from './pages/AboutPage';
import { Toast } from './components/layout/Toast';
import { AuthModal } from './components/auth/AuthModal';

interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [toast, setToast] = useState<ToastData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleNavigate = (page: string) => {
    // Check if user is trying to access protected pages
    const protectedPages = ['generator', 'strength', 'breach', 'saved'];
    
    if (protectedPages.includes(page) && !isAuthenticated) {
      // Show auth modal instead of navigating
      setShowAuthModal(true);
      showToast("Please login to access this feature", "info");
      return;
    }
    
    setCurrentPage(page);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'generator':
        return <GeneratorPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'strength':
        return <StrengthCheckPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'breach':
        return <BreachCheckPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'saved':
        return <SavedPasswordsPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      {toast && <Toast toast={toast} onClose={hideToast} />}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </>
  );
};

const App: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <AuthProvider onToast={showToast}>
      <AppContent />
      {toast && <Toast toast={toast} onClose={hideToast} />}
    </AuthProvider>
  );
};

export default App;