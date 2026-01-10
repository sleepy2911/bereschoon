import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShoppingBag, Play, Check, RefreshCw } from 'lucide-react';
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
    <div className="space-y-16">
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
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16 relative ${
                isRecentlyUpdated ? 'ring-2 ring-primary ring-offset-4 rounded-3xl' : ''
              }`}
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

              {/* Video/Image Side */}
              <div className="lg:w-1/2 w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3] bg-gray-100 group">
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
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <span className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                        Nieuw
                      </span>
                    )}
                    {discountPercentage && (
                      <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Video indicator */}
                  {product.video_url && (
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                      <Play className="w-4 h-4 text-white fill-white" />
                      <span className="text-white text-sm font-medium">Video</span>
                    </div>
                  )}

                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl -z-10 opacity-70"></div>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-1/2 w-full space-y-6">
                {product.category && (
                  <span className="text-sm text-primary font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                )}
                
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    €{product.price?.toFixed(2) || '0.00'}
                  </span>
                  {product.compare_price && (
                    <span className="text-xl text-gray-400 line-through">
                      €{product.compare_price.toFixed(2)}
                    </span>
                  )}
                </div>

                {product.short_description && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {product.short_description}
                  </p>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <ul className="space-y-3">
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

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
                </div>

                {/* Stock warning */}
                {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                  <p className="text-orange-500 text-sm">
                    ⚠️ Nog maar {product.stock} op voorraad
                  </p>
                )}

                <p className="text-sm text-gray-500">
                  * Vandaag besteld, morgen in huis. Gratis verzending vanaf €50.
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
