import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, CreditCard, Truck, Lock, User, ChevronRight,
  ChevronDown, Loader2, AlertCircle, UserPlus, Package, Clock, ArrowLeft
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useCartStore } from '../../stores/cartStore';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const SHIPPING_COUNTRIES = [
  { code: 'NL', name: 'Nederland' },
  { code: 'BE', name: 'België' },
  { code: 'LU', name: 'Luxemburg' }
];

const FREE_SHIPPING_THRESHOLD = 50;

const Checkout = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { items, getCartSummary, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableCarriers, setAvailableCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: profile?.full_name?.split(' ')[0] || '',
    lastName: profile?.full_name?.split(' ').slice(1).join(' ') || '',
    phone: profile?.phone || '',
    street: profile?.default_address?.street || '',
    houseNumber: profile?.default_address?.houseNumber || '',
    postalCode: profile?.default_address?.postalCode || '',
    city: profile?.default_address?.city || '',
    country: profile?.default_address?.country || 'NL',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If country changes, fetch new carriers
    if (name === 'country') {
      fetchCarriers(value);
    }
  };

  // Fetch available carriers for selected country
  const fetchCarriers = async (countryCode) => {
    try {
      const { data, error } = await supabase
        .rpc('get_available_carriers', { country: countryCode });
      
      if (error) throw error;
      
      setAvailableCarriers(data || []);
      // Auto-select cheapest carrier (DHL)
      if (data && data.length > 0) {
        setSelectedCarrier(data[0]);
      }
    } catch (err) {
      console.error('Error fetching carriers:', err);
      // Fallback to default carriers
      const fallbackCarriers = [
        { carrier_code: 'dhl', carrier_name: 'DHL', flat_rate: 5.95, delivery_time: '1-2 werkdagen', free_shipping_threshold: 50 },
        { carrier_code: 'postnl', carrier_name: 'PostNL', flat_rate: 6.95, delivery_time: '1-2 werkdagen', free_shipping_threshold: 50 }
      ];
      setAvailableCarriers(fallbackCarriers);
      setSelectedCarrier(fallbackCarriers[0]);
    }
  };

  // Load carriers on mount and when country changes
  useEffect(() => {
    fetchCarriers(formData.country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate totals
  const { subtotal } = getCartSummary();
  const shippingCost = selectedCarrier && subtotal >= FREE_SHIPPING_THRESHOLD 
    ? 0 
    : (selectedCarrier?.flat_rate || 0);
  const total = subtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      setError('Je winkelmandje is leeg');
      return;
    }

    if (!selectedCarrier) {
      setError('Selecteer een verzendmethode');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the create-payment edge function
      const { data, error: fnError } = await supabase.functions.invoke('create-payment', {
        body: {
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            slug: item.slug,
            quantity: item.quantity,
            price: item.price
          })),
          customer: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          },
          shippingAddress: {
            street: formData.street,
            houseNumber: formData.houseNumber,
            postalCode: formData.postalCode,
            city: formData.city,
            country: formData.country
          },
          carrier: {
            code: selectedCarrier?.carrier_code || 'dhl',
            name: selectedCarrier?.carrier_name || 'DHL',
            cost: shippingCost
          },
          notes: formData.notes,
          userId: user?.id || null
        }
      });

      if (fnError) throw fnError;

      if (data?.checkoutUrl) {
        // Redirect to Mollie checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('Geen checkout URL ontvangen');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Er ging iets mis bij het afrekenen');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageTransition className="pt-24">
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Je winkelmandje is leeg</h1>
          <p className="text-gray-500 mb-6">Voeg eerst producten toe aan je winkelmandje</p>
          <Link
            to="/winkel"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar shop
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pt-24">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8">Afrekenen</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Account prompt for guests */}
                {!user && (
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">Heb je al een account?</p>
                          <p className="text-sm text-gray-600">Log in om je gegevens automatisch in te vullen</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          to="/winkel/account?redirect=/winkel/checkout"
                          className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                        >
                          Inloggen
                        </Link>
                        <Link
                          to="/winkel/account?redirect=/winkel/checkout"
                          className="px-5 py-2.5 border border-gray-200 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors text-sm"
                        >
                          Registreren
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logged in user info */}
                {user && (
                  <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-4 border border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Ingelogd als {user.email}</p>
                      <p className="text-sm text-green-600">Je bestelling wordt gekoppeld aan je account</p>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">1</span>
                    Contactgegevens
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mailadres *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="jouw@email.nl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Voornaam *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Achternaam *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefoonnummer
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="+31 6 12345678"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">2</span>
                    Verzendadres
                  </h2>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Straat *
                      </label>
                      <input
                        type="text"
                        name="street"
                        required
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Huisnummer *
                      </label>
                      <input
                        type="text"
                        name="houseNumber"
                        required
                        value={formData.houseNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postcode *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="1234 AB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plaats *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Land *
                      </label>
                      <div className="relative">
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                        >
                          {SHIPPING_COUNTRIES.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opmerkingen (optioneel)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        placeholder="Bijv. bezorginstructies"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">3</span>
                    Verzendmethode
                  </h2>

                  <div className="space-y-3">
                    {availableCarriers.map((carrier) => (
                      <motion.div
                        key={carrier.carrier_code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCarrier(carrier)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedCarrier?.carrier_code === carrier.carrier_code
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedCarrier?.carrier_code === carrier.carrier_code
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}>
                              {selectedCarrier?.carrier_code === carrier.carrier_code && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <Truck className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-bold">{carrier.carrier_name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>{carrier.delivery_time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                              <div>
                                <p className="font-bold text-green-600">Gratis</p>
                                <p className="text-xs text-gray-500 line-through">€{carrier.flat_rate.toFixed(2)}</p>
                              </div>
                            ) : (
                              <p className="font-bold text-primary">€{carrier.flat_rate.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-800">
                        💡 Nog €{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} voor gratis verzending!
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">4</span>
                    Betaling
                  </h2>

                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-4">
                    <CreditCard className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Veilig betalen via Mollie</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Kies je betaalmethode op de volgende pagina: iDEAL, Bancontact, creditcard en meer.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <img src="https://www.mollie.com/external/icons/payment-methods/ideal.svg" alt="iDEAL" className="h-8" />
                        <img src="https://www.mollie.com/external/icons/payment-methods/bancontact.svg" alt="Bancontact" className="h-8" />
                        <img src="https://www.mollie.com/external/icons/payment-methods/creditcard.svg" alt="Credit Card" className="h-8" />
                        <img src="https://www.mollie.com/external/icons/payment-methods/paypal.svg" alt="PayPal" className="h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
                  <h2 className="text-xl font-bold mb-6">Besteloverzicht</h2>

                  {/* Items */}
                  <div className="space-y-4 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                          <p className="text-gray-500 text-sm">Aantal: {item.quantity}</p>
                        </div>
                        <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotaal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Verzending {selectedCarrier ? `(${selectedCarrier.carrier_name})` : ''}
                      </span>
                      <span>{shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}</span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-gray-500">
                        Nog €{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} voor gratis verzending
                      </p>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-4 border-t">
                      <span>Totaal</span>
                      <span className="text-primary">€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Bezig met verwerken...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Betalen - €{total.toFixed(2)}
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Veilig betalen via Mollie
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;

