import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Mail } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useCartStore } from '../../stores/cartStore';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear cart on successful payment
  useEffect(() => {
    clearCart();
  }, [clearCart]);

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
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              Bedankt voor je bestelling!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-6"
            >
              Je betaling is succesvol ontvangen. We gaan direct aan de slag met je bestelling.
            </motion.p>

            {orderId && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-xl p-4 mb-6"
              >
                <p className="text-sm text-gray-500 mb-1">Bestelnummer</p>
                <p className="font-mono font-bold text-lg">{orderId}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3 text-left bg-blue-50 rounded-xl p-4">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Bevestigingsmail</p>
                  <p className="text-sm text-blue-700">
                    Je ontvangt binnen enkele minuten een bevestigingsmail met alle details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left bg-primary/5 rounded-xl p-4">
                <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Verzending</p>
                  <p className="text-sm text-gray-600">
                    Je bestelling wordt binnen 1-3 werkdagen verzonden. Je ontvangt een track & trace code.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 space-y-3"
            >
              <Link
                to="/winkel/account/bestellingen"
                className="w-full bg-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Bekijk je bestelling
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/winkel"
                className="block text-gray-500 hover:text-gray-700 transition-colors"
              >
                Verder winkelen
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutSuccess;

