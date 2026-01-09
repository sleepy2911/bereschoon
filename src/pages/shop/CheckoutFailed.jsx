import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import PageTransition from '../../components/PageTransition';

const CheckoutFailed = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');

  const getErrorMessage = () => {
    switch (reason) {
      case 'cancelled':
        return 'Je hebt de betaling geannuleerd.';
      case 'expired':
        return 'De betaling is verlopen.';
      case 'failed':
        return 'De betaling is mislukt.';
      default:
        return 'Er is iets misgegaan met de betaling.';
    }
  };

  return (
    <PageTransition className="pt-24">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-10 h-10 text-red-500" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              Betaling niet gelukt
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-6"
            >
              {getErrorMessage()}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-xl p-4 mb-6"
            >
              <p className="text-sm text-gray-600">
                Geen zorgen - je bent niets kwijt. Je winkelmandje is nog intact en je kunt het opnieuw proberen.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Link
                to="/winkel/checkout"
                className="w-full bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Opnieuw proberen
              </Link>

              <Link
                to="/winkel"
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Terug naar shop
              </Link>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 pt-6 border-t"
            >
              <Link
                to="/contact"
                className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                Hulp nodig? Neem contact op
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutFailed;

