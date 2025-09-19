import React, { useState } from 'react';
import { api } from '../services/api';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 md:p-8 ${className}`}>
    {children}
  </div>
);
const Button = ({ children, ...props }) => (
  <button {...props} className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition duration-300 ease-in-out bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300`}>
    {children}
  </button>
);

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await api.login(username, password);
      onLogin(userData);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Gate Pass System</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}