import React from 'react';
import { MessageSquare, LogOut, User as UserIcon, PlusCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import Logo from './Logo';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  
  const handleLogoClick = () => {
    if (user) {
      if (user.role === UserRole.VENDOR) {
        onNavigate('/dashboard');
      } else {
        onNavigate('/browse');
      }
    } else {
      onNavigate('/');
    }
  };

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer group" onClick={handleLogoClick}>
        <Logo className="w-10 h-10 text-brand-blue transition-transform group-hover:scale-105" />
        <span className="font-bold text-xl tracking-tight text-brand-black">insureOS</span>
      </div>

      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <button onClick={() => onNavigate('/login')} className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors hidden md:block">
              Log In
            </button>
            <button 
              onClick={() => onNavigate('/onboarding')}
              className="bg-brand-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all"
            >
              Join Now
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate('/browse')} className="text-sm font-medium text-gray-600 hover:text-brand-blue">
              Browse
            </button>
            {user.role === UserRole.VENDOR && (
              <>
               <button onClick={() => onNavigate('/dashboard')} className="text-sm font-medium text-gray-600 hover:text-brand-blue">
                Dashboard
               </button>
               <button onClick={() => onNavigate('/create-offer')} className="flex items-center gap-1 text-sm font-medium text-brand-blue hover:text-brand-blueDark">
                <PlusCircle size={18} />
                <span className="hidden sm:inline">New Offer</span>
               </button>
              </>
            )}
            <button onClick={() => onNavigate('/inbox')} className="relative text-gray-600 hover:text-brand-blue transition-colors">
              <MessageSquare size={22} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <span className="text-sm font-bold hidden sm:block">{user.displayName}</span>
              <button onClick={onLogout} className="text-gray-400 hover:text-red-500">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;