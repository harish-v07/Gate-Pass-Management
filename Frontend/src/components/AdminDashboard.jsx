import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import ProfileModal from './ProfileModal';

// Reusable UI Components
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LoadingScreen = ({ message = "Loading..." }) => (
    <div className="flex h-screen bg-gray-100 items-center justify-center">
        <p className="text-lg text-gray-600">{message}</p>
    </div>
);

// A dedicated modal for editing users, with its own validation.
const EditUserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'STUDENT',
        password: '' // Password is blank by default for security
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        // Client-side validation to prevent sending empty required fields
        if (!formData.name.trim() || !formData.username.trim()) {
            setError('Name and Username cannot be empty.');
            return;
        }
        onSave(user.id, formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Edit User: {user.name}</h2>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <div className="space-y-4">
                            <div><label htmlFor="name" className="block text-sm font-medium">Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md"/></div>
                            <div><label htmlFor="username" className="block text-sm font-medium">Username</label><input type="text" id="username" value={formData.username} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md"/></div>
                            <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md"/></div>
                            <div><label htmlFor="password" className="block text-sm font-medium">New Password</label><input type="password" id="password" placeholder="Leave blank to keep unchanged" onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md"/></div>
                            <div><label htmlFor="role" className="block text-sm font-medium">Role</label><select id="role" value={formData.role} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md"><option value="STUDENT">Student</option><option value="TUTOR">Tutor</option><option value="WARDEN">Warden</option><option value="SECURITY">Security</option><option value="ADMIN">Admin</option></select></div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
                        <Button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
                        <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function AdminDashboard({ user, onLogout, onProfileUpdate }) {
    const [activeView, setActiveView] = useState('viewUsers');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'STUDENT' });
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const userList = await api.adminGetAllUsers();
            setUsers(Array.isArray(userList) ? userList : []);
            setError('');
        } catch (err) {
            setError('Failed to fetch users.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.username || !formData.password) {
            alert('Please fill all fields.');
            return;
        }
        try {
            await api.adminCreateUser(formData);
            alert('User created successfully!');
            setFormData({ name: '', username: '', password: '', role: 'STUDENT' });
            fetchUsers();
            setActiveView('viewUsers');
        } catch (err) {
            alert(`Error creating user: ${err.message}`);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete "${userName}"? This cannot be undone.`)) {
            try {
                await api.adminDeleteUser(userId);
                alert('User deleted successfully!');
                fetchUsers();
            } catch (err) {
                alert(`Error deleting user: ${err.message}`);
            }
        }
    };
    
    const handleEditSave = async (userId, updatedData) => {
        try {
            await api.adminUpdateUser(userId, updatedData);
            alert('User updated successfully!');
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            alert(`Error updating user: ${err.message}`);
        }
    };

    const handleProfileSave = async (data) => {
        if (!user?.id) return;
        try {
            if (data.currentPassword && data.newPassword) {
                const message = await api.changePassword(user.id, data.currentPassword, data.newPassword);
                alert(message);
            } else {
                const updatedUser = await api.updateProfile(user.id, data);
                onProfileUpdate(updatedUser);
                alert('Profile updated successfully!');
            }
            setIsProfileOpen(false);
        } catch (error) {
            alert(`Failed to update: ${error.message}`);
        }
    };
    
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  u.username.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = roleFilter ? u.role === roleFilter : true;
            return matchesSearch && matchesFilter;
        });
    }, [users, searchTerm, roleFilter]);

    const NavItem = ({ view, label }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full text-left px-4 py-2 rounded-lg ${activeView === view ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
        >
            {label}
        </button>
    );

    if (!user) { return <LoadingScreen message="Loading admin dashboard..." />; }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleEditSave}
                />
            )}
            {isProfileOpen && (
                <ProfileModal 
                    user={user} 
                    onClose={() => setIsProfileOpen(false)} 
                    onSave={handleProfileSave} 
                />
            )}
            
            <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
                <div className="text-2xl font-bold text-indigo-600 mb-6">Admin Panel</div>
                
                {/* ** THE FIX IS HERE **: Added the admin's profile section to the sidebar */}
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 mb-6">
                    <button onClick={() => setIsProfileOpen(true)} className="focus:outline-none">
                        <UserIcon />
                    </button>
                    <div>
                        <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    <NavItem view="viewUsers" label="View Users" />
                    <NavItem view="addUser" label="Add New User" />
                </nav>
                <div className="mt-auto">
                    <button onClick={onLogout} className="w-full py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    {activeView === 'viewUsers' && (
                        <Card>
                             <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h2>
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <input
                                    type="text"
                                    placeholder="Search by name or username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">All Roles</option>
                                    <option value="STUDENT">Student</option>
                                    <option value="TUTOR">Tutor</option>
                                    <option value="WARDEN">Warden</option>
                                    <option value="SECURITY">Security</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            
                            {loading && <p>Loading users...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            
                            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
                                {!loading && filteredUsers.map(u => (
                                    <div key={u.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-semibold">{u.name} <span className="text-gray-500">(@{u.username})</span></p>
                                            <p className="text-sm text-gray-600 capitalize">{u.role.toLowerCase()}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button onClick={() => setEditingUser(u)} className="bg-blue-500 text-white hover:bg-blue-600 w-auto">Edit</Button>
                                            <Button onClick={() => handleDelete(u.id, u.name)} className="bg-red-500 text-white hover:bg-red-600 w-auto">Delete</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeView === 'addUser' && (
                        <Card>
                           <h2 className="text-3xl font-bold mb-6 text-gray-800">Create a New User</h2>
                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="name" value={formData.name} onChange={handleCreateChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"/></div>
                                <div><label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label><input type="text" id="username" value={formData.username} onChange={handleCreateChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"/></div>
                                <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><input type="password" id="password" value={formData.password} onChange={handleCreateChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"/></div>
                                <div><label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label><select id="role" value={formData.role} onChange={handleCreateChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"><option value="STUDENT">Student</option><option value="TUTOR">Tutor</option><option value="WARDEN">Warden</option><option value="SECURITY">Security</option><option value="ADMIN">Admin</option></select></div>
                                <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 !mt-6 py-3">Create User</Button>
                            </form>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
}

