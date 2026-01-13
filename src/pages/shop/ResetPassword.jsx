import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Check if we have a valid session (Supabase automatically handles the token from email)
  useEffect(() => {
    // If user successfully resets password, they'll be redirected here
    // Supabase automatically logs them in after clicking the reset link
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate passwords
      if (password.length < 6) {
        throw new Error('Wachtwoord moet minimaal 6 tekens zijn');
      }

      if (password !== confirmPassword) {
        throw new Error('Wachtwoorden komen niet overeen');
      }

      // Update password
      await updatePassword(password);
      
      setSuccess(true);
      
      // Redirect to account after 2 seconds
      setTimeout(() => {
        navigate('/winkel/account');
      }, 2000);
      
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Er ging iets mis bij het resetten van je wachtwoord');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageTransition className="pt-24">
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Wachtwoord gewijzigd!</h2>
            <p className="text-gray-600">
              Je wachtwoord is succesvol gewijzigd. Je wordt doorgestuurd naar je account...
            </p>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pt-24">
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Nieuw wachtwoord</h1>
                  <p className="text-white/80 text-sm">Voer je nieuwe wachtwoord in</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nieuw wachtwoord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-70"
                      placeholder="Minimaal 6 tekens"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Bevestig wachtwoord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-70"
                      placeholder="Herhaal je wachtwoord"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Wachtwoord vereisten:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600' : ''}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-green-600' : 'bg-gray-300'}`} />
                      Minimaal 6 tekens
                    </li>
                    <li className={`flex items-center gap-2 ${password && confirmPassword && password === confirmPassword ? 'text-green-600' : ''}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${password && confirmPassword && password === confirmPassword ? 'bg-green-600' : 'bg-gray-300'}`} />
                      Wachtwoorden komen overeen
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Bezig met wijzigen...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Wachtwoord wijzigen
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Help text */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Wachtwoord toch niet vergeten?{' '}
            <button
              onClick={() => navigate('/winkel/account')}
              className="text-primary hover:underline font-medium"
            >
              Terug naar inloggen
            </button>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;

