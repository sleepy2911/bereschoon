import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../stores/cartStore';
import NotificationBell from './shop/NotificationBell';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasBanner, setHasBanner] = useState(false);
    const location = useLocation();
    const { user } = useAuth();
    const { items, openCart } = useCartStore();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const isHome = location.pathname === '/';
    const isOverOns = location.pathname === '/over-ons';
    const isOpritTerrasTerrein = location.pathname === '/oprit-terras-terrein';
    const isGevelreiniging = location.pathname === '/gevelreiniging';
    const isOnkruidbeheersing = location.pathname === '/onkruidbeheersing';
    const isShopPage = location.pathname.startsWith('/winkel');

    // Pages that should have white text when navbar is transparent (pages with hero sections)
    const hasHeroSection = isHome || isOverOns || isOpritTerrasTerrein || isGevelreiniging || isOnkruidbeheersing;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Check if banner is visible
        const checkBanner = () => {
            setHasBanner(document.body.classList.contains('has-banner'));
        };

        checkBanner();

        // Watch for class changes
        const observer = new MutationObserver(checkBanner);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { label: 'Over Ons', path: '/over-ons', isAnchor: false },
        { label: 'Projecten', path: '/projecten', isAnchor: false },
        { label: 'Winkel', path: '/winkel', isAnchor: false },
    ];

    return (
        <nav
            className={`fixed left-0 right-0 z-50 transition-all duration-300 ${hasBanner ? 'top-[44px]' : 'top-0'
                } ${isMobileMenuOpen
                    ? 'bg-white py-4 shadow-sm'
                    : isScrolled
                        ? 'bg-white/80 backdrop-blur-md shadow-sm py-4'
                        : 'bg-transparent py-6'
                }`}
            style={hasBanner ? { marginTop: 0 } : {}}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center relative w-20 h-20"
                >
                    <img
                        src="/images/logo.png"
                        alt="Bereschoon"
                        className="w-full h-full object-contain"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((item) => {
                        if (item.isAnchor) {
                            const id = item.path.replace('/#', '');
                            return isHome ? (
                                <a
                                    key={item.label}
                                    href={item.path}
                                    className={`text-sm font-medium transition-colors relative group ${isScrolled ? 'text-muted-foreground hover:text-foreground' : hasHeroSection ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {item.label}
                                    <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`text-sm font-medium transition-colors relative group ${isScrolled ? 'text-muted-foreground hover:text-foreground' : hasHeroSection ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {item.label}
                                    <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            );
                        } else {
                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`text-sm font-medium transition-colors relative group ${isScrolled ? 'text-muted-foreground hover:text-foreground' : hasHeroSection ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {item.label}
                                    <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            );
                        }
                    })}

                    <Link
                        to="/configurator"
                        className={`text-sm font-medium transition-colors relative group ${isScrolled ? 'text-muted-foreground hover:text-foreground' : hasHeroSection ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        AI Oprit Scan
                        <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link
                        to="/contact"
                        className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/50"
                    >
                        Offerte Aanvragen
                    </Link>

                    {/* Shop icons - only show on shop pages or when user is logged in */}
                    {(isShopPage || user) && (
                        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-200">
                            {/* Notification Bell - only for logged in users */}
                            {user && <NotificationBell />}

                            {/* Account Link */}
                            <Link
                                to="/winkel/account"
                                className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-gray-600 hover:text-primary hover:bg-gray-100' :
                                    hasHeroSection ? 'text-white/80 hover:text-white hover:bg-white/10' :
                                        'text-gray-600 hover:text-primary hover:bg-gray-100'
                                    }`}
                            >
                                <User className="w-5 h-5" />
                            </Link>

                            {/* Cart Button */}
                            <button
                                onClick={openCart}
                                className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'text-gray-600 hover:text-primary hover:bg-gray-100' :
                                    hasHeroSection ? 'text-white/80 hover:text-white hover:bg-white/10' :
                                        'text-gray-600 hover:text-primary hover:bg-gray-100'
                                    }`}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Actions Wrapper */}
                <div className="flex items-center gap-6 md:hidden">
                    {/* Shop Icons - only show on shop pages */}
                    {isShopPage && (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/winkel/account"
                                className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-gray-600 hover:text-primary hover:bg-gray-100' :
                                    hasHeroSection ? 'text-white/80 hover:text-white hover:bg-white/10' :
                                        'text-gray-600 hover:text-primary hover:bg-gray-100'
                                    }`}
                            >
                                <User className="w-5 h-5" />
                            </Link>

                            <button
                                onClick={openCart}
                                className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'text-gray-600 hover:text-primary hover:bg-gray-100' :
                                    hasHeroSection ? 'text-white/80 hover:text-white hover:bg-white/10' :
                                        'text-gray-600 hover:text-primary hover:bg-gray-100'
                                    }`}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-foreground p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((item) => {
                            if (item.isAnchor) {
                                return isHome ? (
                                    <a key={item.label} href={item.path} className="text-base font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link key={item.label} to={item.path} className="text-base font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                                        {item.label}
                                    </Link>
                                );
                            } else {
                                return (
                                    <Link key={item.label} to={item.path} className="text-base font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                                        {item.label}
                                    </Link>
                                );
                            }
                        })}
                        <Link to="/configurator" className="text-base font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                            AI Oprit Scan
                        </Link>
                        <Link to="/contact" className="bg-primary text-white px-5 py-3 rounded-full text-base font-medium w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
                            Offerte Aanvragen
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
