import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import ProfileModal from './ProfileModal';

// Reusable UI Components
const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
        {children}
    </div>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const getStatusColor = (status) => {
    // In this dashboard, we only expect 'APPROVED' status
    return 'bg-green-100 text-green-800';
};

export default function SecurityDashboard({ loggedInUser, onLogout, onProfileUpdate }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const approvedRequests = await api.getAllApprovedRequests();
            setRequests(Array.isArray(approvedRequests) ? approvedRequests : []);
        } catch (err) {
            setError('Failed to fetch approved gate passes.');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleProfileSave = async (data) => {
        if (!loggedInUser?.id) return;
        if (!data) {
            alert("An unexpected error occurred. No data was received to save.");
            return;
        }

        try {
            if (data.currentPassword && data.newPassword) {
                const message = await api.changePassword(loggedInUser.id, data.currentPassword, data.newPassword);
                alert(message);
            } else {
                const updatedUser = await api.updateProfile(loggedInUser.id, data);
                onProfileUpdate(updatedUser);
                alert('Profile updated successfully!');
            }
            setIsProfileOpen(false);
        } catch (error) {
            alert(`Failed to update: ${error.message}`);
        }
    };

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  req.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = departmentFilter ? req.department === departmentFilter : true;
            return matchesSearch && matchesFilter;
        });
    }, [requests, searchTerm, departmentFilter]);
    
    // Get a unique list of departments for the filter dropdown
    const departments = useMemo(() => [...new Set(requests.map(req => req.department))], [requests]);

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

            <header className="bg-white shadow-sm sticky top-0 z-10">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">Security Dashboard</h1>
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
            </header>
            
            <main className="container mx-auto p-6">
                <Card>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Approved Gate Passes</h2>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                    </div>

                    {loading && <p className="text-center text-gray-500">Loading approved requests...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    
                    {!loading && !error && (
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            {filteredRequests.length > 0 ? filteredRequests.map(req => (
                                <div key={req.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800">{req.studentName}</p>
                                            <p className="text-sm text-gray-600">{req.rollNumber}</p>
                                            <p className="text-sm text-gray-500">{req.department} - Year {req.year}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-700"><span className="font-medium">Purpose:</span> {req.purpose}</p>
                                    <p className="text-xs text-gray-400 mt-2">Requested on: {new Date(req.createdAt).toLocaleString()}</p>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-10">No approved requests found matching your criteria.</p>
                            )}
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}

