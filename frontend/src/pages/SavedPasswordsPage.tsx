import React, { useState } from 'react';
import { Database, Plus, Search, Edit, Trash2, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { SavedPasswordsTable } from '../components/features/SavedPasswordsTable';
import { AddPasswordModal } from '../components/features/AddPasswordModal';
import { ConfirmationModal } from '../components/features/ConfirmationModal';
import { PasswordService } from '../services/PasswordService';
import { Password } from '../config/supabase';

interface SavedPasswordsPageProps {
  onNavigate: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SavedPasswordsPage: React.FC<SavedPasswordsPageProps> = ({ onNavigate, showToast }) => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'search' | 'all'>('search');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Password[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<{[key: string]: Password}>({});
  const [pendingAction, setPendingAction] = useState<'delete' | 'showAll' | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showToast("Please enter a search term", "error");
      return;
    }

    setLoading(true);
    try {
      const results = await PasswordService.searchPasswords(searchQuery);
      setSearchResults(results);
      showToast(`Found ${results.length} matching passwords`, "success");
    } catch (error) {
      showToast("Error searching passwords", "error");
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllPasswords = async () => {
    setLoading(true);
    try {
      const allPasswords = await PasswordService.getAllPasswords();
      setPasswords(allPasswords);
      setView('all');
      setShowConfirmModal(false);
      showToast("Showing all passwords", "info");
    } catch (error) {
      showToast("Error loading passwords", "error");
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAllClick = () => {
    setPendingAction('showAll');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (pendingAction === 'showAll') {
      loadAllPasswords();
    } else if (pendingAction === 'delete') {
      handleDeleteConfirmed();
    }
    setPendingAction(null);
  };

  const handleDeleteConfirmed = async () => {
    setLoading(true);
    try {
      await PasswordService.deletePasswords(Array.from(selectedIds));
      
      // Update local state
      const newPasswords = passwords.filter(p => !selectedIds.has(p.id));
      setPasswords(newPasswords);
      setSelectedIds(new Set());
      setShowConfirmModal(false);
      showToast(`Deleted ${selectedIds.size} passwords`, "success");
    } catch (error) {
      showToast("Error deleting passwords", "error");
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassword = async (passwordData: {
    title: string;
    username: string;
    password: string;
    notes: string;
  }) => {
    setLoading(true);
    try {
      const newPassword = await PasswordService.addPassword({
        title: passwordData.title,
        username: passwordData.username,
        password: passwordData.password,
        notes: passwordData.notes
      });

      setPasswords(prev => [newPassword, ...prev]);
      setShowAddModal(false);
      showToast("Password added successfully!", "success");
    } catch (error) {
      showToast("Error adding password", "error");
      console.error('Add error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(passwords.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectPassword = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleEditMode = () => {
    if (selectedIds.size === 0) {
      showToast("Please select passwords to edit", "error");
      return;
    }
    
    const editableData: {[key: string]: Password} = {};
    selectedIds.forEach(id => {
      const password = passwords.find(p => p.id === id);
      if (password) {
        editableData[id] = { ...password };
      }
    });
    
    setEditData(editableData);
    setEditMode(true);
  };

  const handleSaveEdits = async () => {
    setLoading(true);
    try {
      const updates = await Promise.all(
        Object.entries(editData).map(([id, passwordData]) =>
          PasswordService.updatePassword(id, {
            title: passwordData.title,
            username: passwordData.username,
            password: passwordData.password,
            notes: passwordData.notes
          })
        )
      );

      // Update local state with the updated passwords
      const updatedPasswords = passwords.map(p => {
        const updated = updates.find(u => u.id === p.id);
        return updated || p;
      });

      setPasswords(updatedPasswords);
      setEditMode(false);
      setEditData({});
      setSelectedIds(new Set());
      showToast("Changes saved successfully!", "success");
    } catch (error) {
      showToast("Error saving changes", "error");
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    if (selectedIds.size === 0) {
      showToast("Please select passwords to delete", "error");
      return;
    }
    setPendingAction('delete');
    setShowConfirmModal(true);
  };

  const handleShowPasswordsToggle = () => {
    if (selectedIds.size === 0) {
      showToast("Please select passwords to show/hide", "error");
      return;
    }

    const newShowPasswords = new Set(showPasswords);
    selectedIds.forEach(id => {
      if (newShowPasswords.has(id)) {
        newShowPasswords.delete(id);
      } else {
        newShowPasswords.add(id);
      }
    });
    setShowPasswords(newShowPasswords);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`, "success");
    } catch {
      showToast("Failed to copy", "error");
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
      <span className="ml-2 text-purple-300">Loading...</span>
    </div>
  );

  // Search View
  if (view === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header title="Saved Passwords" showBack onBack={() => onNavigate('home')} onNavigate={onNavigate} />

        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="text-center mb-8">
            <Database className="h-24 w-24 text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Password Vault</h1>
            <p className="text-purple-300 text-lg">Search and manage your saved passwords</p>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-300 border-none cursor-pointer flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Password</span>
            </button>
          </div>

          {/* Search Section */}
          <Card className="mb-6">
            <div className="flex space-x-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by service name or username..."
                  className="w-full bg-purple-950/50 border border-purple-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-purple-400"
                  onKeyPress={(e) => e.key === 'Enter' && !loading && handleSearch()}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors border-none cursor-pointer flex items-center space-x-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span>Search</span>
              </button>
            </div>

            <button
              onClick={handleShowAllClick}
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors border-none cursor-pointer"
            >
              Show All Passwords
            </button>
          </Card>

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Search Results */}
          {!loading && searchResults.length > 0 && (
            <Card>
              <h3 className="text-white text-lg font-semibold mb-4">Search Results ({searchResults.length})</h3>
              <div className="space-y-3">
                {searchResults.map((password) => (
                  <div key={password.id} className="bg-purple-800/30 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">{password.title}</h4>
                      <p className="text-purple-300 text-sm">{password.username}</p>
                      {password.notes && <p className="text-purple-400 text-xs mt-1">{password.notes}</p>}
                    </div>
                    <button
                      onClick={() => copyToClipboard(password.password, 'Password')}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm border-none cursor-pointer flex items-center space-x-1"
                    >
                      <span>Copy</span>
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {!loading && searchResults.length === 0 && searchQuery && (
            <Card className="text-center py-12">
              <Database className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white mb-2">No Results Found</h3>
              <p className="text-purple-300">No passwords match your search criteria</p>
            </Card>
          )}
        </main>

        <AddPasswordModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPassword}
        />

        <ConfirmationModal
          isOpen={showConfirmModal && pendingAction === 'showAll'}
          title="Show All Passwords?"
          message="This will display your entire password vault. Passwords are encrypted and secure."
          onConfirm={handleConfirmAction}
          onCancel={() => setShowConfirmModal(false)}
        />
      </div>
    );
  }

  // All Passwords View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="w-full p-6 flex justify-between items-center border-b border-purple-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setView('search')}
            className="flex items-center space-x-2 bg-transparent text-purple-300 hover:text-white hover:bg-purple-800 px-3 py-2 rounded-lg transition-colors border-none cursor-pointer"
          >
            <span>← Back to Search</span>
          </button>
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">All Passwords ({passwords.length})</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {editMode ? (
            <>
              <button
                onClick={handleSaveEdits}
                disabled={loading}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors border-none cursor-pointer flex items-center space-x-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => {setEditMode(false); setEditData({}); setSelectedIds(new Set());}}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors border-none cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditMode}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors border-none cursor-pointer flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={loading}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors border-none cursor-pointer flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
              <button
                onClick={handleShowPasswordsToggle}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors border-none cursor-pointer flex items-center space-x-2"
              >
                {showPasswords.size > 0 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>Show/Hide</span>
              </button>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 max-w-7xl">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <SavedPasswordsTable
            passwords={passwords}
            selectedIds={selectedIds}
            showPasswords={showPasswords}
            editMode={editMode}
            editData={editData}
            onSelectPassword={handleSelectPassword}
            onSelectAll={handleSelectAll}
            onEditDataChange={setEditData}
            onCopyToClipboard={copyToClipboard}
          />
        )}

        {/* Instructions */}
        <Card className="mt-6 bg-blue-900/30 border border-blue-600">
          <h4 className="text-blue-400 font-medium mb-2">💡 How to use:</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Select passwords using checkboxes, then use action buttons above</li>
            <li>• <strong>Edit:</strong> Modify selected entries inline, then save changes</li>
            <li>• <strong>Delete:</strong> Remove selected entries permanently</li>
            <li>• <strong>Show/Hide:</strong> Toggle password visibility for selected entries</li>
            <li>• Use individual copy buttons to copy usernames or passwords</li>
            <li>• 🔐 All passwords are encrypted and stored securely</li>
          </ul>
        </Card>
      </main>

      <AddPasswordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddPassword}
      />

      <ConfirmationModal
        isOpen={showConfirmModal && pendingAction === 'delete'}
        title="Delete Selected Passwords?"
        message={`Are you sure you want to delete ${selectedIds.size} selected password(s)? This action cannot be undone.`}
        onConfirm={handleConfirmAction}
        onCancel={() => setShowConfirmModal(false)}
        confirmButtonColor="red"
      />
    </div>
  );
};