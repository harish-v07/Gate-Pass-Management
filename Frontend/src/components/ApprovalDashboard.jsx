import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

// Reusable Card component for consistent styling
const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

// Reusable Button component
const Button = ({ children, onClick, className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition duration-300 ease-in-out ${className}`}
  >
    {children}
  </button>
);

// Helper function to determine the color of the status badge
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

export default function ApprovalDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
  const [pendingRequests, setPendingRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetches all necessary data (pending and history) from the backend
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch both sets of data in parallel for better performance
      const [pendingData, historyData] = await Promise.all([
        api.getPendingRequests(user.role, user.id),
        api.getApprovalHistory(user.role, user.id)
      ]);
      setPendingRequests(pendingData);
      setHistoryRequests(historyData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.role, user.id]);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleApprove = async (requestId) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      try {
        await api.approveRequest(requestId, user.role, user.id);
        fetchAllData(); // Refresh both lists
      } catch (err) {
        alert(`Error approving request: ${err.message}`);
      }
    }
  };

  const handleReject = async (requestId) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await api.rejectRequest(requestId);
        fetchAllData(); // Refresh both lists
      } catch (err) {
        alert(`Error rejecting request: ${err.message}`);
      }
    }
  };
  
  const handleModify = async (requestId) => {
    if (window.confirm('Are you sure you want to revoke your approval for this request? The request will return to the previous state.')) {
      try {
        await api.modifyApproval(requestId, user.role);
        fetchAllData(); // Refresh both lists
      } catch (err) {
        alert(`Error modifying approval: ${err.message}`);
      }
    }
  };

  // A helper function to render the list of requests to avoid code duplication
  const renderList = (requests, isHistoryTab) => {
    if (requests.length === 0) {
      return <Card><p className="text-center text-gray-500">No requests to display in this view.</p></Card>;
    }
    return (
      <div className="space-y-4">
        {requests.map(req => (
          <Card key={req.id}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Request Details */}
              <div className="md:col-span-2">
                <h3 className="font-bold text-lg text-gray-900">{req.studentName}</h3>
                <p className="text-sm text-gray-600">{req.rollNumber}</p>
                <p className="text-sm text-gray-500 mt-1">Requested on: {new Date(req.createdAt).toLocaleString()}</p>
                <p><span className="text-sm text-gray-50000 mt-1">Purpose:</span> {req.purpose}</p>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-end gap-2">
                {isHistoryTab ? (
                  // Show "Modify" button only on the History tab and only if the status is appropriate
                  ( (user.role === 'TUTOR' && req.status === 'PENDING_WARDEN_APPROVAL') || (user.role === 'WARDEN' && req.status === 'APPROVED') ) && (
                    <Button onClick={() => handleModify(req.id)} className="bg-yellow-500 text-white hover:bg-yellow-600">Modify Approval</Button>
                  )
                ) : (
                  // Show "Approve" and "Reject" buttons on the Pending tab
                  <>
                    <Button onClick={() => handleApprove(req.id)} className="bg-green-500 text-white hover:bg-green-600">Approve</Button>
                    <Button onClick={() => handleReject(req.id)} className="bg-red-500 text-white hover:bg-red-600">Reject</Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">{user.role} Dashboard</h1>
          <button onClick={onLogout} className="w-auto px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">Logout</button>
        </nav>
        {/* Navigation Tabs */}
        <div className="container mx-auto px-6 border-b border-gray-200">
            <div className="flex space-x-4">
                <button onClick={() => setActiveTab('pending')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Pending Requests</button>
                <button onClick={() => setActiveTab('history')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Approval History</button>
            </div>
        </div>
      </header>

      <main className="bg-gray-100 p-4 md:p-8 min-h-screen">
        <div className="container mx-auto">
          {loading && <p className="text-center text-gray-500">Loading data...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && (activeTab === 'pending' ? renderList(pendingRequests, false) : renderList(historyRequests, true))}
        </div>
      </main>
    </div>
  );
}
