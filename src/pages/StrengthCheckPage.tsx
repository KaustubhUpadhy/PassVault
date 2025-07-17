import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface StrengthCheckPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const StrengthCheckPage: React.FC<StrengthCheckPageProps> = ({ onNavigate, showToast }) => {
  const [password, setPassword] = useState('');

  const handleCheckStrength = () => {
    if (!password) {
      showToast("Please enter a password to check", "error");
      return;
    }
    showToast("Strength checking will be implemented with zxcvbn backend!", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header title="Strength Check" showBack onBack={() => onNavigate('home')} onNavigate={onNavigate} />

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <Shield className="h-24 w-24 text-purple-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Password Strength Check</h1>
          <p className="text-purple-300 text-lg">Analyze your password strength using advanced algorithms</p>
        </div>

        <Card className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">Enter Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check strength"
              className="w-full"
            />
          </div>

          <Button 
            onClick={handleCheckStrength}
            className="w-full"
          >
            Check Strength (Coming Soon)
          </Button>
        </Card>

        <Card className="mt-8 bg-purple-900/20">
          <p className="text-white text-xl">Coming Soon!</p>
          <p className="text-purple-300 mt-2">This feature will be available once the zxcvbn backend is implemented.</p>
        </Card>
      </main>
    </div>
  );
};