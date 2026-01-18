import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, RefreshCcw, Package } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ProductGrid from '../components/shop/ProductGrid';
import SEO from '../components/SEO';
import FAQSection from '../components/FAQSection';
import CallToAction from '../components/CallToAction';
import TrustSection from '../components/TrustSection';

const Winkel = () => {
  const uspItems = [
    {
      icon: Truck,
      text: <span><strong>Gratis verzending</strong> vanaf €50</span>
    },
    {
      icon: Clock,
      text: <span><strong>1-3 werkdagen</strong> levering</span>
    },
    {
      icon: Shield,
      text: <span><strong>Veilig</strong> iDEAL & meer</span>
    }
  ];

  const shopQuestions = [
    {
      icon: Truck,
      question: "Wat zijn de verzendkosten?",
      answer: "Verzending is gratis voor bestellingen vanaf €50. Voor bestellingen daaronder rekenen wij een klein bedrag aan verzendkosten. Dit wordt duidelijk weergegeven in uw winkelwagen."
    },
    {
      icon: Clock,
      question: "Wat is de levertijd?",
      answer: "Wij streven ernaar om bestellingen binnen 1-3 werkdagen bij u te bezorgen. U ontvangt een track & trace code zodra uw pakket is verzonden."
    },
    {
      icon: RefreshCcw,
      question: "Kan ik producten retourneren?",
      answer: "Ja, u kunt ongeopende producten binnen 14 dagen na ontvangst retourneren. Neem contact op met onze klantenservice voor de retourinstructies."
    },
    {
      icon: Shield,
      question: "Zijn deze producten veilig voor mijn tuin?",
      answer: "Ja, al onze producten zijn zorgvuldig geselecteerd en worden door ons ook professioneel gebruikt. Lees altijd de gebruiksaanwijzing voor het beste en veiligste resultaat."
    }
  ];

  const trustItems = [
    { value: "500+", label: "Tevreden klanten" },
    { value: "5★", label: "Gemiddelde score" },
    { value: "100%", label: "Professioneel" },
    { value: "NL", label: "Made in NL" },
  ];

  return (
    <PageTransition className="pt-24">
      <SEO
        title="Webshop"
        description="Bestel professionele reinigingsproducten voor uw tuin en terras in de Bereschoon webshop."
        breadcrumbs={[
          { name: 'Home', url: 'https://bereschoon.nl' },
          { name: 'Webshop', url: 'https://bereschoon.nl/winkel' }
        ]}
      />
      {/* USPs */}
      <section className="border-b bg-white overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block container mx-auto px-6 py-5">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {uspItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="flex items-center gap-3"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View (Marquee) */}
        <div className="md:hidden py-4 bg-gray-50/50">
          <motion.div
            className="flex gap-12 whitespace-nowrap pl-6"
            animate={{ x: "-50%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Duplicate items multiple times for smooth loop */}
            {[...uspItems, ...uspItems, ...uspItems, ...uspItems].map((item, index) => (
              <div key={index} className="flex items-center gap-3 flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-700">{item.text}</span>
              </div>
            ))}
          </motion.div>
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
            {/* Title removed as requested */}
            <ProductGrid />
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection
        title="Waarom Bereschoon Producten?"
        description="Al onze producten worden door ons eigen team gebruikt bij professionele reinigingswerkzaamheden. We verkopen alleen producten waar we 100% achter staan."
        items={trustItems}
        className="bg-gray-50"
      />

      <FAQSection
        title="Vragen over de webshop"
        subtitle="Klantenservice"
        questions={shopQuestions}
      />

      <CallToAction
        title="Toch liever"
        highlight="uitbesteden?"
        description="Wil je toch dat Bereschoon bij jouw je oprit komt schoonmaken? Onze specialisten staan voor u klaar."
        buttonText="Offerte Aanvragen"
        href="/contact"
      />
    </PageTransition>
  );
};

export default Winkel;
