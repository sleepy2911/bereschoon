import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Package, Settings, LogOut, Mail, Lock, ChevronRight,
  Eye, EyeOff, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../context/AuthContext';

const Account = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth();
  const [mode, setMode] = useState('login'); // login, register, forgot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        navigate('/winkel/account');
      } else if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Wachtwoorden komen niet overeen');
        }
        if (formData.password.length < 6) {
          throw new Error('Wachtwoord moet minimaal 6 tekens zijn');
        }
        await signUp(formData.email, formData.password, formData.fullName);
        setSuccess('Account aangemaakt! Controleer je e-mail om je account te bevestigen.');
        setMode('login');
      } else if (mode === 'forgot') {
        await resetPassword(formData.email);
        setSuccess('Check je e-mail voor instructies om je wachtwoord te resetten.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/winkel');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (authLoading) {
    return (
      <PageTransition className="pt-24">
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  // Logged in view
  if (user) {
    return (
      <PageTransition className="pt-24">
        {/* Breadcrumbs */}
        <div className="bg-white border-b sticky top-[72px] z-40">
          <div className="container mx-auto px-6 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <Link to="/winkel" className="text-gray-500 hover:text-primary transition-colors">
                Shop
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <span className="text-gray-900 font-medium">Mijn Account</span>
            </nav>
          </div>
        </div>

        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-sm mb-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{profile?.full_name || 'Welkom!'}</h1>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    to="/winkel/account/bestellingen"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors group"
                  >
                    <Package className="w-6 h-6 group-hover:text-primary" />
                    <div>
                      <p className="font-medium">Mijn Bestellingen</p>
                      <p className="text-sm text-gray-500">Bekijk je bestelgeschiedenis</p>
                    </div>
                  </Link>

                  <Link
                    to="/winkel/account/instellingen"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors group"
                  >
                    <Settings className="w-6 h-6 group-hover:text-primary" />
                    <div>
                      <p className="font-medium">Instellingen</p>
                      <p className="text-sm text-gray-500">Bewerk je profiel</p>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors group text-left"
                  >
                    <LogOut className="w-6 h-6 group-hover:text-red-500" />
                    <div>
                      <p className="font-medium">Uitloggen</p>
                      <p className="text-sm text-gray-500">Tot ziens!</p>
                    </div>
                  </button>
                </div>
              </motion.div>

              <Link
                to="/winkel"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                ← Terug naar shop
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Login/Register view
  return (
    <PageTransition className="pt-24">
      {/* Breadcrumbs */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <Link to="/winkel" className="text-gray-500 hover:text-primary transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-gray-900 font-medium">
              {mode === 'login' ? 'Inloggen' : mode === 'register' ? 'Registreren' : 'Wachtwoord vergeten'}
            </span>
          </nav>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              {/* Tab Switcher */}
              {mode !== 'forgot' && (
                <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      mode === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Inloggen
                  </button>
                  <button
                    onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      mode === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Registreren
                  </button>
                </div>
              )}

              {mode === 'forgot' && (
                <button
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="mb-6 text-gray-500 hover:text-primary transition-colors"
                >
                  ← Terug naar inloggen
                </button>
              )}

              <h1 className="text-2xl font-bold mb-6">
                {mode === 'login' && 'Welkom terug!'}
                {mode === 'register' && 'Account aanmaken'}
                {mode === 'forgot' && 'Wachtwoord vergeten'}
              </h1>

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volledige naam
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required={mode === 'register'}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Je naam"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mailadres
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="jouw@email.nl"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wachtwoord
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="••••••••"
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
                )}

                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bevestig wachtwoord
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); }}
                      className="text-sm text-primary hover:underline"
                    >
                      Wachtwoord vergeten?
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' && 'Inloggen'}
                      {mode === 'register' && 'Account aanmaken'}
                      {mode === 'forgot' && 'Reset link versturen'}
                    </>
                  )}
                </motion.button>

                {/* Toggle link below button */}
                {mode === 'login' && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Nog geen account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
                      className="text-primary font-medium hover:underline"
                    >
                      Registreren
                    </button>
                  </p>
                )}

                {mode === 'register' && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Heb je al een account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                      className="text-primary font-medium hover:underline"
                    >
                      Inloggen
                    </button>
                  </p>
                )}
              </form>
            </motion.div>

            <div className="text-center mt-6">
              <Link to="/winkel" className="text-gray-500 hover:text-primary transition-colors">
                ← Terug naar shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Account;

