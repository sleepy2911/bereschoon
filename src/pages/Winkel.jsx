import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, User, Package, Shield, Truck, Clock, ChevronRight, LogIn } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ProductGrid from '../components/shop/ProductGrid';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../stores/cartStore';

const Winkel = () => {
  const { user, isAdmin } = useAuth();
  const { items, openCart, getCartSummary } = useCartStore();
  const { itemCount, total } = getCartSummary();

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
            <span className="text-gray-900 font-medium">Shop</span>
          </nav>
        </div>
      </div>

      {/* Hero Section with Shop Actions */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-accent/5 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left: Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:max-w-xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Bereschoon <span className="text-primary">Shop</span>
              </h1>
              <p className="text-lg text-gray-600">
                Professionele onderhoudsproducten, nu voor iedereen beschikbaar.
              </p>
              
              {/* Admin Link */}
              {isAdmin && (
                <Link
                  to="/winkel/admin"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </motion.div>

            {/* Right: Account & Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Account Section */}
              <div className="bg-white rounded-2xl shadow-sm border p-4 min-w-[200px]">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Welkom terug!</p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/winkel/account"
                        className="flex-1 text-center text-sm py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Account
                      </Link>
                      <Link
                        to="/winkel/account/bestellingen"
                        className="flex-1 text-center text-sm py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Package className="w-4 h-4 mx-auto" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <LogIn className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Inloggen</p>
                        <p className="text-xs text-gray-500">Voor bestellingen & voordelen</p>
                      </div>
                    </div>
                    <Link
                      to="/winkel/account"
                      className="block w-full text-center py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Inloggen
                    </Link>
                    <p className="text-center text-xs text-gray-500">
                      Nog geen account?{' '}
                      <Link to="/winkel/account" className="text-primary hover:underline font-medium">
                        Registreren
                      </Link>
                    </p>
                  </div>
                )}
              </div>

              {/* Cart Section */}
              <button
                onClick={openCart}
                className="bg-gray-900 text-white rounded-2xl p-4 min-w-[160px] hover:bg-black transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="relative">
                    <ShoppingBag className="w-6 h-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-left font-medium">Winkelmandje</p>
                <p className="text-left text-sm text-gray-400">
                  {itemCount === 0 ? 'Leeg' : `€${total.toFixed(2)}`}
                </p>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="border-b bg-white">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-sm"><strong>Gratis verzending</strong> vanaf €50</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm"><strong>1-3 werkdagen</strong> levering</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm"><strong>Veilig</strong> iDEAL & meer</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-12 text-center">Onze Producten</h2>
            <ProductGrid />
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Waarom Bereschoon Producten?</h2>
            <p className="text-gray-600 mb-8">
              Al onze producten worden door ons eigen team gebruikt bij professionele reinigingswerkzaamheden.
              We verkopen alleen producten waar we 100% achter staan.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-gray-500">Tevreden klanten</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">5★</p>
                <p className="text-sm text-gray-500">Gemiddelde score</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-gray-500">Professioneel</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">NL</p>
                <p className="text-sm text-gray-500">Made in NL</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Winkel;
