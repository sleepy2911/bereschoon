import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Check, Minus, Plus, 
  ChevronLeft, ChevronRight, Play, Truck, Shield, Clock,
  Loader2
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../stores/cartStore';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Product niet gevonden');

      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const discountPercentage = product?.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  if (loading) {
    return (
      <PageTransition className="pt-24">
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition className="pt-24">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl text-gray-500 mb-4">{error || 'Product niet gevonden'}</p>
          <Link to="/winkel" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Terug naar shop
          </Link>
        </div>
      </PageTransition>
    );
  }

  const images = product.images || [];
  const features = product.features || [];

  return (
    <PageTransition className="pt-24">
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b sticky top-[72px] z-40">
          <div className="container mx-auto px-6 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <Link to="/winkel" className="text-gray-500 hover:text-primary transition-colors">
                Shop
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
                <AnimatePresence mode="wait">
                  {showVideo && product.video_url ? (
                    <motion.video
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="w-full h-full object-cover"
                    >
                      <source src={product.video_url} type="video/mp4" />
                    </motion.video>
                  ) : (
                    <motion.img
                      key={selectedImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={images[selectedImageIndex] || '/images/product-protector.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && !showVideo && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(i => i > 0 ? i - 1 : images.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(i => i < images.length - 1 ? i + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <span className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      Nieuw
                    </span>
                  )}
                  {discountPercentage && (
                    <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {(images.length > 1 || product.video_url) && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setShowVideo(false);
                      }}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImageIndex === index && !showVideo
                          ? 'border-primary'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {product.video_url && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all bg-gray-900 flex items-center justify-center ${
                        showVideo ? 'border-primary' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Play className="w-8 h-8 text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.category && (
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    €{product.price.toFixed(2)}
                  </span>
                  {product.compare_price && (
                    <span className="text-xl text-gray-400 line-through">
                      €{product.compare_price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                {product.short_description && (
                  <p className="text-lg text-gray-600">
                    {product.short_description}
                  </p>
                )}
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="pt-6 border-t space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Aantal:</span>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {product.stock === 0 ? 'Uitverkocht' : 'In Winkelmandje'}
                </motion.button>

                {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                  <p className="text-center text-orange-500 text-sm">
                    ⚠️ Nog maar {product.stock} op voorraad
                  </p>
                )}
              </div>

              {/* USPs */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Gratis verzending vanaf €50</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-gray-600">1-3 werkdagen</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Veilig betalen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Productbeschrijving</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="prose prose-lg max-w-none whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;

