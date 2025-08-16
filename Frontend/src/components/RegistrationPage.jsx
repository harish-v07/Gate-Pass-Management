import React, { useState } from 'react';
import { api } from '../services/api'; // Make sure this path is correct

// Reusable components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = '', type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out disabled:bg-indigo-300 ${className}`}
  >
    {children}
  </button>
);

// The main RegistrationPage component
export default function RegistrationPage({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    // MODIFIED: Initial role is now empty to show the placeholder
    role: '', 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
        setError('Please select a role.');
        return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.register(formData);
      setSuccess('Registration successful! Please log in.');
      setFormData({ name: '', username: '', password: '', role: '' }); // Clear form
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
          <p className="text-center text-gray-500 mb-8">Sign up to get started</p>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" id="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
             <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              {/* MODIFIED: Added text-center class and a disabled default option */}
              <select id="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center" required>
                  <option value="" disabled> Select a role </option>
                  <option value="STUDENT">Student</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="WARDEN">Warden</option>
                  <option value="SECURITY">Security</option>
              </select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                Log in
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
