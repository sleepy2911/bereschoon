import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Check, Minus, Plus,
  ChevronLeft, ChevronRight, Play, Truck, Shield, Clock,
  Loader2, ArrowLeft, Star, FileText, AlertTriangle, Droplets, ShieldCheck, User, MessageSquare,
  ClipboardList, FlaskConical, ShieldAlert
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useCartStore } from '../../stores/cartStore';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';
import { generateProductSchema } from '../../utils/structuredData';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&active=eq.true&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching product');
      }

      const data = await response.json();
      if (!data || data.length === 0) throw new Error('Product niet gevonden');

      setProduct(data[0]);
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

  const handleQuickAdd = () => {
    if (product) {
      addItem(product, 1);
      toast.success('Toegevoegd aan winkelwagen');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmittingReview(true);
    try {
      const newReview = {
        id: crypto.randomUUID(),
        user_id: user.id,
        user_name: user.user_metadata?.full_name || 'Anoniem',
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
        date: new Date().toISOString(),
        replies: []
      };

      const currentReviews = product.reviews || [];
      const updatedReviews = [newReview, ...currentReviews];

      const { error: updateError } = await supabase
        .from('products')
        .update({ reviews: updatedReviews })
        .eq('id', product.id);

      if (updateError) throw updateError;

      setProduct({ ...product, reviews: updatedReviews });
      setShowReviewForm(false);
      setReviewRating(5);
      setReviewTitle('');
      setReviewContent('');
      toast.success('Review geplaatst!');
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Er ging iets mis bij het plaatsen van de review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const discountPercentage = product?.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  // Calculate average rating and distribution
  const reviews = product?.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100
      : 0
  }));

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
  const structuredData = generateProductSchema(product);
  const breadcrumbs = [
    { name: 'Home', url: 'https://bereschoon.nl' },
    { name: 'Webshop', url: 'https://bereschoon.nl/winkel' },
    { name: product.name, url: `https://bereschoon.nl/winkel/product/${product.slug}` }
  ];

  return (
    <PageTransition className="pt-24">
      <SEO
        title={product.name}
        description={product.short_description || product.description?.substring(0, 160)}
        image={images[0]}
        type="product"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          {/* Back link - Top Left */}
          <div className="mb-6">
            <Link
              to="/winkel"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar shop
            </Link>
          </div>

          {/* Mobile Title - Single Line, Top */}
          <div className="md:hidden mb-4">
            <h1 className="text-xl font-bold text-gray-900 truncate tracking-tight">
              {product.name}
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column: Image/Video */}
            <div className="space-y-4">
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
                  ) : images.length > 0 ? (
                    <motion.img
                      key={selectedImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ShoppingBag className="w-20 h-20 text-gray-300" />
                    </div>
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
                  {product.coming_soon && (
                    <span className="bg-primary/90 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      Binnenkort Beschikbaar
                    </span>
                  )}
                  {product.featured && !product.coming_soon && (
                    <span className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      Nieuw
                    </span>
                  )}
                  {discountPercentage && !product.coming_soon && (
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
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImageIndex === index && !showVideo
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
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all bg-gray-900 flex items-center justify-center ${showVideo ? 'border-primary' : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                      <Play className="w-8 h-8 text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Info & Actions */}
            <div className="space-y-6">

              {/* Desktop Header (Title & Category) */}
              <div className="hidden md:block">
                {product.category && (
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
              </div>

              {/* Mobile: Price + Quick Add Row */}
              <div className="flex md:hidden items-center justify-between mb-4">
                {product.coming_soon ? (
                  <span className="text-xl font-bold text-primary">
                    Binnenkort beschikbaar
                  </span>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        €{product.price?.toFixed(2) || '0.00'}
                      </span>
                      {product.compare_price && (
                        <span className="text-lg text-gray-400 line-through">
                          €{product.compare_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleQuickAdd}
                      className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                      <ShoppingBag className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Mobile: Reviews */}
              <div className="flex md:hidden items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={16}
                      fill={i <= Math.round(averageRating) ? "currentColor" : "none"}
                      className={i <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-500 underline">
                  {reviews.length} reviews
                </span>
              </div>

              {/* Desktop: Price */}
              <div className="hidden md:flex items-baseline gap-3 mb-4">
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

              {/* Short Description */}
              {product.short_description && (
                <p className="text-lg text-gray-600">
                  {product.short_description}
                </p>
              )}

              {/* Features List */}
              {features.length > 0 && (
                <div className="space-y-3 pt-2">
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

              {/* Mobile: USPs */}
              <div className="grid md:hidden grid-cols-3 gap-2 py-4 border-t border-b border-gray-100">
                <div className="text-center">
                  <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-gray-600">Gratis v.a. €50</p>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-gray-600">1-3 werkdagen</p>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-gray-600">Veilig betalen</p>
                </div>
              </div>

              {/* Desktop: Quantity & Add to Cart */}
              <div className="hidden md:block pt-6 border-t space-y-4">
                {product.coming_soon ? (
                  <div className="bg-lime-50 border border-primary/30 rounded-xl p-6 text-center">
                    <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Binnenkort Beschikbaar</h3>
                    <p className="text-gray-600 text-sm">
                      Dit product is momenteel nog niet beschikbaar voor aankoop. Bekijk de productinformatie hieronder.
                    </p>
                  </div>
                ) : (
                  <>
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
                      className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                      <ShoppingBag className="w-6 h-6" />
                      {product.stock === 0 ? 'Uitverkocht' : 'In Winkelmandje'}
                    </motion.button>

                    {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                      <p className="text-center text-orange-500 text-sm">
                        ⚠️ Nog maar {product.stock} op voorraad
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Desktop: USPs */}
              <div className="hidden md:grid grid-cols-3 gap-4 pt-6 border-t">
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

          {/* Product Information Tabs */}
          <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex items-center gap-2 px-6 py-5 text-sm font-bold uppercase tracking-wide transition-colors relative whitespace-nowrap ${activeTab === 'description' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FileText className="w-5 h-5" />
                Omschrijving
                {activeTab === 'description' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('usage')}
                className={`flex items-center gap-2 px-6 py-5 text-sm font-bold uppercase tracking-wide transition-colors relative whitespace-nowrap ${activeTab === 'usage' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <ClipboardList className="w-5 h-5" />
                Gebruik
                {activeTab === 'usage' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('dilution')}
                className={`flex items-center gap-2 px-6 py-5 text-sm font-bold uppercase tracking-wide transition-colors relative whitespace-nowrap ${activeTab === 'dilution' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FlaskConical className="w-5 h-5" />
                Verdunningen
                {activeTab === 'dilution' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('safety')}
                className={`flex items-center gap-2 px-6 py-5 text-sm font-bold uppercase tracking-wide transition-colors relative whitespace-nowrap ${activeTab === 'safety' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <ShieldAlert className="w-5 h-5" />
                Veiligheid
                {activeTab === 'safety' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8 md:p-10 min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="prose prose-lg max-w-none text-gray-700"
                  >
                    <div className="whitespace-pre-line leading-relaxed">{product.description || 'Geen beschrijving beschikbaar.'}</div>
                  </motion.div>
                )}

                {activeTab === 'usage' && (
                  <motion.div
                    key="usage"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="prose prose-lg max-w-none text-gray-700"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 flex-shrink-0">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 mt-0">Gebruiksaanwijzing</h3>
                        <div className="whitespace-pre-line leading-relaxed">{product.usage_instructions || 'Nog geen gebruiksaanwijzing beschikbaar.'}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'dilution' && (
                  <motion.div
                    key="dilution"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="prose prose-lg max-w-none text-gray-700"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600 flex-shrink-0">
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 mt-0">Verdunningen</h3>
                        <div className="whitespace-pre-line leading-relaxed">{product.dilution_instructions || 'Nog geen verdunningsinformatie beschikbaar.'}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'safety' && (
                  <motion.div
                    key="safety"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 flex-shrink-0">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 mt-0">Belangrijke Informatie</h3>
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {product.warnings || 'Geen belangrijke waarschuwingen.'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-50 rounded-xl text-red-600 flex-shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 mt-0">Veiligheidsblad & Ingrediënten</h3>
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {product.safety_info || 'Geen veiligheidsinformatie beschikbaar.'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Klantbeoordelingen</h2>

            <div className="grid lg:grid-cols-12 gap-12">
              {/* Review Summary - Left Side / Top */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                    <div className="flex flex-col">
                      <div className="flex text-yellow-400 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            size={20}
                            fill={i <= Math.round(averageRating) ? "currentColor" : "none"}
                            className={i <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-200"}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm">{reviews.length} reviews</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-3">
                        <span className="w-3 font-medium text-gray-600">{item.stars}</span>
                        <Star size={14} className="text-gray-400" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs text-gray-400">{Math.round(item.percentage)}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">Deel uw mening</h4>
                    <p className="text-gray-500 text-sm mb-4">Heeft u dit product gebruikt? Deel uw ervaring met anderen.</p>
                    {user ? (
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                      >
                        {showReviewForm ? 'Annuleren' : 'Schrijf een review'}
                      </button>
                    ) : (
                      <Link
                        to="/winkel/account"
                        className="flex items-center justify-center w-full border-2 border-primary text-primary py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                      >
                        Login om te reviewen
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews List & Form - Right Side */}
              <div className="lg:col-span-8">
                {/* Review Form */}
                <AnimatePresence>
                  {showReviewForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
                      exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                      onSubmit={handleSubmitReview}
                      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <h3 className="text-xl font-bold mb-6">Schrijf een review</h3>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Uw beoordeling</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(i => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setReviewRating(i)}
                              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                            >
                              <Star
                                size={32}
                                fill={i <= reviewRating ? "currentColor" : "none"}
                                className={`transition-colors ${i <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titel van uw review</label>
                        <input
                          type="text"
                          required
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                          placeholder="Bijv. Geweldig product!"
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Uw ervaring</label>
                        <textarea
                          required
                          rows={4}
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-shadow"
                          placeholder="Vertel ons wat u van het product vindt en waarom..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Plaats Review'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Nog geen reviews voor dit product.</p>
                      <p className="text-sm text-gray-400">Wees de eerste die een ervaring deelt!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{review.user_name}</p>
                              <div className="flex text-yellow-400 mt-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <Star
                                    key={i}
                                    size={14}
                                    fill={i <= review.rating ? "currentColor" : "none"}
                                    className={i <= review.rating ? "text-yellow-400" : "text-gray-200"}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">
                            {new Date(review.date).toLocaleDateString('nl-NL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <h4 className="font-bold text-gray-900 mb-2 text-lg">{review.title}</h4>
                        <p className="text-gray-600 leading-relaxed mb-6">{review.content}</p>

                        {/* Replies */}
                        {review.replies && review.replies.length > 0 && (
                          <div className="ml-8 mt-6 pl-6 border-l-2 border-primary/20 space-y-4">
                            {review.replies.map((reply, index) => (
                              <div key={index} className="bg-gray-50 p-5 rounded-r-xl rounded-b-xl rounded-tl-none">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-bold text-sm text-primary flex items-center gap-1">
                                    <ShieldCheck size={14} /> Bereschoon
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    • {new Date(reply.date).toLocaleDateString('nl-NL')}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 italic">"{reply.content}"</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
