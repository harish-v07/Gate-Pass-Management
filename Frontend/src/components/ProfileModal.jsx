import React, { useState } from 'react';

// Reusable Button component
const Button = ({ children, ...props }) => (
    <button {...props} className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-300 ease-in-out ${props.className}`}>
      {children}
    </button>
);

export default function ProfileModal({ user, onClose, onSave }) {
  // State for profile details form
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  // State for password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileError('');
    if (!profileData.name || profileData.name.trim() === '') {
        setProfileError('Full Name cannot be empty.');
        return;
    }
    if (window.confirm('Are you sure you want to save these profile changes?')) {
      onSave(profileData);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match.');
        return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long.');
        return;
    }
    if (window.confirm('Are you sure you want to change your password?')) {
        onSave({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'password' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Change Password
              </button>
            </nav>
          </div>

          {/* Profile Form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="name" value={profileData.name} onChange={handleProfileChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" value={profileData.email} onChange={handleProfileChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" id="phone" value={profileData.phone} onChange={handleProfileChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                {profileError && <p className="text-sm text-red-600">{profileError}</p>}
              </div>
              <div className="bg-gray-50 px-6 py-3 -mx-6 -mb-6 mt-6 flex justify-end space-x-3 rounded-b-lg">
                  <Button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                  <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Save Changes</Button>
              </div>
            </form>
          )}

          {/* Password Form */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input type="password" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input type="password" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                </div>
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
              </div>
              <div className="bg-gray-50 px-6 py-3 -mx-6 -mb-6 mt-6 flex justify-end space-x-3 rounded-b-lg">
                  <Button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                  <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Update Password</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

