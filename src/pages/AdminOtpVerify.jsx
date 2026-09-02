import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSuperAdmin } from '../utils/roles';

export default function AdminOtpVerify() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    needsAdminOtp,
    verifyAdminOtp,
    resendAdminOtp,
    cancelAdminOtp,
    restorePendingOtp,
  } = useAuth();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    restorePendingOtp();
  }, [restorePendingOtp]);

  useEffect(() => {
    if (loading) return;
    if (user && isSuperAdmin(user.role) && user.adminOtpVerified) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    const result = await verifyAdminOtp(otp);
    if (!result.success) {
      setError(result.message || 'Invalid verification code');
      setSubmitting(false);
    }
    // On success, useEffect redirects once user.adminOtpVerified is set
  };

  const handleResend = async () => {
    setError('');
    setSubmitting(true);
    const result = await resendAdminOtp();
    if (result.success) {
      setInfo('A new verification code was sent to your email.');
      setOtp('');
    } else {
      setError(result.message || 'Could not resend the code.');
    }
    setSubmitting(false);
  };

  if (loading) {
    return null;
  }

  // OTP just verified — redirect in progress; avoid flashing "Verification expired"
  if (user && isSuperAdmin(user.role) && user.adminOtpVerified) {
    return null;
  }

  if (!needsAdminOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center space-y-4">
          <h2 className="text-2xl font-black text-gray-900">Verification expired</h2>
          <p className="text-gray-500">Sign in again to request a new admin code.</p>
          <Link
            to="/signin"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 px-6 rounded-xl"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Verify admin access</h2>
            <p className="text-gray-500">
              Enter the 6-digit code we sent to your email
              {user?.email ? ` (${user.email})` : ''}.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm mb-6 font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {info && !error && (
            <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl text-sm mb-6 font-bold">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Verification code</label>
              <input
                type="text"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoFocus
                className="w-full px-5 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all font-black tracking-[0.4em] text-center text-2xl"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || otp.length !== 6}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {submitting ? 'Verifying...' : 'Verify and continue'}
            </button>

            <div className="flex items-center justify-between text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  cancelAdminOtp();
                  navigate('/', { replace: true });
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                Cancel and go home
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={submitting}
                className="font-bold text-yellow-600 hover:text-yellow-700 disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
