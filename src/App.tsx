import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './pages/HomePage';
import { GeneratorPage } from './pages/GeneratorPage';
import { StrengthCheckPage } from './pages/StrengthCheckPage';
import { BreachCheckPage } from './pages/BreachCheckPage';
import { SavedPasswordsPage } from './pages/SavedPasswordsPage';
import { Toast } from './components/layout/Toast';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { toast } = useApp();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const hideToast = () => {
    // Toast will auto-hide, but we need this for the component
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'generator':
        return <GeneratorPage onNavigate={handleNavigate} />;
      case 'strength':
        return <StrengthCheckPage onNavigate={handleNavigate} />;
      case 'breach':
        return <BreachCheckPage onNavigate={handleNavigate} />;
      case 'saved':
        return <SavedPasswordsPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      {toast && <Toast toast={toast} onClose={hideToast} />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;