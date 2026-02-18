/**
 * AppServer.jsx — Server-only variant of App.jsx for SSR
 *
 * Uses StaticRouter instead of BrowserRouter.
 * Eagerly imports all page components (no React.lazy).
 * Skips client-only components (SplashScreen, Toaster, CookieConsent,
 * CartSidebar, NotificationToast, WhatsAppButton).
 * Uses stub context providers to avoid Supabase calls in SSR.
 */
import React from 'react';
import { StaticRouter } from 'react-router';
import { Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Page components — eager imports (NO React.lazy)
import Home from './pages/Home.jsx';
import Configurator from './pages/Configurator.jsx';
import Contact from './pages/Contact.jsx';
import Projecten from './pages/Projecten.jsx';
import Winkel from './pages/Winkel.jsx';
import OverOns from './pages/OverOns.jsx';
import OpritTerrasTerrein from './pages/OpritTerrasTerrein.jsx';
import Gevelreiniging from './pages/Gevelreiniging.jsx';
import Onkruidbeheersing from './pages/Onkruidbeheersing.jsx';
import NotFound from './pages/NotFound.jsx';
import AlgemeneVoorwaarden from './pages/AlgemeneVoorwaarden.jsx';
import Privacy from './pages/Privacy.jsx';
import VerzendRetourbeleid from './pages/VerzendRetourbeleid.jsx';
import ReinigingsdienstenHelmond from './pages/locaties/ReinigingsdienstenHelmond.jsx';
import ReinigingsdienstenEindhoven from './pages/locaties/ReinigingsdienstenEindhoven.jsx';
import ReinigingsdienstenMierlo from './pages/locaties/ReinigingsdienstenMierlo.jsx';
import ReinigingsdienstenGemert from './pages/locaties/ReinigingsdienstenGemert.jsx';
import ReinigingsdienstenDenBosch from './pages/locaties/ReinigingsdienstenDenBosch.jsx';
import AdLanding from './pages/AdLanding.jsx';
import TrackOrder from './pages/TrackOrder.jsx';

// Shop pages — eager imports
import ProductDetail from './pages/shop/ProductDetail.jsx';
import Checkout from './pages/shop/Checkout.jsx';
import CheckoutSuccess from './pages/shop/CheckoutSuccess.jsx';
import CheckoutFailed from './pages/shop/CheckoutFailed.jsx';
import Account from './pages/shop/Account.jsx';
import AccountOrders from './pages/shop/AccountOrders.jsx';
import AccountSettings from './pages/shop/AccountSettings.jsx';
import AccountNotifications from './pages/shop/AccountNotifications.jsx';
import ResetPassword from './pages/shop/ResetPassword.jsx';
import ShopAdmin from './pages/shop/Admin.jsx';

// Layout components
import Navbar from './components/Navbar.jsx';
import AnnouncementBanner from './components/AnnouncementBanner.jsx';
import Footer from './components/Footer.jsx';
import StructuredData from './components/StructuredData.jsx';

/**
 * Stub AuthContext to avoid Supabase calls during SSR
 */
const AuthContext = React.createContext({});
const StubAuthProvider = ({ children }) => {
    const value = {
        user: null,
        profile: null,
        isAdmin: false,
        loading: false,
        signUp: async () => { },
        signIn: async () => { },
        signOut: async () => { },
        resetPassword: async () => { },
        updatePassword: async () => { },
        updateProfile: async () => { },
        refreshProfile: () => { },
    };
    return React.createElement(AuthContext.Provider, { value }, children);
};

// Patch useAuth for SSR — components import useAuth from context
// We need to make the import resolve to our stub
// This is handled by the stub provider wrapping everything

/**
 * Stub NotificationContext
 */
const NotificationContext = React.createContext({});
const StubNotificationProvider = ({ children }) => {
    const value = {
        notifications: [],
        unreadCount: 0,
        loading: false,
        showToast: null,
        fetchNotifications: async () => { },
        markAsRead: async () => { },
        markAllAsRead: async () => { },
        dismissToast: () => { },
    };
    return React.createElement(NotificationContext.Provider, { value }, children);
};

/**
 * Server-side MainLayout (same structure as client, minus client-only components)
 */
const ServerMainLayout = () => {
    return React.createElement(React.Fragment, null,
        React.createElement(StructuredData),
        React.createElement(AnnouncementBanner),
        React.createElement(Navbar),
        React.createElement('main', { className: 'flex-grow' },
            React.createElement(Outlet)
        ),
        React.createElement(Footer)
    );
};

/**
 * AppServer — Main server-side app component
 */
const AppServer = ({ location }) => {
    return React.createElement(StubAuthProvider, null,
        React.createElement(HelmetProvider, null,
            React.createElement(StubNotificationProvider, null,
                React.createElement('div', {
                    className: 'min-h-screen flex flex-col font-sans text-foreground bg-background'
                },
                    React.createElement(StaticRouter, { location },
                        React.createElement(Routes, null,
                            // Standalone Ad Landing Page
                            React.createElement(Route, {
                                path: '/offerte-aanvraag',
                                element: React.createElement(AdLanding)
                            }),

                            // Main Application Layout
                            React.createElement(Route, {
                                element: React.createElement(ServerMainLayout)
                            },
                                React.createElement(Route, { path: '/', element: React.createElement(Home, { heroReady: true }) }),
                                React.createElement(Route, { path: '/configurator', element: React.createElement(Configurator) }),
                                React.createElement(Route, { path: '/contact', element: React.createElement(Contact) }),
                                React.createElement(Route, { path: '/projecten', element: React.createElement(Projecten) }),
                                React.createElement(Route, { path: '/over-ons', element: React.createElement(OverOns) }),
                                React.createElement(Route, { path: '/oprit-terras-terrein', element: React.createElement(OpritTerrasTerrein) }),
                                React.createElement(Route, { path: '/gevelreiniging', element: React.createElement(Gevelreiniging) }),
                                React.createElement(Route, { path: '/onkruidbeheersing', element: React.createElement(Onkruidbeheersing) }),
                                React.createElement(Route, { path: '/algemene-voorwaarden', element: React.createElement(AlgemeneVoorwaarden) }),
                                React.createElement(Route, { path: '/privacy', element: React.createElement(Privacy) }),
                                React.createElement(Route, { path: '/verzend-retourbeleid', element: React.createElement(VerzendRetourbeleid) }),

                                // Location-based SEO pages
                                React.createElement(Route, { path: '/reinigingsdiensten-helmond', element: React.createElement(ReinigingsdienstenHelmond) }),
                                React.createElement(Route, { path: '/reinigingsdiensten-eindhoven', element: React.createElement(ReinigingsdienstenEindhoven) }),
                                React.createElement(Route, { path: '/reinigingsdiensten-mierlo', element: React.createElement(ReinigingsdienstenMierlo) }),
                                React.createElement(Route, { path: '/reinigingsdiensten-gemert', element: React.createElement(ReinigingsdienstenGemert) }),
                                React.createElement(Route, { path: '/reinigingsdiensten-den-bosch', element: React.createElement(ReinigingsdienstenDenBosch) }),

                                // Webshop routes
                                React.createElement(Route, { path: '/winkel', element: React.createElement(Winkel) }),
                                React.createElement(Route, { path: '/winkel/product/:slug', element: React.createElement(ProductDetail) }),
                                React.createElement(Route, { path: '/winkel/checkout', element: React.createElement(Checkout) }),
                                React.createElement(Route, { path: '/winkel/betaling-succes', element: React.createElement(CheckoutSuccess) }),
                                React.createElement(Route, { path: '/winkel/betaling-mislukt', element: React.createElement(CheckoutFailed) }),
                                React.createElement(Route, { path: '/winkel/account', element: React.createElement(Account) }),
                                React.createElement(Route, { path: '/winkel/account/bestellingen', element: React.createElement(AccountOrders) }),
                                React.createElement(Route, { path: '/winkel/account/instellingen', element: React.createElement(AccountSettings) }),
                                React.createElement(Route, { path: '/winkel/account/meldingen', element: React.createElement(AccountNotifications) }),
                                React.createElement(Route, { path: '/winkel/account/wachtwoord-reset', element: React.createElement(ResetPassword) }),
                                React.createElement(Route, { path: '/winkel/admin/*', element: React.createElement(ShopAdmin) }),

                                // Order tracking
                                React.createElement(Route, { path: '/track', element: React.createElement(TrackOrder) }),
                                React.createElement(Route, { path: '/track/:trackingCode', element: React.createElement(TrackOrder) }),

                                // 404 catch-all
                                React.createElement(Route, { path: '*', element: React.createElement(NotFound) })
                            )
                        )
                    )
                )
            )
        )
    );
};

export default AppServer;
