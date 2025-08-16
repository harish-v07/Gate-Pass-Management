import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import ApprovalDashboard from './components/ApprovalDashboard';
import StudentDashboard from './components/StudentDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleProfileUpdate = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const switchToRegister = () => setShowRegister(true);
  const switchToLogin = () => setShowRegister(false);

  const renderMainContent = () => {
    // If no user is logged in, show the login or registration page
    if (!user) {
      return showRegister ? (
        <RegistrationPage onSwitchToLogin={switchToLogin} />
      ) : (
        <LoginPage onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
      );
    }

    // If a user is logged in, show the correct dashboard based on their role
    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard loggedInUser={user} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />;
      case 'TUTOR':
      case 'WARDEN':
        return <ApprovalDashboard user={user} onLogout={handleLogout} />;
      case 'SECURITY':
        return <SecurityDashboard user={user} onLogout={handleLogout} />;
      default:
        return (
          <div>
            <h1>Unknown Role</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>
        );
    }
  };

  return (
    <div>
      {renderMainContent()}
    </div>
  );
}

export default App;
