import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { GeneratorPage } from './pages/GeneratorPage';
import { StrengthCheckPage } from './pages/StrengthCheckPage';
import { BreachCheckPage } from './pages/BreachCheckPage';
import { SavedPasswordsPage } from './pages/SavedPasswordsPage';
import { AboutPage } from './pages/AboutPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AuthCallback } from './pages/AuthCallback';
import { SecurityReportsPage } from './pages/SecurityReportsPage';
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

  // Check for special routes on component mount
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    
    // Handle password reset route
    if (path === '/auth/reset-password') {
      setCurrentPage('reset-password');
      return;
    }
    
    // Handle auth callback route  
    if (path === '/auth/callback') {
      setCurrentPage('auth-callback');
      return;
    }

    // Check URL parameters for errors (from OAuth redirects)
    const urlParams = new URLSearchParams(search);
    const error = urlParams.get('error');
    if (error === 'auth_failed') {
      showToast("Authentication failed. Please try again.", "error");
    }
  }, []);

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
    
    // Update browser URL for normal navigation (not special routes)
    if (!['reset-password', 'auth-callback'].includes(page)) {
      window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
    }
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
      case 'reset-password':
        return <ResetPasswordPage onNavigate={handleNavigate} showToast={showToast} />;
      case 'auth-callback':
        return <AuthCallback />;
      case 'security-reports':
        return <SecurityReportsPage onNavigate={handleNavigate} showToast={showToast} />;
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