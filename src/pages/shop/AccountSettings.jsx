import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Lock, Save, ChevronRight,
  Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../context/AuthContext';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, updateProfile, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || ''
  });

  const [addressData, setAddressData] = useState({
    street: profile?.default_address?.street || '',
    houseNumber: profile?.default_address?.houseNumber || '',
    postalCode: profile?.default_address?.postalCode || '',
    city: profile?.default_address?.city || '',
    country: profile?.default_address?.country || 'NL'
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/winkel/account');
    }
  }, [user, authLoading, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        full_name: profileData.fullName,
        phone: profileData.phone
      });
      setSuccess('Profiel bijgewerkt!');
    } catch (err) {
      setError(err.message || 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        default_address: addressData
      });
      setSuccess('Adres bijgewerkt!');
    } catch (err) {
      setError(err.message || 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Wachtwoorden komen niet overeen');
      }
      if (passwordData.newPassword.length < 6) {
        throw new Error('Wachtwoord moet minimaal 6 tekens zijn');
      }

      await updatePassword(passwordData.newPassword);
      setSuccess('Wachtwoord bijgewerkt!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Er ging iets mis');
    } finally {
      setLoading(false);
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

  const tabs = [
    { id: 'profile', label: 'Profiel', icon: User },
    { id: 'address', label: 'Adres', icon: MapPin },
    { id: 'password', label: 'Wachtwoord', icon: Lock }
  ];

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
            <Link to="/winkel/account" className="text-gray-500 hover:text-primary transition-colors">
              Account
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-gray-900 font-medium">Instellingen</span>
          </nav>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Instellingen</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setError(null); setSuccess(null); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-700">{success}</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Profielgegevens</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">E-mailadres kan niet worden gewijzigd</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volledige naam
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefoonnummer
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="+31 6 12345678"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Opslaan
                  </button>
                </form>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Standaard verzendadres</h2>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Straat
                      </label>
                      <input
                        type="text"
                        value={addressData.street}
                        onChange={(e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Huisnummer
                      </label>
                      <input
                        type="text"
                        value={addressData.houseNumber}
                        onChange={(e) => setAddressData(prev => ({ ...prev, houseNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={addressData.postalCode}
                        onChange={(e) => setAddressData(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="1234 AB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plaats
                      </label>
                      <input
                        type="text"
                        value={addressData.city}
                        onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land
                    </label>
                    <select
                      value={addressData.country}
                      onChange={(e) => setAddressData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
                    >
                      <option value="NL">Nederland</option>
                      <option value="BE">België</option>
                      <option value="LU">Luxemburg</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Opslaan
                  </button>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Wachtwoord wijzigen</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nieuw wachtwoord
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bevestig nieuw wachtwoord
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !passwordData.newPassword}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Wachtwoord wijzigen
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AccountSettings;

