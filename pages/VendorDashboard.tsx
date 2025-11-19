import React from 'react';
import { PlusCircle, TrendingUp, DollarSign, Package, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { MOCK_OFFERS } from '../constants';

interface VendorDashboardProps {
  user: User;
  onNavigate: (path: string) => void;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ user, onNavigate }) => {
  // Filter offers belonging to this vendor
  const myOffers = MOCK_OFFERS.filter(o => o.vendorId === user.uid);

  return (
    <div className="min-h-screen bg-brand-gray p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-black">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.businessName || user.displayName}.</p>
          </div>
          {myOffers.length > 0 && (
             <button 
               onClick={() => onNavigate('/create-offer')} 
               className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-blueDark transition-all shadow-lg shadow-blue-500/30"
             >
               <PlusCircle size={20} />
               New Offer
             </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2 text-gray-500 text-sm font-bold uppercase tracking-wider">
                 <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={16} /></div>
                 Total Earnings
              </div>
              <div className="text-3xl font-bold text-brand-black">$0.00</div>
           </div>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2 text-gray-500 text-sm font-bold uppercase tracking-wider">
                 <div className="p-2 bg-blue-100 text-brand-blue rounded-lg"><Package size={16} /></div>
                 Active Orders
              </div>
              <div className="text-3xl font-bold text-brand-black">0</div>
           </div>
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2 text-gray-500 text-sm font-bold uppercase tracking-wider">
                 <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp size={16} /></div>
                 Profile Views
              </div>
              <div className="text-3xl font-bold text-brand-black">0</div>
           </div>
        </div>

        {/* Main Content */}
        <div>
          <h2 className="text-xl font-bold text-brand-black mb-6">Your Services</h2>
          
          {myOffers.length === 0 ? (
             <div className="bg-white rounded-3xl p-12 md:p-20 text-center border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mb-6">
                   <Package size={40} />
                </div>
                <h3 className="text-3xl font-bold text-brand-black mb-4">Create and publish your first offer</h3>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                  Start earning by listing your expertise in Leads, CRM, or Coaching. 
                  Agents are waiting for high-quality vendors like you.
                </p>
                <button 
                  onClick={() => onNavigate('/create-offer')} 
                  className="bg-brand-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-blueDark transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
                >
                   Create Offer
                   <ArrowRight size={20} />
                </button>
             </div>
          ) : (
             <div className="grid md:grid-cols-3 gap-6">
                {myOffers.map(offer => (
                  <div key={offer.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-lg transition-shadow">
                     <div className="mb-4 rounded-xl overflow-hidden h-40 bg-gray-100 relative">
                        <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-black shadow-sm">
                          Active
                        </div>
                     </div>
                     <h3 className="font-bold text-brand-black mb-1 line-clamp-1">{offer.title}</h3>
                     <p className="text-sm text-gray-500 mb-4">${(offer.price_cents/100).toFixed(0)}</p>
                     <button className="mt-auto w-full py-2 border border-gray-200 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
                       Manage
                     </button>
                  </div>
                ))}
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;