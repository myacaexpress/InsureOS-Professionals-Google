import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Inbox from './pages/Inbox';
import Onboarding from './pages/Onboarding';
import CreateOffer from './pages/CreateOffer';
import VendorDashboard from './pages/VendorDashboard';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import { User, UserRole } from './types';
import { MOCK_USER_AGENT, MOCK_USER_VENDOR } from './constants';

// Simple custom router implementation for SPA feel
const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  // Store auth data for new users during onboarding
  const [tempAuthData, setTempAuthData] = useState<{uid: string, phone: string} | null>(null);

  // Simulate persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('insureos_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from storage", e);
      }
    }
  }, []);

  const handleNavigate = (path: string) => {
    window.scrollTo(0, 0);
    setCurrentPath(path);
  };

  const handleLoginSuccess = (uid: string, phoneNumber: string) => {
    // Simulate DB lookup
    // In real app: const userDoc = await getDoc(doc(db, 'users', uid));
    
    // Mock logic: Check if it matches our mock users
    let foundUser: User | null = null;
    
    // Simple check against mock data
    if (uid === MOCK_USER_AGENT.uid || phoneNumber === '+15550000001') {
      foundUser = MOCK_USER_AGENT;
    } else if (uid === MOCK_USER_VENDOR.uid || phoneNumber === '+15550000002') {
      foundUser = MOCK_USER_VENDOR;
    } 
    // Simulate a user with BOTH roles for testing
    else if (phoneNumber === '+15550000003') {
      foundUser = {
        ...MOCK_USER_AGENT,
        uid: 'dual_role_user',
        roles: [UserRole.AGENT, UserRole.VENDOR],
        displayName: 'Super User'
      };
    }

    if (foundUser) {
       // If user has multiple roles, show selection
       if (foundUser.roles && foundUser.roles.length > 1) {
         setPendingUser(foundUser);
         handleNavigate('/role-selection');
       } else {
         // Single role, just login
         setUser(foundUser);
         localStorage.setItem('insureos_user', JSON.stringify(foundUser));
         handleNavigate(foundUser.role === UserRole.AGENT ? '/browse' : '/dashboard');
       }
    } else {
      // New User -> Onboarding
      // Store the auth data to use during onboarding completion
      setTempAuthData({ uid, phone: phoneNumber });
      handleNavigate('/onboarding');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('insureos_user');
    handleNavigate('/');
  };

  const handleOnboardingComplete = (
    role: UserRole, 
    data: { name: string; businessName?: string; businessPhone?: string },
    authData?: { uid: string; phone: string }
  ) => {
    // Use real auth data if available (from Onboarding flow OR tempAuthData from Login flow)
    const uid = authData?.uid || tempAuthData?.uid || (role === UserRole.AGENT ? MOCK_USER_AGENT.uid : 'new_vendor_' + Date.now());
    const phone = authData?.phone || tempAuthData?.phone || (role === UserRole.AGENT ? MOCK_USER_AGENT.phone : undefined);

    // If vendor, create a fresh user ID to demonstrate the 'Empty Dashboard' state (unless we have real auth)
    // We mix the real auth data with the mock templates for badges/structure
    const baseUser = role === UserRole.AGENT ? MOCK_USER_AGENT : MOCK_USER_VENDOR;

    const newUser: User = {
      ...baseUser,
      uid: uid,
      phone: phone,
      displayName: data.name,
      ...(role === UserRole.VENDOR && {
        businessName: data.businessName || baseUser.businessName,
        businessPhone: data.businessPhone
      })
    };
    
    setUser(newUser);
    // Clear temp data
    setTempAuthData(null);
    localStorage.setItem('insureos_user', JSON.stringify(newUser));
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
        return <Onboarding onComplete={handleOnboardingComplete} onNavigate={handleNavigate} />;
      case '/dashboard':
        return user && user.role === UserRole.VENDOR ? (
          <VendorDashboard user={user} onNavigate={handleNavigate} />
        ) : (
          <Home onNavigate={handleNavigate} />
        );
      case '/login':
        return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      case '/role-selection':
        return pendingUser ? (
          <RoleSelection 
            roles={pendingUser.roles} 
            onSelectRole={(role) => {
              const finalUser = { ...pendingUser, role }; // Set active role
              setUser(finalUser);
              localStorage.setItem('insureos_user', JSON.stringify(finalUser));
              setPendingUser(null);
              handleNavigate(role === UserRole.AGENT ? '/browse' : '/dashboard');
            }} 
          />
        ) : <Home onNavigate={handleNavigate} />;
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
