import React, { useState, useEffect, useCallback } from 'react';
import ProfileModal from './ProfileModal';
import GatePassForm from './GatePassForm';
import GatePassStatus from './GatePassStatus';
import { api } from '../services/api';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default function StudentDashboard({ loggedInUser, onLogout, onProfileUpdate }) {
    const [activeTab, setActiveTab] = useState('apply'); // 'apply' or 'status'
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // ** THE FIX IS HERE **
    // This function now correctly handles both profile and password updates.
    const handleProfileSave = async (data) => {
        if (!loggedInUser?.id) return;
        
        if (!data) {
            alert("An unexpected error occurred. No data was received to save.");
            return;
        }

        try {
            // Check if the data object is for a password change
            if (data.currentPassword && data.newPassword) {
                const message = await api.changePassword(loggedInUser.id, data.currentPassword, data.newPassword);
                alert(message); // Show the success message from the backend
            } else {
                // Otherwise, it's a standard profile update
                const updatedUser = await api.updateProfile(loggedInUser.id, data);
                onProfileUpdate(updatedUser); // Update the user state in App.jsx
                alert('Profile updated successfully!');
            }
            setIsProfileOpen(false); // Close the modal on success
        } catch (error) {
            // Show the specific error message from the backend
            alert(`Failed to update: ${error.message}`);
        }
    };

    if (!loggedInUser) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading dashboard...</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {isProfileOpen && (
                <ProfileModal
                    user={loggedInUser}
                    onClose={() => setIsProfileOpen(false)}
                    onSave={handleProfileSave}
                />
            )}

            <header className="bg-white shadow-sm">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">Student Dashboard</h1>
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
                            <UserIcon />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                <button
                                    onClick={() => { setIsProfileOpen(true); setDropdownOpen(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    My Profile
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
                     <nav className="-mb-px flex space-x-8">
                        <button onClick={() => setActiveTab('apply')} className={`${activeTab === 'apply' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Apply for Gate Pass</button>
                        <button onClick={() => setActiveTab('status')} className={`${activeTab === 'status' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Check Status</button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto p-6">
                {activeTab === 'apply' && <GatePassForm user={loggedInUser} />}
                {activeTab === 'status' && <GatePassStatus studentId={loggedInUser.id} />}
            </main>
        </div>
    );
}

