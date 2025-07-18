import React, { useState } from 'react';
import { Eye, Loader, Shield } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PasswordBreachDisplay } from '../components/features/PasswordBreachDisplay';
import { PasswordService } from '../services/PasswordService';

interface BreachCheckPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface BreachResult {
  is_breached: boolean;
  breach_count: number;
  message: string;
}

export const BreachCheckPage: React.FC<BreachCheckPageProps> = ({ onNavigate, showToast }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BreachResult | null>(null);

  const handleCheckBreach = async () => {
    if (!password.trim()) {
      showToast("Please enter a password to check", "error");
      return;
    }

    setIsLoading(true);
    try {
      const breachResult = await PasswordService.checkBreach(password);
      setResult(breachResult);
      
      if (breachResult.is_breached) {
        showToast(`Password found in ${breachResult.breach_count} breaches!`, "error");
      } else {
        showToast("Password not found in any known breaches", "success");
      }
    } catch (error) {
      showToast("Failed to check password breach status", "error");
      console.error('Breach check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResults = () => {
    setResult(null);
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header title="Breach Check" showBack onBack={() => onNavigate('home')} onNavigate={onNavigate} />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <Eye className="h-24 w-24 text-red-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Password Breach Check</h1>
          <p className="text-purple-300 text-lg">Check if your password has been compromised in known data breaches</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Breach Analysis</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200">Password to Check</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to check for breaches"
                  className="w-full"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && password.trim() && !isLoading) {
                      handleCheckBreach();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleCheckBreach}
                disabled={isLoading || !password.trim()}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Check for Breaches</span>
                  </>
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

            {/* Security Notice */}
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">🔒 Privacy Notice</h4>
                  <p className="text-sm text-blue-200">
                    Your password is checked securely using k-anonymity. Only the first 5 characters 
                    of your password's hash are sent to HaveIBeenPwned, ensuring your actual password 
                    is never transmitted.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <Card>
                <h2 className="text-xl font-semibold text-white mb-6">Breach Results</h2>
                <PasswordBreachDisplay result={result} />
              </Card>
            ) : (
              <Card className="text-center py-12">
                <Eye className="h-16 w-16 text-red-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">Ready to Check</h3>
                <p className="text-purple-300">Enter a password and click "Check for Breaches" to see if it's been compromised</p>
              </Card>
            )}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-purple-900/20">
          <h3 className="text-white text-lg font-semibold mb-4">About Data Breach Checking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-300">
            <div>
              <h4 className="font-medium text-purple-200 mb-2">What we check:</h4>
              <ul className="space-y-1">
                <li>• Over 600+ million compromised passwords</li>
                <li>• Data from major security breaches</li>
                <li>• Corporate and personal account breaches</li>
                <li>• Regularly updated breach database</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-200 mb-2">How it works:</h4>
              <ul className="space-y-1">
                <li>• Uses k-anonymity for privacy protection</li>
                <li>• Only partial hash is transmitted</li>
                <li>• Powered by HaveIBeenPwned API</li>
                <li>• Your actual password never leaves your device</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};