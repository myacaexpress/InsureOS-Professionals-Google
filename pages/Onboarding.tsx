import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, User, Check, Building2, Globe, Phone, ShieldCheck } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { UserRole } from '../types';
import { CATEGORIES } from '../constants';
import TravelingEmoji from '../components/TravelingEmoji';

interface OnboardingProps {
  onComplete: (
    role: UserRole, 
    data: { name: string; businessName?: string; businessPhone?: string },
    authData?: { uid: string; phone: string }
  ) => void;
  onNavigate?: (path: string) => void;
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [npn, setNpn] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Auth State
  const [authPhone, setAuthPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Recaptcha only when reaching step 3
    if (step === 3 && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response: any) => {
            // reCAPTCHA solved
          }
        });
      } catch (e) {
        console.error("Recaptcha initialization failed", e);
      }
    }

    return () => {
      if (step !== 3 && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        } catch (e) {
          console.error("Recaptcha cleanup failed", e);
        }
      }
    };
  }, [step]);

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

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    const appVerifier = window.recaptchaVerifier;
    if (!appVerifier) {
      setAuthError("Recaptcha not initialized. Please refresh.");
      setLoading(false);
      return;
    }

    try {
      let formattedPhone = authPhone.replace(/\s+/g, '').replace(/-/g, '');
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+1${formattedPhone}`;
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Failed to send code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    if (!confirmationResult || !selectedRole) return;

    try {
      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;
      
      onComplete(
        selectedRole, 
        {
          name: fullName,
          businessName: selectedRole === UserRole.VENDOR ? businessName : undefined,
          businessPhone: selectedRole === UserRole.VENDOR ? businessPhone : undefined
        },
        {
          uid: user.uid,
          phone: user.phoneNumber || authPhone
        }
      );
    } catch (err: any) {
      console.error(err);
      setAuthError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
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
             {onNavigate && (
               <button 
                 onClick={() => onNavigate('/')} 
                 className="text-sm text-gray-400 hover:text-brand-black mb-6 font-medium"
               >
                 ← Back to Home
               </button>
             )}
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
        ) : step === 2 ? (
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

             <form className="space-y-5" onSubmit={handleProfileSubmit}>
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
                     <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Business Phone (Optional)</label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="tel" 
                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" 
                            placeholder="+1 555 555 5555"
                            value={businessPhone}
                            onChange={(e) => setBusinessPhone(e.target.value)}
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
                onClick={handleProfileSubmit}
                disabled={selectedRole === UserRole.VENDOR && selectedCategories.length === 0}
                className="w-full bg-brand-black text-white py-3.5 rounded-xl font-bold mt-4 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Next: Verify Phone
               </button>
             </form>
          </div>
        ) : (
          // --- STEP 3: PHONE VERIFICATION ---
          <div className="w-full p-8 md:p-12">
             <button 
               onClick={() => setStep(2)} 
               className="text-sm text-gray-400 hover:text-brand-black mb-6 font-medium"
             >
               ← Back
             </button>
             
             <div className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center">
                 <ShieldCheck size={32} />
               </div>
             </div>

             <h2 className="text-2xl font-bold text-center text-brand-black mb-2">Secure your account</h2>
             <p className="text-gray-500 text-center mb-8">
               {!confirmationResult 
                 ? 'Enter your mobile number to create your secure login credential.'
                 : `Enter the code sent to ${authPhone}`
               }
             </p>

             {authError && (
               <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                 {authError}
               </div>
             )}

             {!confirmationResult ? (
               <form onSubmit={handleSendCode} className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Mobile Number</label>
                   <input
                     type="tel"
                     placeholder="+1 555 555 5555"
                     value={authPhone}
                     onChange={(e) => setAuthPhone(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                     required
                   />
                   <p className="text-xs text-gray-400 mt-1">We'll send you a one-time verification code.</p>
                 </div>

                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full bg-brand-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                 >
                   {loading ? 'Sending Code...' : 'Send Verification Code'}
                 </button>
               </form>
             ) : (
               <form onSubmit={handleVerifyCode} className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Verification Code</label>
                   <input
                     type="text"
                     placeholder="123456"
                     value={verificationCode}
                     onChange={(e) => setVerificationCode(e.target.value)}
                     className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-center tracking-widest text-xl"
                     required
                   />
                 </div>

                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full bg-brand-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                 >
                   {loading ? 'Verifying...' : 'Verify & Create Account'}
                 </button>
                 
                 <button
                   type="button"
                   onClick={() => {
                     setConfirmationResult(null);
                     setVerificationCode('');
                     setAuthError(null);
                   }}
                   className="w-full text-gray-500 text-sm hover:text-brand-blue py-2"
                 >
                   Change Number
                 </button>
               </form>
             )}
             <div id="recaptcha-container"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
