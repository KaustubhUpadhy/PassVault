import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';
import { Checkbox } from '../components/ui/Checkbox';
import { PasswordInput } from '../components/features/PasswordInput';
import { usePasswordSettings } from '../hooks/usePasswordSettings';
import { useClipboard } from '../hooks/useClipboard';

interface GeneratorPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ onNavigate, showToast }) => {
  const { settings, updateSettings } = usePasswordSettings();
  const { copied, copyToClipboard } = useClipboard(showToast);
  const defaultPassword = "Temp@123Pass!";
  const defaultStrength = { strength: 75, label: "Strong", color: "text-green-400" };

  const handleGenerate = () => {
    showToast("Password generation will be implemented with backend!", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header title="Password Generator" showBack onBack={() => onNavigate('home')} onNavigate={onNavigate} />

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Password Generator</h1>
          <p className="text-purple-300 text-lg">Create strong, secure passwords instantly</p>
        </div>

        <Card className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">Generated Password</label>
            <PasswordInput
              value={defaultPassword}
              placeholder="Click generate to create a password"
              readOnly
              showCopyButton
              onCopy={() => copyToClipboard(defaultPassword)}
              copied={copied}
            />
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-purple-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300 bg-green-500"
                  style={{ width: `${defaultStrength.strength}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${defaultStrength.color}`}>
                {defaultStrength.label}
              </span>
            </div>
          </div>

          <Slider
            value={settings.length}
            onChange={(length) => updateSettings({ length })}
            min={4}
            max={50}
            label="Length"
          />

          <div className="space-y-4">
            <label className="text-sm font-medium text-purple-200">Include Characters</label>
            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                id="uppercase"
                label="Uppercase (A-Z)"
                checked={settings.includeUppercase}
                onChange={(includeUppercase) => updateSettings({ includeUppercase })}
              />
              <Checkbox
                id="lowercase"
                label="Lowercase (a-z)"
                checked={settings.includeLowercase}
                onChange={(includeLowercase) => updateSettings({ includeLowercase })}
              />
              <Checkbox
                id="numbers"
                label="Numbers (0-9)"
                checked={settings.includeNumbers}
                onChange={(includeNumbers) => updateSettings({ includeNumbers })}
              />
              <Checkbox
                id="symbols"
                label="Symbols (!@#$...)"
                checked={settings.includeSymbols}
                onChange={(includeSymbols) => updateSettings({ includeSymbols })}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-none cursor-pointer flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Generate Password (Coming Soon)</span>
          </button>
        </Card>

        <Card className="mt-8 bg-purple-900/20">
          <h3 className="text-white text-lg font-semibold mb-4">Security Tips</h3>
          <ul className="space-y-2 text-sm text-purple-300">
            <li>• Use passwords with at least 12 characters</li>
            <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Use unique passwords for each account</li>
            <li>• Never share your passwords with others</li>
            <li>• Consider using a password manager</li>
          </ul>
        </Card>
      </main>
    </div>
  );
};