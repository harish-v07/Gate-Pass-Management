import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import ProfileModal from './ProfileModal';

// Reusable UI Components for consistent styling
const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow-lg rounded-xl p-6 md:p-8 ${className}`}>
        {children}
    </div>
);

const Button = ({ children, ...props }) => (
    <button {...props} className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-300 ease-in-out ${props.className}`}>
      {children}
    </button>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default function ApprovalDashboard({ loggedInUser, onLogout, onProfileUpdate }) {
    const [activeTab, setActiveTab] = useState('pending');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Fetches requests based on the active tab and logged-in user
    const fetchRequests = useCallback(async () => {
        // Guard against running before user data is available
        if (!loggedInUser?.id || !loggedInUser?.role) return;

        setLoading(true);
        setError('');
        try {
            const data = activeTab === 'pending'
                ? await api.getPendingRequests(loggedInUser.role, loggedInUser.id)
                : await api.getApprovalHistory(loggedInUser.role, loggedInUser.id);
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(`Failed to fetch ${activeTab} requests. Please try again.`);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab, loggedInUser?.id, loggedInUser?.role]); // Use stable primitive values to prevent loops

    // Re-fetch data whenever the user or active tab changes
    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Handles approve, reject, and modify actions
    const handleAction = async (action, requestId) => {
        if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;
        try {
            if (action === 'approve') await api.approveRequest(requestId, loggedInUser.role);
            else if (action === 'reject') await api.rejectRequest(requestId);
            else if (action === 'modify') await api.modifyApproval(requestId);
            alert(`Request ${action}d successfully!`);
            fetchRequests(); // Refresh list after action
        } catch (err) {
            alert(`Error performing action: ${err.message}`);
        }
    };
    
    // Handles saving data from the ProfileModal
    const handleProfileSave = async (data) => {
        if (!loggedInUser?.id) return;
        if (!data) {
            alert("An unexpected error occurred. No data was received to save.");
            return;
        }
        
        try {
            // Check if the data object is for a password change or a profile update
            if (data.currentPassword && data.newPassword) {
                const message = await api.changePassword(loggedInUser.id, data.currentPassword, data.newPassword);
                alert(message); // Show success/error message from backend
            } else {
                const updatedUser = await api.updateProfile(loggedInUser.id, data);
                onProfileUpdate(updatedUser); // Update the user state in App.jsx
                alert('Profile updated successfully!');
            }
            setIsProfileOpen(false); // Close modal on success
        } catch (error) {
            alert(`Failed to update: ${error.message}`);
        }
    };

    // Guard Clause: Prevents the component from crashing if user data isn't ready
    if (!loggedInUser) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {isProfileOpen && <ProfileModal user={loggedInUser} onClose={() => setIsProfileOpen(false)} onSave={handleProfileSave} />}
            
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">{loggedInUser.role} Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsProfileOpen(true)} className="p-1 rounded-full hover:bg-gray-100">
                            <UserIcon />
                        </button>
                        <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                </nav>
                <div className="container mx-auto px-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button onClick={() => setActiveTab('pending')} className={`${activeTab === 'pending' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Pending Requests</button>
                        <button onClick={() => setActiveTab('history')} className={`${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Approval History</button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto p-6">
                <Card>
                    {loading && <p className="text-center text-gray-500">Loading requests...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div className="space-y-4">
                            {requests.length > 0 ? requests.map(req => (
                                <div key={req.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <p><strong>{req.studentName}</strong> ({req.rollNumber})</p>
                                    <p className="text-sm text-gray-600 mt-1">Purpose: {req.purpose}</p>
                                    <p className="text-xs text-gray-500 mt-2">Submitted: {new Date(req.createdAt).toLocaleString()}</p>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        {activeTab === 'pending' ? (
                                            <>
                                                <Button onClick={() => handleAction('reject', req.id)} className="bg-red-500 text-white hover:bg-red-600">Reject</Button>
                                                <Button onClick={() => handleAction('approve', req.id)} className="bg-green-500 text-white hover:bg-green-600">Approve</Button>
                                            </>
                                        ) : (
                                            <Button onClick={() => handleAction('modify', req.id)} className="bg-yellow-500 text-white hover:bg-yellow-600">Modify Approval</Button>
                                        )}
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-500 py-10">No requests found in this view.</p>}
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}

