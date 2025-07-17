import React from 'react';
import { Database, Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface SavedPasswordsPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SavedPasswordsPage: React.FC<SavedPasswordsPageProps> = ({ onNavigate, showToast }) => {
  const savedPasswords: any[] = []; // Empty for now

  const handleAddPassword = () => {
    showToast("Password saving will be implemented with Supabase backend!", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header title="Saved Passwords" showBack onBack={() => onNavigate('home')} onNavigate={onNavigate} />

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <Database className="h-24 w-24 text-blue-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Saved Passwords</h1>
          <p className="text-purple-300 text-lg">Manage your encrypted passwords stored in the cloud</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={handleAddPassword} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Password</span>
          </Button>
        </div>

        {savedPasswords.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Database className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Saved Passwords</h3>
              <p className="text-purple-300 mb-4">You haven't saved any passwords yet.</p>
              <Button onClick={handleAddPassword}>Add Your First Password</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {savedPasswords.map((password) => (
              <Card key={password.id} className="hover:bg-purple-800/20 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{password.title}</h3>
                    <p className="text-purple-300">{password.website}</p>
                    <p className="text-purple-400 text-sm">{password.username}</p>
                  </div>
                  <div className="text-purple-400 text-sm">
                    {new Date(password.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 bg-purple-900/20">
          <p className="text-white text-xl">Coming Soon!</p>
          <p className="text-purple-300 mt-2">Full password management will be available once the Supabase backend is implemented.</p>
        </Card>
      </main>
    </div>
  );
};