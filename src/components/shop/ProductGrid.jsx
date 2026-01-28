import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShoppingBag, Play, Check, RefreshCw, Truck, Clock, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../stores/cartStore';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentUpdate, setRecentUpdate] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  const fetchProducts = useCallback(async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/products?active=eq.true&select=*&order=featured.desc,created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching products');
      }

      const data = await response.json();
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Kon producten niet laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Real-time subscription voor product updates van admin panel
  useEffect(() => {
    const channel = supabase
      .channel('product-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            if (payload.new.active) {
              setProducts(prev => [payload.new, ...prev]);
              setRecentUpdate(payload.new.id);
              setTimeout(() => setRecentUpdate(null), 3000);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedProduct = payload.new;

            if (updatedProduct.active) {
              setProducts(prev => {
                const exists = prev.find(p => p.id === updatedProduct.id);
                if (exists) {
                  return prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
                } else {
                  return [updatedProduct, ...prev];
                }
              });
              setRecentUpdate(updatedProduct.id);
              setTimeout(() => setRecentUpdate(null), 3000);
            } else {
              setProducts(prev => prev.filter(p => p.id !== updatedProduct.id));
            }
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddToCart = (product) => {
    addItem(product);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="text-primary hover:underline"
        >
          Opnieuw proberen
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Nog geen producten beschikbaar</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-16">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => {
          const discountPercentage = product.compare_price
            ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
            : null;
          const features = product.features || [];
          const isEven = index % 2 === 0;
          const isRecentlyUpdated = recentUpdate === product.id;

          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ delay: index * 0.1, layout: { duration: 0.3 } }}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-4 lg:gap-16 relative ${isRecentlyUpdated ? 'ring-2 ring-primary ring-offset-4 rounded-3xl' : ''
                } bg-white lg:bg-transparent rounded-2xl lg:p-0`}
            >
              {/* Update indicator */}
              <AnimatePresence>
                {isRecentlyUpdated && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Product bijgewerkt
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Title (Top, Compact, Left-Aligned) */}
              <div className="w-full lg:hidden text-left mb-2 px-1">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h3>
              </div>

              {/* Video/Image Side */}
              <div className="lg:w-1/2 w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-sm lg:shadow-2xl aspect-square md:aspect-[4/3] bg-gray-100 group">
                  {product.video_url ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={product.video_url} type="video/mp4" />
                    </video>
                  ) : product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ShoppingBag className="w-16 h-16 text-gray-300" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.coming_soon && (
                      <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Binnenkort Beschikbaar
                      </span>
                    )}
                    {product.featured && !product.coming_soon && (
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Nieuw
                      </span>
                    )}
                    {discountPercentage && !product.coming_soon && (
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Video indicator */}
                  {product.video_url && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Play className="w-3 h-3 text-white fill-white" />
                      <span className="text-white text-xs font-medium">Video</span>
                    </div>
                  )}

                  {/* Glow effect (Desktop only to save performance on mobile) */}
                  <div className="hidden lg:block absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl -z-10 opacity-70"></div>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-1/2 w-full space-y-3 lg:space-y-6 px-1">
                {product.category && (
                  <span className="hidden lg:block text-sm text-primary font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                )}

                {/* Desktop Title */}
                <h3 className="hidden lg:block text-3xl md:text-4xl font-bold text-gray-900">
                  {product.name}
                </h3>

                {/* Mobile: Price & Quick Add Row (New) */}
                <div className="flex lg:hidden items-center justify-between">
                  {/* Price & Reviews Grouped */}
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      {product.coming_soon ? (
                        <span className="text-lg font-bold text-primary">
                          Binnenkort beschikbaar
                        </span>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-gray-900">
                              €{product.price?.toFixed(2) || '0.00'}
                            </span>
                            {product.compare_price && (
                              <span className="text-sm text-gray-400 line-through">
                                €{product.compare_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {/* Reviews Inline with Price */}
                          <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                              <Check size={12} className="hidden" />
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-xs">★</span>
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium">(50+)</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {!product.coming_soon && (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="h-10 w-10 flex items-center justify-center bg-gray-900 text-white rounded-full shadow-md active:scale-95 transition-transform disabled:bg-gray-300"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Mobile: USPs (Restored, Centered) */}
                <div className="flex lg:hidden flex-wrap justify-center gap-x-3 gap-y-1 border-t border-gray-100 pt-3 mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Truck size={12} className="text-green-600" />
                    <span>Gratis verzending</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock size={12} className="text-blue-600" />
                    <span>1-3 dagen</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Shield size={12} className="text-primary" />
                    <span>Veilig betalen</span>
                  </div>
                </div>

                {/* Desktop Price */}
                <div className="hidden lg:flex items-baseline gap-3">
                  {product.coming_soon ? (
                    <span className="text-2xl font-bold text-primary">
                      Binnenkort beschikbaar
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-primary">
                        €{product.price?.toFixed(2) || '0.00'}
                      </span>
                      {product.compare_price && (
                        <span className="text-xl text-gray-400 line-through">
                          €{product.compare_price.toFixed(2)}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Desktop Reviews */}
                {(() => {
                  const reviews = product.reviews || [];
                  const avgRating = reviews.length > 0
                    ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
                    : 0;

                  return reviews.length > 0 ? (
                    <Link
                      to={`/winkel/product/${product.slug}`}
                      className="hidden lg:flex items-center gap-2 group w-fit"
                    >
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= Math.round(avgRating) ? "text-yellow-400 text-sm" : "text-gray-300 text-sm"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 group-hover:text-primary transition-colors border-b border-gray-200 group-hover:border-primary">
                        {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                      </span>
                    </Link>
                  ) : (
                    <div className="hidden lg:flex items-center gap-2 text-gray-400 text-sm">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-gray-300 text-sm">★</span>
                        ))}
                      </div>
                      <span>Nog geen reviews</span>
                    </div>
                  );
                })()}

                {/* Description */}
                {product.short_description && (
                  <p className={`text-sm lg:text-lg text-gray-500 lg:text-gray-600 leading-relaxed ${"line-clamp-2 lg:line-clamp-none lg:text-left"}`}>
                    {product.short_description}
                  </p>
                )}

                {/* Desktop: Features */}
                {features.length > 0 && (
                  <ul className="hidden lg:block space-y-3">
                    {features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700">
                        <div className="bg-green-100 text-green-600 rounded-full p-1 flex-shrink-0">
                          <Check size={14} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Desktop: Actions */}
                <div className="hidden lg:flex flex-col sm:flex-row gap-4 pt-4">
                  {product.coming_soon ? (
                    <Link
                      to={`/winkel/product/${product.slug}`}
                      className="flex-1 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Clock className="w-5 h-5" />
                      Bekijk Product
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        {product.stock === 0 ? 'Uitverkocht' : 'In Winkelmandje'}
                      </button>
                      <Link
                        to={`/winkel/product/${product.slug}`}
                        className="px-8 py-4 rounded-xl font-medium border-2 border-gray-200 hover:border-primary hover:text-primary transition-colors text-center"
                      >
                        Meer Info
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile: Link to detail (Ghost Button style) */}
                <div className="lg:hidden pt-1">
                  <Link
                    to={`/winkel/product/${product.slug}`}
                    className="block w-full py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    Meer details
                  </Link>
                </div>

                {/* Stock warning */}
                {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                  <p className="text-orange-500 text-sm">
                    ⚠️ Nog maar {product.stock} op voorraad
                  </p>
                )}

                <p className="hidden lg:block text-sm text-gray-500">
                  * Gratis verzending vanaf €50.
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
