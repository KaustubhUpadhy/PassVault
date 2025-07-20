import React, { useState } from 'react';
import { RefreshCw, Loader } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';
import { Checkbox } from '../components/ui/Checkbox';
import { PasswordInput } from '../components/features/PasswordInput';
import { EntropyDisplay } from '../components/features/EntropyDisplay';
import { usePasswordSettings } from '../hooks/usePasswordSettings';
import { useClipboard } from '../hooks/useClipboard';
import { PasswordService } from '../services/PasswordService';

interface GeneratorPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({ onNavigate, showToast }) => {
  const { settings, updateSettings } = usePasswordSettings();
  const { copied, copyToClipboard } = useClipboard(showToast);
  const [password, setPassword] = useState('');
  const [entropy, setEntropy] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!settings.includeUppercase && !settings.includeLowercase && 
        !settings.includeNumbers && !settings.includeSymbols) {
      showToast("Please select at least one character type", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await PasswordService.generatePassword({
        length: settings.length,
        include_uppercase: settings.includeUppercase,
        include_lowercase: settings.includeLowercase,
        include_numbers: settings.includeNumbers,
        include_symbols: settings.includeSymbols,
      });
      
      setPassword(result.password);
      setEntropy(result.entropy_bits);
      showToast("Password generated successfully!", "success");
    } catch (error) {
      showToast("Failed to generate password", "error");
      console.error('Password generation error:', error);
    } finally {
      setIsGenerating(false);
    }
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
          {/* Generated Password Display */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-purple-200">Generated Password</label>
            <PasswordInput
              value={password}
              placeholder="Click generate to create a password"
              readOnly
              showCopyButton
              onCopy={() => copyToClipboard(password)}
              copied={copied}
            />
            
            {/* Entropy Display */}
            {password && entropy > 0 && (
              <EntropyDisplay entropy={entropy} />
            )}
          </div>

          {/* Password Length */}
          <Slider
            value={settings.length}
            onChange={(length) => updateSettings({ length })}
            min={12}
            max={50}
            label="Length"
          />

          {/* Character Options */}
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

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-none cursor-pointer flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                <span>Generate Password</span>
              </>
            )}
          </button>
        </Card>

        {/* Security Tips */}
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