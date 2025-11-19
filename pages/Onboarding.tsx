import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, User, Check, Building2, Globe } from 'lucide-react';
import { UserRole } from '../types';
import { CATEGORIES } from '../constants';
import TravelingEmoji from '../components/TravelingEmoji';

interface OnboardingProps {
  onComplete: (role: UserRole, data: { name: string; businessName?: string }) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [website, setWebsite] = useState('');
  const [npn, setNpn] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onComplete(selectedRole, {
        name: fullName,
        businessName: selectedRole === UserRole.VENDOR ? businessName : undefined
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- Dynamic Background Emojis --- */}
      {/* Parachuter drifting down-right */}
      <TravelingEmoji emoji="🪂" initialX={10} initialY={-10} speedX={0.5} speedY={0.8} rotationSpeed={0.2} size="text-6xl" />
      
      {/* Surfer moving across horizontally */}
      <TravelingEmoji emoji="🏄‍♂️" initialX={-10} initialY={70} speedX={1.2} speedY={0} rotationSpeed={0} size="text-5xl" />
      
      {/* Speedboat zooming fast */}
      <TravelingEmoji emoji="🚤" initialX={-20} initialY={85} speedX={2.5} speedY={0.1} rotationSpeed={-0.1} size="text-4xl" />
      
      {/* Helicopter flying across top */}
      <TravelingEmoji emoji="🚁" initialX={110} initialY={15} speedX={-1.5} speedY={0.05} rotationSpeed={0} size="text-5xl" />
      
      {/* Skier sliding down-left */}
      <TravelingEmoji emoji="⛷️" initialX={90} initialY={-10} speedX={-0.8} speedY={1.2} rotationSpeed={0} size="text-4xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        {step === 1 ? (
          <div className="w-full p-8 md:p-12">
             <h1 className="text-3xl font-bold text-brand-black mb-2 text-center">Choose your path</h1>
             <p className="text-gray-500 text-center mb-10">Select your primary role. This cannot be changed later.</p>
             
             <div className="grid md:grid-cols-2 gap-6">
               {/* Agent Card */}
               <div 
                 onClick={() => handleRoleSelect(UserRole.AGENT)}
                 className="group border-2 border-gray-100 hover:border-brand-blue rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg flex flex-col items-center text-center"
               >
                 <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <User size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-brand-black mb-2">I am an Agent</h3>
                 <p className="text-sm text-gray-500">I want to buy leads, coaching, and setups to grow my book of business.</p>
               </div>

               {/* Vendor Card */}
               <div 
                 onClick={() => handleRoleSelect(UserRole.VENDOR)}
                 className="group border-2 border-gray-100 hover:border-brand-black rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg flex flex-col items-center text-center"
               >
                 <div className="w-16 h-16 bg-gray-100 text-brand-black rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-brand-black mb-2">I am a Vendor</h3>
                 <p className="text-sm text-gray-500">I offer services like marketing, automation, or training to agents.</p>
               </div>
             </div>
          </div>
        ) : (
          <div className="w-full p-8 md:p-12">
             <button 
               onClick={() => setStep(1)} 
               className="text-sm text-gray-400 hover:text-brand-black mb-6 font-medium"
             >
               ← Back
             </button>
             <h2 className="text-2xl font-bold text-brand-black mb-2">Complete your profile</h2>
             <p className="text-gray-500 mb-8">
               {selectedRole === UserRole.AGENT ? 'Enter your producer details.' : 'Tell us about your agency services.'}
             </p>

             <form className="space-y-5" onSubmit={handleSubmit}>
               <div className="grid md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Full Name</label>
                   <input 
                      type="text" 
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" 
                      placeholder="John Doe" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Email Address</label>
                   <input 
                      type="email" 
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" 
                      placeholder="john@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                   />
                 </div>
               </div>
               
               {selectedRole === UserRole.AGENT && (
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">NPN (National Producer Number)</label>
                   <input 
                      type="text" 
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" 
                      placeholder="1234567890" 
                      value={npn}
                      onChange={(e) => setNpn(e.target.value)}
                   />
                 </div>
               )}

               {selectedRole === UserRole.VENDOR && (
                 <>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Business Name</label>
                     <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" 
                            placeholder="Acme Marketing LLC"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                        />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Website (Optional)</label>
                     <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" 
                            placeholder="www.acmemarketing.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Service Categories</label>
                     <div className="grid grid-cols-2 gap-3">
                       {CATEGORIES.map(cat => {
                         const isSelected = selectedCategories.includes(cat);
                         return (
                           <div 
                             key={cat}
                             onClick={() => toggleCategory(cat)}
                             className={`
                               relative p-3 rounded-xl border cursor-pointer text-sm font-bold transition-all flex items-center justify-between select-none
                               ${isSelected 
                                 ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-sm' 
                                 : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'}
                             `}
                           >
                             {cat}
                             {isSelected && (
                               <div className="bg-brand-blue text-white rounded-full p-0.5">
                                 <Check size={12} strokeWidth={3} />
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                     {selectedCategories.length === 0 && (
                       <p className="text-xs text-red-400 mt-1">Please select at least one category.</p>
                     )}
                   </div>
                 </>
               )}

               <button 
                type="submit" 
                disabled={selectedRole === UserRole.VENDOR && selectedCategories.length === 0}
                className="w-full bg-brand-black text-white py-3.5 rounded-xl font-bold mt-4 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Create Account
               </button>
             </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;