import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (passwordData: {
    title: string;
    username: string;
    password: string;
    notes: string;
  }) => void;
}

export const AddPasswordModal: React.FC<AddPasswordModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    notes: ''
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.username || !formData.password) {
      return;
    }
    onAdd(formData);
    setFormData({ title: '', username: '', password: '', notes: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-purple-900/95 backdrop-blur-sm border border-purple-700 rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Password</h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-purple-200 block mb-2">Service/Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Gmail, GitHub"
              className="w-full bg-purple-950/50 border border-purple-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-purple-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-purple-200 block mb-2">Username/Email *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="your.email@example.com"
              className="w-full bg-purple-950/50 border border-purple-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-purple-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-purple-200 block mb-2">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter password"
              className="w-full bg-purple-950/50 border border-purple-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-purple-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-purple-200 block mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional information..."
              rows={3}
              className="w-full bg-purple-950/50 border border-purple-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none placeholder-purple-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.username || !formData.password}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all duration-300 border-none cursor-pointer font-medium"
          >
            Add Password
          </button>
        </div>
      </div>
    </div>
  );
};