import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import AnnouncementBanner from './components/AnnouncementBanner';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import StructuredData from './components/StructuredData';
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
import NotFound from './pages/NotFound';
import AlgemeneVoorwaarden from './pages/AlgemeneVoorwaarden';
import Privacy from './pages/Privacy';
import VerzendRetourbeleid from './pages/VerzendRetourbeleid';
import ReinigingsdienstenHelmond from './pages/locaties/ReinigingsdienstenHelmond';
import ReinigingsdienstenEindhoven from './pages/locaties/ReinigingsdienstenEindhoven';
import ReinigingsdienstenMierlo from './pages/locaties/ReinigingsdienstenMierlo';
import ReinigingsdienstenGemert from './pages/locaties/ReinigingsdienstenGemert';
import ReinigingsdienstenDenBosch from './pages/locaties/ReinigingsdienstenDenBosch';

// Shop pages
import ProductDetail from './pages/shop/ProductDetail';
import Checkout from './pages/shop/Checkout';
import CheckoutSuccess from './pages/shop/CheckoutSuccess';
import CheckoutFailed from './pages/shop/CheckoutFailed';
import Account from './pages/shop/Account';
import AccountOrders from './pages/shop/AccountOrders';
import AccountSettings from './pages/shop/AccountSettings';
import AccountNotifications from './pages/shop/AccountNotifications';
import ResetPassword from './pages/shop/ResetPassword';
import ShopAdmin from './pages/shop/Admin';
import CartSidebar from './components/shop/CartSidebar';
import NotificationToast from './components/shop/NotificationToast';
import TrackOrder from './pages/TrackOrder';

// Prefetch producten in de achtergrond zodra de app laadt
// Dit zorgt ervoor dat producten al gecached zijn in de browser voordat de gebruiker naar de shop gaat
const prefetchProducts = async () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/products?active=eq.true&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    if (!response.ok) return;

    const data = await response.json();

    // Prefetch afbeeldingen
    if (data) {
      data.forEach(product => {
        if (product.images?.length > 0) {
          product.images.forEach(imageUrl => {
            const img = new Image();
            img.src = imageUrl;
          });
        }
      });
    }
  } catch (err) {
    // Silent fail - prefetch is optional
  }
};

// Start prefetch zodra module wordt geladen
prefetchProducts();

// ScrollToTop component - scrollt naar boven bij route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useLayoutEffect(() => {
    // Disable browser's default scroll restoration to handle it manually
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Always scroll to top on route change immediately
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <HelmetProvider>
        <NotificationProvider>
          {loading && <SplashScreen onFinish={() => setLoading(false)} />}

          <div className={`min-h-screen flex flex-col font-sans text-foreground bg-background transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            <Router>
              <ScrollToTop />
              <StructuredData />
              <AnnouncementBanner />
              <Navbar />

              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home heroReady={!loading} />} />
                  <Route path="/configurator" element={<Configurator />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/projecten" element={<Projecten />} />
                  <Route path="/over-ons" element={<OverOns />} />
                  <Route path="/oprit-terras-terrein" element={<OpritTerrasTerrein />} />
                  <Route path="/gevelreiniging" element={<Gevelreiniging />} />
                  <Route path="/onkruidbeheersing" element={<Onkruidbeheersing />} />
                  <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/verzend-retourbeleid" element={<VerzendRetourbeleid />} />
                  
                  {/* Location-based SEO pages */}
                  <Route path="/reinigingsdiensten-helmond" element={<ReinigingsdienstenHelmond />} />
                  <Route path="/reinigingsdiensten-eindhoven" element={<ReinigingsdienstenEindhoven />} />
                  <Route path="/reinigingsdiensten-mierlo" element={<ReinigingsdienstenMierlo />} />
                  <Route path="/reinigingsdiensten-gemert" element={<ReinigingsdienstenGemert />} />
                  <Route path="/reinigingsdiensten-den-bosch" element={<ReinigingsdienstenDenBosch />} />

                  {/* Webshop routes */}
                  <Route path="/winkel" element={<Winkel />} />
                  <Route path="/winkel/product/:slug" element={<ProductDetail />} />
                  <Route path="/winkel/checkout" element={<Checkout />} />
                  <Route path="/winkel/betaling-succes" element={<CheckoutSuccess />} />
                  <Route path="/winkel/betaling-mislukt" element={<CheckoutFailed />} />
                  <Route path="/winkel/account" element={<Account />} />
                  <Route path="/winkel/account/bestellingen" element={<AccountOrders />} />
                  <Route path="/winkel/account/instellingen" element={<AccountSettings />} />
                  <Route path="/winkel/account/meldingen" element={<AccountNotifications />} />
                  <Route path="/winkel/account/wachtwoord-reset" element={<ResetPassword />} />
                  <Route path="/winkel/admin/*" element={<ShopAdmin />} />

                  {/* Order tracking - public */}
                  <Route path="/track" element={<TrackOrder />} />
                  <Route path="/track/:trackingCode" element={<TrackOrder />} />

                  {/* 404 - catch all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
              <CookieConsent />
              <CartSidebar />
              <NotificationToast />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </Router>
          </div>
        </NotificationProvider>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
