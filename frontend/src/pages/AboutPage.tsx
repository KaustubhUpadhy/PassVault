import React from 'react';
import { Shield, Key, Eye, Database, Lock, Users, Zap, Check } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Header title="About PassVault" showBack onBack={() => onNavigate('home')} />

      <main className="flex-1 px-6 py-12">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-purple-600/20 rounded-full">
                <Shield className="h-16 w-16 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">PassVault</span>
            </h1>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto leading-relaxed">
              PassVault is a comprehensive password management solution designed to help you generate, 
              analyze, and securely store your passwords in the cloud with enterprise-grade security.
            </p>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <Key className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Password Generator</h3>
                <p className="text-purple-300 text-sm">Generate cryptographically secure passwords with customizable complexity settings</p>
              </Card>
              
              <Card className="text-center p-6">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Strength Analysis</h3>
                <p className="text-purple-300 text-sm">Advanced password strength checking using zxcvbn algorithms for real security assessment</p>
              </Card>
              
              <Card className="text-center p-6">
                <Eye className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Breach Detection</h3>
                <p className="text-purple-300 text-sm">Check if your passwords have been compromised in known data breaches using HaveIBeenPwned</p>
              </Card>
              
              <Card className="text-center p-6">
                <Database className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Secure Storage</h3>
                <p className="text-purple-300 text-sm">Store your passwords encrypted in the cloud with Supabase's enterprise-grade security</p>
              </Card>
            </div>
          </div>

          {/* Security Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Security & Privacy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8">
                <Lock className="h-8 w-8 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">End-to-End Encryption</h3>
                <ul className="space-y-2 text-purple-300">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>AES-256 encryption for all stored passwords</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Zero-knowledge architecture - we can't see your data</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Client-side encryption before cloud storage</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <Users className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Authentication</h3>
                <ul className="space-y-2 text-purple-300">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Multi-factor authentication support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>OAuth integration with Google and GitHub</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Secure session management</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Technology Stack</h2>
            <Card className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                    Frontend
                  </h3>
                  <ul className="space-y-1 text-purple-300">
                    <li>• React 18 with TypeScript</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Modern responsive design</li>
                    <li>• Progressive Web App features</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Database className="h-5 w-5 text-blue-400 mr-2" />
                    Backend
                  </h3>
                  <ul className="space-y-1 text-purple-300">
                    <li>• Supabase for authentication</li>
                    <li>• PostgreSQL database</li>
                    <li>• Row Level Security (RLS)</li>
                    <li>• Real-time synchronization</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-green-400 mr-2" />
                    Security
                  </h3>
                  <ul className="space-y-1 text-purple-300">
                    <li>• zxcvbn password strength</li>
                    <li>• HaveIBeenPwned API</li>
                    <li>• Cryptographically secure RNG</li>
                    <li>• HTTPS/TLS encryption</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Mission Statement */}
          <div className="text-center mb-16">
            <Card className="p-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-xl text-purple-200 leading-relaxed max-w-3xl mx-auto">
                To make digital security accessible and effortless for everyone. We believe that strong, 
                unique passwords should be the norm, not the exception. PassVault empowers users to take 
                control of their digital security without sacrificing convenience.
              </p>
            </Card>
          </div>

          {/* Contact/Support */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Get Started Today</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('home')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg transition-all duration-300 border-none cursor-pointer font-medium"
              >
                Start Using PassVault
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};