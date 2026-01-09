import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AnnouncementBanner from './components/AnnouncementBanner';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import Home from './pages/Home';
import Configurator from './pages/Configurator';
import Contact from './pages/Contact';
import Projecten from './pages/Projecten';
import Winkel from './pages/Winkel';
import OverOns from './pages/OverOns';
import OpritTerrasTerrein from './pages/OpritTerrasTerrein';
import Gevelreiniging from './pages/Gevelreiniging';
import Onkruidbeheersing from './pages/Onkruidbeheersing';
import SplashScreen from './components/SplashScreen';

// Shop pages
import ProductDetail from './pages/shop/ProductDetail';
import Checkout from './pages/shop/Checkout';
import CheckoutSuccess from './pages/shop/CheckoutSuccess';
import CheckoutFailed from './pages/shop/CheckoutFailed';
import Account from './pages/shop/Account';
import AccountOrders from './pages/shop/AccountOrders';
import AccountSettings from './pages/shop/AccountSettings';
import ShopAdmin from './pages/shop/Admin';
import CartSidebar from './components/shop/CartSidebar';

// ScrollToTop component - scrollt naar boven bij route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  
  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}

      <div className={`min-h-screen flex flex-col font-sans text-foreground bg-background transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Router>
          <ScrollToTop />
          <AnnouncementBanner />
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/configurator" element={<Configurator />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/projecten" element={<Projecten />} />
              <Route path="/over-ons" element={<OverOns />} />
              <Route path="/oprit-terras-terrein" element={<OpritTerrasTerrein />} />
              <Route path="/gevelreiniging" element={<Gevelreiniging />} />
              <Route path="/onkruidbeheersing" element={<Onkruidbeheersing />} />
              
              {/* Webshop routes */}
              <Route path="/winkel" element={<Winkel />} />
              <Route path="/winkel/product/:slug" element={<ProductDetail />} />
              <Route path="/winkel/checkout" element={<Checkout />} />
              <Route path="/winkel/betaling-succes" element={<CheckoutSuccess />} />
              <Route path="/winkel/betaling-mislukt" element={<CheckoutFailed />} />
              <Route path="/winkel/account" element={<Account />} />
              <Route path="/winkel/account/bestellingen" element={<AccountOrders />} />
              <Route path="/winkel/account/instellingen" element={<AccountSettings />} />
              <Route path="/winkel/admin/*" element={<ShopAdmin />} />
            </Routes>
          </main>

          <Footer />
          <CookieConsent />
          <CartSidebar />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
