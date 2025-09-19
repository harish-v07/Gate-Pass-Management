// src/App.jsx
import React, { useState } from 'react';

// Import all your components
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import ApprovalDashboard from './components/ApprovalDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
  };

  // ** THE FIX **
  // This function prevents infinite loops by only updating the user state
  // if the incoming data is actually different from the current data.
  const handleProfileUpdate = (updatedUser) => {
    setLoggedInUser(currentUser => {
      // By comparing the stringified versions, we avoid re-rendering if the object is new but the data is the same.
      if (JSON.stringify(currentUser) !== JSON.stringify(updatedUser)) {
        return updatedUser;
      }
      return currentUser; // Return the old state to prevent a re-render
    });
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  // Render logic based on whether a user is logged in
  if (!loggedInUser) {
    // NOTE: The public registration page is removed in the admin flow.
    // If you need it, the logic to switch views would go here.
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render the correct dashboard based on the user's role
  switch (loggedInUser.role) {
    case 'STUDENT':
      return <StudentDashboard loggedInUser={loggedInUser} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />;
    case 'TUTOR':
    case 'WARDEN':
      return <ApprovalDashboard loggedInUser={loggedInUser} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />;
    case 'SECURITY':
      return <SecurityDashboard loggedInUser={loggedInUser} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />;
    case 'ADMIN':
      return <AdminDashboard user={loggedInUser} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />;
    default:
      return (
        <div>
          <p>Unknown user role. Please log out.</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
  }
}

