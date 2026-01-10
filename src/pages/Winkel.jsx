import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ProductGrid from '../components/shop/ProductGrid';

const Winkel = () => {
  return (
    <PageTransition className="pt-24">
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
