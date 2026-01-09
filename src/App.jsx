import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnnouncementBanner from './components/AnnouncementBanner';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import Home from './pages/Home';
import Configurator from './pages/Configurator';
import Contact from './pages/Contact';
import Projecten from './pages/Projecten';
import ReviewsPage from './pages/Reviews';
import Winkel from './pages/Winkel';
import OverOns from './pages/OverOns';
import SplashScreen from './components/SplashScreen';

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
    <>
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
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/winkel" element={<Winkel />} />
              <Route path="/over-ons" element={<OverOns />} />
            </Routes>
          </main>

          <Footer />
          <CookieConsent />
        </Router>
      </div>
    </>
  );
}

export default App;
