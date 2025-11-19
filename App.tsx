import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Inbox from './pages/Inbox';
import Onboarding from './pages/Onboarding';
import CreateOffer from './pages/CreateOffer';
import VendorDashboard from './pages/VendorDashboard';
import { User, UserRole } from './types';
import { MOCK_USER_AGENT, MOCK_USER_VENDOR } from './constants';

// Simple custom router implementation for SPA feel
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [user, setUser] = useState<User | null>(null);

  // Simulate persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('insureos_user');
    if (storedUser) {
      // For demo simplicity, we just toggle between mock users based on role string
      // In real app, parse JSON
      // setUser(JSON.parse(storedUser)); 
    }
  }, []);

  const handleNavigate = (path: string) => {
    window.scrollTo(0, 0);
    setCurrentPath(path);
  };

  const handleLogin = () => {
    // Simulating a login for demo purposes - default to Agent
    setUser(MOCK_USER_AGENT);
    handleNavigate('/browse');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('insureos_user');
    handleNavigate('/');
  };

  const handleOnboardingComplete = (role: UserRole, data: { name: string; businessName?: string }) => {
    // If vendor, create a fresh user ID to demonstrate the 'Empty Dashboard' state
    const newUser: User = role === UserRole.AGENT 
      ? { ...MOCK_USER_AGENT, displayName: data.name }
      : { 
          ...MOCK_USER_VENDOR, 
          uid: 'new_vendor_' + Date.now(),
          displayName: data.name,
          businessName: data.businessName || MOCK_USER_VENDOR.businessName
        }; 
    
    setUser(newUser);
    handleNavigate(role === UserRole.AGENT ? '/browse' : '/dashboard');
  };

  // Render page based on path
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home onNavigate={handleNavigate} />;
      case '/browse':
        return <Browse onNavigate={handleNavigate} />;
      case '/inbox':
        return user ? <Inbox user={user} /> : <Home onNavigate={handleNavigate} />;
      case '/onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case '/dashboard':
        return user && user.role === UserRole.VENDOR ? (
          <VendorDashboard user={user} onNavigate={handleNavigate} />
        ) : (
          <Home onNavigate={handleNavigate} />
        );
      case '/login':
        // Auto-login for demo
        setTimeout(handleLogin, 500);
        return <div className="h-screen flex items-center justify-center">Logging in...</div>;
      case '/create-offer':
        return <CreateOffer onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-black">
      {currentPath !== '/onboarding' && (
        <Navbar user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;