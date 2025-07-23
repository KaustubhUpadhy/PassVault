import React, { useState } from 'react';
import { Shield, Loader } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PasswordStrengthDisplay } from '../components/features/PasswordStrengthDisplay';
import { PasswordService } from '../services/PasswordService';

interface StrengthCheckPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface StrengthResult {
  score: number;
  strength_label: string;
  online_crack_time: string;
  offline_crack_time: string;
  warning: string;
  suggestions: string[];
}

export const StrengthCheckPage: React.FC<StrengthCheckPageProps> = ({ onNavigate, showToast }) => {
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StrengthResult | null>(null);

  const handleCheckStrength = async () => {
    if (!password.trim()) {
      showToast("Please enter a password to check", "error");
      return;
    }

    setIsLoading(true);
    try {
      const strengthResult = await PasswordService.checkStrength(
        password,
        firstName || undefined,
        lastName || undefined,
        email || undefined
      );
      setResult(strengthResult);
      showToast("Password strength analyzed successfully!", "success");
    } catch (error) {
      showToast("Failed to analyze password strength", "error");
      console.error('Strength check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResults = () => {
    setResult(null);
    setPassword('');
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header title="Strength Check" showBack onBack={() => onNavigate('home')} onNavigate={onNavigate} />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="h-24 w-24 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Password Strength Check</h1>
          <p className="text-purple-300 text-lg">Analyze your password strength using advanced zxcvbn algorithms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Password Analysis</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200">Password *</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to analyze"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200">First Name (optional)</label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-200">Last Name (optional)</label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Your last name"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200">Email (optional)</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleCheckStrength}
                disabled={isLoading || !password.trim()}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Check Strength</span>
                )}
              </Button>

              {result && (
                <Button 
                  onClick={handleClearResults}
                  variant="secondary"
                  className="px-6"
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="bg-purple-900/20 rounded-lg p-4">
              <p className="text-sm text-purple-300">
                <strong>Tip:</strong> Adding your personal information helps detect if your password contains 
                easily guessable elements related to you.
              </p>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <Card>
                <h2 className="text-xl font-semibold text-white mb-6">Analysis Results</h2>
                <PasswordStrengthDisplay result={result} />
              </Card>
            ) : (
              <Card className="text-center py-12">
                <Shield className="h-16 w-16 text-green-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">Ready to Analyze</h3>
                <p className="text-purple-300">Enter a password and click "Check Strength" to see detailed analysis</p>
              </Card>
            )}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-purple-900/20">
          <h3 className="text-white text-lg font-semibold mb-4">About Password Strength Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-300">
            <div>
              <h4 className="font-medium text-purple-200 mb-2">What we analyze:</h4>
              <ul className="space-y-1">
                <li>• Pattern recognition and common sequences</li>
                <li>• Dictionary words and common passwords</li>
                <li>• Personal information usage</li>
                <li>• Keyboard patterns and repetition</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-200 mb-2">Strength levels:</h4>
              <ul className="space-y-1">
                <li>🔴 <strong>Poor (0):</strong> Very weak, easily cracked</li>
                <li>🟡 <strong>Low (1):</strong> Weak, vulnerable to attacks</li>
                <li>🟠 <strong>Moderate (2):</strong> Moderate strength</li>
                <li>🟢 <strong>Very Good (3):</strong> Strong password</li>
                <li>🟢 <strong>Excellent (4):</strong> Very strong password</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};