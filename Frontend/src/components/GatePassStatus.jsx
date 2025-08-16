import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

// Reusable Card component for consistent styling
const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

// Helper function to determine the color of the status badge based on the status text
const getStatusColor = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    case 'PENDING_WARDEN_APPROVAL':
      return 'bg-yellow-100 text-yellow-800';
    default: // PENDING_TUTOR_APPROVAL
      return 'bg-blue-100 text-blue-800';
  }
};

export default function GatePassStatus({ studentId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch the student's requests from the backend
  const fetchStatuses = async () => {
    if (!studentId) return; // Don't fetch if studentId is not available yet
    setLoading(true);
    setError('');
    try {
      const data = await api.getRequestsByStudent(studentId);
      // Sort requests to show the most recent ones first
      setRequests(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError('Failed to fetch gate pass statuses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to run fetchStatuses when the component first loads
  useEffect(() => {
    fetchStatuses();
  }, [studentId]); // The dependency array ensures this runs if the studentId changes

  // Function to handle the deletion of a request
  const handleDelete = async (requestId) => {
    // Show a confirmation dialog before deleting
    if (window.confirm('Are you sure you want to delete this gate pass request? This action cannot be undone.')) {
      try {
        await api.deleteRequest(requestId);
        // After a successful deletion, refresh the list to show the change
        fetchStatuses(); 
      } catch (err) {
        // Show an alert if the deletion fails
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Gate Pass History</h2>
      
      {/* Show loading message while fetching data */}
      {loading && <p className="text-center text-gray-500">Loading history...</p>}
      
      {/* Show error message if the fetch fails */}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {/* Show a message if the user has no requests */}
      {!loading && requests.length === 0 && (
        <Card>
          <p className="text-center text-gray-500">You have not applied for any gate passes yet.</p>
        </Card>
      )}

      {/* Display the list of gate pass requests */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {requests.map(req => (
          <Card key={req.id}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Request Details */}
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">Purpose: {req.purpose}</p>
                <p className="text-sm text-gray-500">
                  Applied on: {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              {/* Status Badge and Delete Button */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                  {req.status.replace(/_/g, ' ')}
                </span>
                
                {/* Conditionally render the Delete button only for pending requests */}
                {req.status === 'PENDING_TUTOR_APPROVAL' && (
                  <button
                    onClick={() => handleDelete(req.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold p-1"
                    title="Delete Request"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
