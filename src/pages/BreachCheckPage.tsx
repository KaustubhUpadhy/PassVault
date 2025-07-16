import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';

interface BreachCheckPageProps {
  onNavigate: (page: string) => void;
}

export const BreachCheckPage: React.FC<BreachCheckPageProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const { showToast } = useApp();

  const handleCheckBreach = () => {
    if (!password) {
      showToast("Please enter a password to check", "error");
      return;
    }
    showToast("Breach checking will be implemented with HaveIBeenPwned API!", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header title="Breach Check" showBack onBack={() => onNavigate('home')} />

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <Eye className="h-24 w-24 text-red-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Password Breach Check</h1>
          <p className="text-purple-300 text-lg">Check if your password has been compromised in data breaches</p>
        </div>

        <Card className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">Enter Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check for breaches"
              className="w-full"
            />
          </div>

          <Button 
            onClick={handleCheckBreach}
            className="w-full"
          >
            Check for Breaches (Coming Soon)
          </Button>
        </Card>

        <Card className="mt-8 bg-purple-900/20">
          <p className="text-white text-xl">Coming Soon!</p>
          <p className="text-purple-300 mt-2">This feature will be available once the HaveIBeenPwned API is implemented.</p>
        </Card>
      </main>
    </div>
  );
};