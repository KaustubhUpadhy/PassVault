import React from 'react';
import { Copy} from 'lucide-react';

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface SavedPasswordsTableProps {
  passwords: Password[];
  selectedIds: Set<string>;
  showPasswords: Set<string>;
  editMode: boolean;
  editData: {[key: string]: Password};
  onSelectPassword: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEditDataChange: (editData: {[key: string]: Password}) => void;
  onCopyToClipboard: (text: string, label: string) => void;
}

export const SavedPasswordsTable: React.FC<SavedPasswordsTableProps> = ({
  passwords,
  selectedIds,
  showPasswords,
  editMode,
  editData,
  onSelectPassword,
  onSelectAll,
  onEditDataChange,
  onCopyToClipboard
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Select All */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={selectedIds.size === passwords.length}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="w-4 h-4 accent-purple-600"
        />
        <label className="text-purple-200 text-sm">
          Select All ({selectedIds.size} of {passwords.length} selected)
        </label>
      </div>

      {/* Password Table */}
      <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Select</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Service</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Username</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Password</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Notes</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Created</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Updated</th>
                <th className="px-4 py-3 text-left text-purple-200 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((password, index) => (
                <tr key={password.id} className={`${index % 2 === 0 ? 'bg-purple-800/20' : 'bg-purple-800/10'} hover:bg-purple-700/30 transition-colors`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(password.id)}
                      onChange={(e) => onSelectPassword(password.id, e.target.checked)}
                      className="w-4 h-4 accent-purple-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {editMode && editData[password.id] ? (
                      <input
                        type="text"
                        value={editData[password.id].title}
                        onChange={(e) => onEditDataChange({
                          ...editData,
                          [password.id]: {...editData[password.id], title: e.target.value}
                        })}
                        className="bg-purple-950/50 border border-purple-700 text-white px-2 py-1 rounded text-sm w-full"
                      />
                    ) : (
                      <span className="text-white font-medium">{password.title}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editMode && editData[password.id] ? (
                      <input
                        type="text"
                        value={editData[password.id].username}
                        onChange={(e) => onEditDataChange({
                          ...editData,
                          [password.id]: {...editData[password.id], username: e.target.value}
                        })}
                        className="bg-purple-950/50 border border-purple-700 text-white px-2 py-1 rounded text-sm w-full"
                      />
                    ) : (
                      <span className="text-purple-300">{password.username}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editMode && editData[password.id] ? (
                      <input
                        type="password"
                        value={editData[password.id].password}
                        onChange={(e) => onEditDataChange({
                          ...editData,
                          [password.id]: {...editData[password.id], password: e.target.value}
                        })}
                        className="bg-purple-950/50 border border-purple-700 text-white px-2 py-1 rounded text-sm w-full"
                      />
                    ) : (
                      <span className="text-purple-400 font-mono">
                        {showPasswords.has(password.id) ? password.password : '••••••••••••'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editMode && editData[password.id] ? (
                      <input
                        type="text"
                        value={editData[password.id].notes || ''}
                        onChange={(e) => onEditDataChange({
                          ...editData,
                          [password.id]: {...editData[password.id], notes: e.target.value}
                        })}
                        className="bg-purple-950/50 border border-purple-700 text-white px-2 py-1 rounded text-sm w-full"
                      />
                    ) : (
                      <span className="text-purple-400 text-sm">{password.notes || '-'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-purple-400 text-sm">{formatDate(password.created_at)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-purple-400 text-sm">{formatDate(password.updated_at)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => onCopyToClipboard(password.username, 'Username')}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-1 rounded text-xs border-none cursor-pointer"
                        title="Copy Username"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onCopyToClipboard(password.password, 'Password')}
                        className="bg-green-600 hover:bg-green-500 text-white p-1 rounded text-xs border-none cursor-pointer"
                        title="Copy Password"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};