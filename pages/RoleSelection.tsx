import React from 'react';
import { UserRole } from '../types';
import Logo from '../components/Logo';
import { User as UserIcon, Store } from 'lucide-react';

interface RoleSelectionProps {
  roles: UserRole[];
  onSelectRole: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ roles, onSelectRole }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo className="w-12 h-12 text-brand-blue" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Choose Account</h2>
        <p className="text-gray-500 text-center mb-8">
          Which profile would you like to use today?
        </p>

        <div className="space-y-4">
          {roles.includes(UserRole.AGENT) && (
            <button
              onClick={() => onSelectRole(UserRole.AGENT)}
              className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-brand-blue hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                <UserIcon size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Agent Account</h3>
                <p className="text-sm text-gray-500">Browse and buy leads</p>
              </div>
            </button>
          )}

          {roles.includes(UserRole.VENDOR) && (
            <button
              onClick={() => onSelectRole(UserRole.VENDOR)}
              className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-brand-blue hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                <Store size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Vendor Account</h3>
                <p className="text-sm text-gray-500">Manage offers and sales</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
