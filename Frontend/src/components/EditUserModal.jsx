import React, { useState } from 'react';

export default function EditUserModal({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: user.name,
        username: user.username,
        password: '' // Leave blank to not change
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.username) {
            alert('Name and Username cannot be empty.');
            return;
        }
        if (window.confirm('Are you sure you want to save changes to this user?')) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Edit User: {user.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label htmlFor="name">Full Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded"/></div>
                    <div><label htmlFor="username">Username</label><input type="text" id="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded"/></div>
                    <div><label htmlFor="password">New Password (leave blank to keep current)</label><input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded"/></div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}