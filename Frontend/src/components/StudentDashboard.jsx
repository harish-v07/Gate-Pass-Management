import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api'; // Import the api service
import GatePassForm from './GatePassForm';
import ProfileModal from './ProfileModal';
import GatePassStatus from './GatePassStatus';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function StudentDashboard({ loggedInUser, onLogout, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('apply');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // This function now correctly calls the API
  const handleSaveProfile = async (profileData) => {
    try {
      const updatedUser = await api.updateProfile(loggedInUser.id, profileData);
      // Call the function from App.jsx to update the global user state
      onProfileUpdate(updatedUser);
      setIsModalOpen(false); // Close modal on successful save
    } catch (error) {
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">Student Dashboard</h1>
          <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="rounded-full p-1 hover:bg-gray-200 transition">
              <UserIcon />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <div className="px-4 py-2 text-sm text-gray-700">
                  Signed in as <br />
                  <strong className="font-semibold">{loggedInUser.name}</strong>
                </div>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Profile
                </button>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
        
        <div className="container mx-auto px-6 border-b border-gray-200">
            <div className="flex space-x-4">
                <button 
                    onClick={() => setActiveTab('apply')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'apply' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Apply for Gate Pass
                </button>
                <button 
                    onClick={() => setActiveTab('status')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'status' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Check Status
                </button>
            </div>
        </div>
      </header>

      <main>
        {activeTab === 'apply' && <GatePassForm loggedInUser={loggedInUser} />}
        {activeTab === 'status' && <GatePassStatus studentId={loggedInUser.id} />}
      </main>

      {isModalOpen && (
        <ProfileModal
          user={loggedInUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
