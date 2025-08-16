import React,{ useState, useEffect, useCallback } from 'react';
import { api } from '../services/api'; // Assuming your api service file is in ../services/api.js

const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

// Helper to determine the color of the status badge
const getStatusColor = (status) => {
  if (status === 'APPROVED') return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};

export default function SecurityDashboard({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Fetch all approved requests when the component mounts
  useEffect(() => {
    const fetchApprovedRequests = async () => {
      setLoading(true);
      setError('');
      try {
        // This will be a new function in your api.js file
        const data = await api.getAllApprovedRequests(); 
        setRequests(data);
        setFilteredRequests(data); // Initially, filtered list is the full list
      } catch (err) {
        setError('Failed to fetch approved gate passes.');
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedRequests();
  }, []);

  // Apply filters whenever the search term or department filter changes
  useEffect(() => {
    let result = requests;

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(req =>
        req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (departmentFilter) {
      result = result.filter(req => req.department === departmentFilter);
    }

    setFilteredRequests(result);
  }, [searchTerm, departmentFilter, requests]);


  return (
    <div>
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">Security Dashboard</h1>
          <button onClick={onLogout} className="w-auto px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">Logout</button>
        </nav>
      </header>

      <main className="bg-gray-100 p-4 md:p-8 min-h-screen">
        <div className="container mx-auto">
          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Approved Gate Passes</h2>
            {/* Filter and Search Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Departments</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="MECH">Mechanical</option>
                <option value="CIVIL">Civil</option>
              </select>
            </div>

            {/* List of Requests */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-3">
              {!loading && filteredRequests.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No matching approved requests found.</p>
              ) : (
                filteredRequests.map(req => (
                  <div key={req.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">{req.studentName}</p>
                        <p className="text-sm text-gray-600">{req.rollNumber} - <span className="font-medium">{req.department}</span></p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
