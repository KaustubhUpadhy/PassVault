import React, { useState } from 'react';
import { Shield, FileBarChart, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SecurityReportDashboard } from '../components/features/SecurityReportsDashboard';
import { PasswordService } from '../services/PasswordService';

interface SecurityReportsPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export interface SecurityReport {
  totalPasswords: number;
  safetyScore: number;
  breachedPasswords: Array<{
    serviceName: string;
    username: string;
    breachCount: number;
  }>;
  strengthAnalysis: {
    poor: number;
    low: number;
    moderate: number;
    great: number;
    excellent: number;
  };
  recommendations: Array<{
    serviceName: string;
    username: string;
    type: 'breach' | 'weak' | 'moderate';
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  generatedAt: string;
}

export const SecurityReportsPage: React.FC<SecurityReportsPageProps> = ({ 
  onNavigate, 
  showToast 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, action: '' });

  const generateSecurityReport = async () => {
    setIsGenerating(true);
    setProgress({ current: 0, total: 0, action: 'Loading passwords...' });

    try {
      // Step 1: Get all user passwords
      const passwords = await PasswordService.getAllPasswords();
      
      if (passwords.length === 0) {
        showToast('No passwords found to analyze', 'info');
        setIsGenerating(false);
        return;
      }

      const totalPasswords = passwords.length;
      setProgress({ current: 0, total: totalPasswords * 2, action: 'Analyzing passwords...' });

      const breachedPasswords: SecurityReport['breachedPasswords'] = [];
      const strengthCounts = { poor: 0, low: 0, moderate: 0, great: 0, excellent: 0 };
      const recommendations: SecurityReport['recommendations'] = [];

      // Step 2: Check each password for breaches and strength
      for (let i = 0; i < passwords.length; i++) {
        const password = passwords[i];

        // Check for breaches
        setProgress({ 
          current: i * 2 + 1, 
          total: totalPasswords * 2, 
          action: `Checking breaches for ${password.title}...` 
        });

        try {
          const breachResult = await PasswordService.checkBreach(password.password);
          if (breachResult.is_breached) {
            breachedPasswords.push({
              serviceName: password.title,
              username: password.username,
              breachCount: breachResult.breach_count
            });

            recommendations.push({
              serviceName: password.title,
              username: password.username,
              type: 'breach',
              suggestion: `Password has been found in ${breachResult.breach_count.toLocaleString()} data breaches. Change immediately!`,
              priority: 'high'
            });
          }
        } catch (error) {
          console.warn(`Breach check failed for ${password.title}:`, error);
        }

        // Check password strength
        setProgress({ 
          current: i * 2 + 2, 
          total: totalPasswords * 2, 
          action: `Analyzing strength for ${password.title}...` 
        });

        try {
          const strengthResult = await PasswordService.checkStrength(password.password);
          
          // Count strength levels
          switch (strengthResult.score) {
            case 0: strengthCounts.poor++; break;
            case 1: strengthCounts.low++; break;
            case 2: strengthCounts.moderate++; break;
            case 3: strengthCounts.great++; break;
            case 4: strengthCounts.excellent++; break;
          }

          // Add recommendations for weak passwords
          if (strengthResult.score <= 1) {
            recommendations.push({
              serviceName: password.title,
              username: password.username,
              type: 'weak',
              suggestion: strengthResult.suggestions.join(' ') || 'Use a longer, more complex password with mixed characters.',
              priority: strengthResult.score === 0 ? 'high' : 'medium'
            });
          } else if (strengthResult.score === 2) {
            recommendations.push({
              serviceName: password.title,
              username: password.username,
              type: 'moderate',
              suggestion: 'Consider making your password longer or adding more variety in characters.',
              priority: 'low'
            });
          }
        } catch (error) {
          console.warn(`Strength check failed for ${password.title}:`, error);
        }

        // Small delay to prevent overwhelming APIs
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Step 3: Calculate safety score
      setProgress({ 
        current: totalPasswords * 2, 
        total: totalPasswords * 2, 
        action: 'Calculating safety score...' 
      });

      const breachScore = Math.max(0, 100 - (breachedPasswords.length / totalPasswords) * 100);
      const strengthScore = (
        (strengthCounts.excellent * 100 + 
         strengthCounts.great * 80 + 
         strengthCounts.moderate * 60 + 
         strengthCounts.low * 30 + 
         strengthCounts.poor * 0) / totalPasswords
      );
      
      const safetyScore = Math.round((breachScore * 0.6 + strengthScore * 0.4));

      // Step 4: Create report
      const securityReport: SecurityReport = {
        totalPasswords,
        safetyScore,
        breachedPasswords,
        strengthAnalysis: strengthCounts,
        recommendations: recommendations.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }),
        generatedAt: new Date().toISOString()
      };

      setReport(securityReport);
      showToast(`Security report generated! Safety score: ${safetyScore}%`, 'success');

    } catch (error) {
      showToast('Failed to generate security report', 'error');
      console.error('Security report generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header title="Security Reports" showBack onBack={() => onNavigate('home')} onNavigate={onNavigate} />
        <SecurityReportDashboard 
          report={report} 
          onGenerateNew={() => {
            setReport(null);
            setProgress({ current: 0, total: 0, action: '' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header title="Security Reports" showBack onBack={() => onNavigate('home')} onNavigate={onNavigate} />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <FileBarChart className="h-24 w-24 text-blue-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Security Reports</h1>
          <p className="text-purple-300 text-lg">Comprehensive analysis of your password security</p>
        </div>

        <Card className="mb-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-4">What's Included in Your Security Report</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">Overall Safety Score</h3>
                    <p className="text-purple-300 text-sm">A comprehensive score out of 100% based on password strength and breach status</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">Breach Analysis</h3>
                    <p className="text-purple-300 text-sm">Identifies which passwords have been compromised in known data breaches</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">Strength Distribution</h3>
                    <p className="text-purple-300 text-sm">Visual breakdown of password strength levels across your vault</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileBarChart className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">Personalized Recommendations</h3>
                    <p className="text-purple-300 text-sm">Specific suggestions to improve your password security</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 mt-6">
              <h4 className="text-blue-400 font-medium mb-2">🔒 Privacy & Security</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• All analysis is performed securely using industry-standard methods</li>
                <li>• Your actual passwords are never transmitted or stored during analysis</li>
                <li>• Breach checking uses k-anonymity to protect your privacy</li>
                <li>• Reports are generated in real-time and not stored on our servers</li>
              </ul>
            </div>
          </div>
        </Card>

        {isGenerating ? (
          <Card className="text-center py-12">
            <Loader2 className="h-16 w-16 text-purple-400 mx-auto mb-6 animate-spin" />
            <h3 className="text-xl font-semibold text-white mb-2">Generating Security Report</h3>
            <p className="text-purple-300 mb-4">{progress.action}</p>
            
            {progress.total > 0 && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-purple-400 mb-2">
                  <span>Progress</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full bg-purple-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <div className="text-center">
            <Button
              onClick={generateSecurityReport}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
            >
              <FileBarChart className="h-6 w-6 mr-2" />
              Generate Security Report
            </Button>
            
            <p className="text-purple-400 text-sm mt-4">
              This will analyze all passwords in your vault for security issues
            </p>
          </div>
        )}
      </main>
    </div>
  );
};