import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RefreshCw, Shield, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SecurityReport } from '../../pages/SecurityReportsPage';

interface SecurityReportDashboardProps {
  report: SecurityReport;
  onGenerateNew: () => void;
}

export const SecurityReportDashboard: React.FC<SecurityReportDashboardProps> = ({
  report,
  onGenerateNew
}) => {
  // Prepare data for safety score pie chart
  const safetyData = [
    { name: 'Safe', value: report.safetyScore, color: '#10b981' },
    { name: 'At Risk', value: 100 - report.safetyScore, color: '#ef4444' }
  ];

  // Prepare data for strength distribution pie chart
  const strengthData = [
    { name: 'Excellent', value: report.strengthAnalysis.excellent, color: '#10b981' },
    { name: 'Great', value: report.strengthAnalysis.great, color: '#3b82f6' },
    { name: 'Moderate', value: report.strengthAnalysis.moderate, color: '#f59e0b' },
    { name: 'Low', value: report.strengthAnalysis.low, color: '#f97316' },
    { name: 'Poor', value: report.strengthAnalysis.poor, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSafetyLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-600 bg-red-900/20';
      case 'medium': return 'text-yellow-400 border-yellow-600 bg-yellow-900/20';
      case 'low': return 'text-blue-400 border-blue-600 bg-blue-900/20';
      default: return 'text-purple-400 border-purple-600 bg-purple-900/20';
    }
  };

  return (
    <main className="container mx-auto px-6 py-6 max-w-7xl">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Report Dashboard</h1>
          <div className="flex items-center space-x-2 text-purple-300">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Generated on {formatDate(report.generatedAt)}</span>
          </div>
        </div>
        <Button onClick={onGenerateNew} variant="secondary" className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Generate New Report</span>
        </Button>
      </div>

      {/* Top Row - Safety Score and Breach Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Safety Score Card */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-400" />
              Overall Safety Score
            </h2>
            <div className={`text-3xl font-bold ${getSafetyColor(report.safetyScore)}`}>
              {report.safetyScore}%
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safetyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {safetyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{
                    backgroundColor: '#1e1b4b',
                    border: '1px solid #7c3aed',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center mt-4">
            <p className={`text-lg font-semibold ${getSafetyColor(report.safetyScore)}`}>
              {getSafetyLabel(report.safetyScore)} Security
            </p>
            <p className="text-purple-300 text-sm">
              {report.totalPasswords} passwords analyzed
            </p>
          </div>
        </Card>

        {/* Breach Report Card */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-red-400" />
              Breach Report
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-400">
                {report.breachedPasswords.length}
              </div>
              <div className="text-sm text-purple-300">compromised</div>
            </div>
          </div>

          {report.breachedPasswords.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {report.breachedPasswords.map((breach, index) => (
                <div key={index} className="bg-red-900/20 border border-red-600 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{breach.serviceName}</h4>
                      <p className="text-red-300 text-sm">{breach.username}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-semibold">
                        {breach.breachCount.toLocaleString()}
                      </div>
                      <div className="text-red-300 text-xs">breaches</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-16 w-16 text-green-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-green-400 mb-2">No Breaches Found!</h3>
              <p className="text-purple-300">All your passwords are secure from known data breaches</p>
            </div>
          )}

          {/* Strength Distribution Mini Chart */}
          <div className="mt-6 pt-4 border-t border-purple-700">
            <h3 className="text-purple-200 font-medium mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Password Strength Distribution
            </h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={strengthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {strengthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'passwords']}
                    contentStyle={{
                      backgroundColor: '#1e1b4b',
                      border: '1px solid #7c3aed',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', color: '#c4b5fd' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row - Recommendations */}
      <Card>
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-blue-400" />
          Security Recommendations
        </h2>

        {report.recommendations.length > 0 ? (
          <div className="space-y-4">
            {report.recommendations.map((rec, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{rec.serviceName}</h4>
                    <p className="text-sm opacity-80">{rec.username}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      rec.type === 'breach' ? 'bg-red-900/20 border-red-600 text-red-400' :
                      rec.type === 'weak' ? 'bg-orange-900/20 border-orange-600 text-orange-400' :
                      'bg-yellow-900/20 border-yellow-600 text-yellow-400'
                    }`}>
                      {rec.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-sm">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="h-16 w-16 text-green-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-green-400 mb-2">All Passwords Look Great!</h3>
            <p className="text-purple-300">No immediate security recommendations needed</p>
          </div>
        )}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-purple-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{report.totalPasswords}</div>
          <div className="text-purple-300 text-sm">Total Passwords</div>
        </div>
        <div className="bg-red-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{report.breachedPasswords.length}</div>
          <div className="text-purple-300 text-sm">Breached</div>
        </div>
        <div className="bg-green-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {report.strengthAnalysis.excellent + report.strengthAnalysis.great}
          </div>
          <div className="text-purple-300 text-sm">Strong Passwords</div>
        </div>
        <div className="bg-yellow-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{report.recommendations.length}</div>
          <div className="text-purple-300 text-sm">Recommendations</div>
        </div>
      </div>
    </main>
  );
};