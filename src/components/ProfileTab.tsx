import { useState } from 'react';
import { User } from '../components/Dashboard';
import { UserCircle, Mail, Lock, Trash2, Save, X } from 'lucide-react';

type ProfileTabProps = {
  user: User;
  onUpdateUser: (user: User) => void;
  onDeleteAccount: () => void;
};

export function ProfileTab({ user, onUpdateUser, onDeleteAccount }: ProfileTabProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateName = () => {
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, name: newName } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    onUpdateUser({ ...user, name: newName });
    setIsEditingName(false);
    setSuccess('Name updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Verify current password
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((u: any) => u.id === user.id);

    if (!currentUser || currentUser.password !== currentPassword) {
      setError('Current password is incorrect');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Update password
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, password: newPassword } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccess('Password changed successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        'This is your last chance. Are you absolutely sure you want to delete your account?'
      );

      if (doubleConfirm) {
        // Remove user from users list
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter((u: any) => u.id !== user.id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Remove user's data
        localStorage.removeItem(`categories_${user.id}`);
        localStorage.removeItem(`expenses_${user.id}`);

        onDeleteAccount();
      }
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl text-gray-900 mb-6">Profile Settings</h2>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg text-gray-900 mb-4">Profile Information</h3>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name</label>
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
              <button
                onClick={handleUpdateName}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Save className="size-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setNewName(user.name);
                  setError('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <X className="size-4" />
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <UserCircle className="size-5 text-gray-600" />
                <span className="text-gray-900">{user.name}</span>
              </div>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <Mail className="size-5 text-gray-600" />
            <span className="text-gray-900">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg text-gray-900 mb-4">Change Password</h3>

        {!isChangingPassword ? (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Lock className="size-4" />
            Change Password
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setError('');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg text-red-900 mb-2">Danger Zone</h3>
        <p className="text-red-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Trash2 className="size-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}