import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { UserRole } from '../types';
import Logo from '../components/Logo';

interface LoginProps {
  onLoginSuccess: (uid: string, phoneNumber: string) => void;
  onNavigate: (path: string) => void;
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Recaptcha
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          }
        });
      } catch (e) {
        console.error("Recaptcha initialization failed", e);
      }
    }

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        } catch (e) {
          console.error("Recaptcha cleanup failed", e);
        }
      }
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const appVerifier = window.recaptchaVerifier;
    if (!appVerifier) {
      setError("Recaptcha not initialized. Please refresh the page.");
      setLoading(false);
      return;
    }

    try {
      // Format phone number
      let formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
      if (!formattedPhone.startsWith('+')) {
        // Assume US +1 if no country code provided
        formattedPhone = `+1${formattedPhone}`;
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send verification code.');
      // If we need to reset the captcha widget without destroying it:
      if (window.recaptchaVerifier) {
        // Sometimes rendering again or resetting is needed, but destroying it causes issues
        // window.grecaptcha.reset(); // This might be needed if using visible captcha
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!confirmationResult) return;

    try {
      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;
      // Success!
      onLoginSuccess(user.uid, user.phoneNumber || phoneNumber);
    } catch (err: any) {
      console.error(err);
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo className="w-12 h-12 text-brand-blue" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">
          {step === 'phone' ? 'Welcome Back' : 'Verify Phone'}
        </h2>
        <p className="text-gray-500 text-center mb-8">
          {step === 'phone' 
            ? 'Enter your phone number to sign in or create an account.' 
            : `Enter the code sent to ${phoneNumber}`
          }
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 555 555 5555"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Format: +1 (Country Code) followed by number</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-center tracking-widest text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setConfirmationResult(null);
                setVerificationCode('');
                setError(null);
              }}
              className="w-full text-gray-500 text-sm hover:text-brand-blue py-2"
            >
              Change Phone Number
            </button>
          </form>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
