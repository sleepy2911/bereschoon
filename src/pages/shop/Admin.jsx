import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, ShoppingCart, Settings, ArrowLeft, Plus,
  Edit, Trash2, Loader2, AlertCircle, Search, Eye, EyeOff,
  Upload, X, GripVertical, Save, Image as ImageIcon, Clock
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { supabase, uploadFile, deleteFile } from '../../lib/supabase';
import OrdersManagementTable from '../../components/shop/OrdersManagementTable';

// ==================== ADMIN LAYOUT ====================
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/winkel');
    }
  }, [isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { path: '/winkel/admin', label: 'Producten', icon: Package, exact: true },
    { path: '/winkel/admin/bestellingen', label: 'Bestellingen', icon: ShoppingCart },
    { path: '/winkel/admin/instellingen', label: 'Instellingen', icon: Settings }
  ];

  return (
    <PageTransition className="pt-24">
      <SEO
        title="Admin Dashboard"
        description="Beheer de Bereschoon webshop."
        noindex={true}
      />
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/winkel"
                  className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Terug naar shop
                </Link>
                <div className="h-6 w-px bg-gray-200" />
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-6">
            <nav className="flex gap-1 overflow-x-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </div>
    </PageTransition>
  );
};

// ==================== PRODUCTS LIST ====================
const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Kon producten niet laden');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: !product.active })
        .eq('id', product.id);

      if (error) throw error;
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, active: !p.active } : p
      ));
    } catch (err) {
      console.error('Error toggling product:', err);
    }
  };

  const deleteProduct = async (product) => {
    if (!confirm(`Weet je zeker dat je "${product.name}" wilt verwijderen?`)) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== product.id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Producten</h2>
        <button
          onClick={() => navigate('/winkel/admin/product/nieuw')}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nieuw product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Zoek op naam of SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Product</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Prijs</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Voorraad</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Status</th>
                <th className="text-right px-6 py-4 font-medium text-gray-500">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'Geen producten gevonden' : 'Nog geen producten'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">€{product.price.toFixed(2)}</p>
                      {product.compare_price && (
                        <p className="text-sm text-gray-400 line-through">€{product.compare_price.toFixed(2)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.stock <= 5 ? 'text-orange-500' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors ${product.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                      >
                        {product.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {product.active ? 'Actief' : 'Inactief'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/winkel/admin/product/${product.id}`)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==================== PRODUCT FORM ====================
const ProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = location.pathname.includes('/nieuw');
  const productId = !isNew ? location.pathname.split('/').pop() : null;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    compare_price: '',
    stock: '0',
    active: true,
    featured: false,
    coming_soon: false,
    features: [],
    images: [],
    video_url: '',
    category: '',
    weight: '',
    sku: ''
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setFormData({
        ...data,
        price: data.price.toString(),
        compare_price: data.compare_price?.toString() || '',
        stock: data.stock.toString(),
        weight: data.weight?.toString() || '',
        features: data.features || [],
        images: data.images || [],
        coming_soon: data.coming_soon || false
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Kon product niet laden');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from name
    if (name === 'name' && (isNew || !formData.slug)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const url = await uploadFile('product-images', fileName, file);
        return url;
      });

      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Kon afbeelding niet uploaden');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        short_description: formData.short_description,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        stock: parseInt(formData.stock),
        active: formData.active,
        featured: formData.featured,
        coming_soon: formData.coming_soon,
        features: formData.features,
        images: formData.images,
        video_url: formData.video_url || null,
        category: formData.category || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        sku: formData.sku || null
      };

      if (isNew) {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId);

        if (error) throw error;
      }

      navigate('/winkel/admin');
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Kon product niet opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/winkel/admin')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">
            {isNew ? 'Nieuw product' : 'Product bewerken'}
          </h2>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Basisinformatie</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Productnaam *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="BS-PRODUCT-001"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Korte beschrijving
              </label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Eén zin die het product samenvat"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volledige beschrijving
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categorie
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Bijv. Bescherming"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gewicht (kg)
              </label>
              <input
                type="number"
                name="weight"
                step="0.001"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Prijs & Voorraad</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prijs (€) *
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vergelijkingsprijs (€)
              </label>
              <input
                type="number"
                name="compare_price"
                step="0.01"
                min="0"
                value={formData.compare_price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Oorspronkelijke prijs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voorraad *
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>Actief (zichtbaar in shop)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>Uitgelicht</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="coming_soon"
                checked={formData.coming_soon}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                Coming Soon
              </span>
            </label>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Productkenmerken</h3>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Voeg een kenmerk toe"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="flex-1">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Afbeeldingen</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                <img src={image} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                    Hoofdafbeelding
                  </span>
                )}
              </div>
            ))}

            <label className={`aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${uploadingImage ? 'pointer-events-none opacity-50' : ''}`}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Upload</span>
                </>
              )}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (optioneel)
            </label>
            <input
              type="text"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="/product-video.mp4 of https://..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/winkel/admin')}
            className="px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isNew ? 'Aanmaken' : 'Opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==================== ORDERS LIST ====================
const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price_at_purchase
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const updates = { status: newStatus };
      if (newStatus === 'shipped') updates.shipped_at = new Date().toISOString();
      if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString();

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bestellingen</h2>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Order</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Klant</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Datum</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Totaal</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Nog geen bestellingen
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-mono font-medium">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {order.order_items?.length} item(s)
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.email}</p>
                      <p className="text-sm text-gray-500">
                        {order.shipping_address?.city}, {order.shipping_address?.country}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      >
                        <option value="pending">In afwachting</option>
                        <option value="paid">Betaald</option>
                        <option value="processing">In behandeling</option>
                        <option value="shipped">Verzonden</option>
                        <option value="delivered">Bezorgd</option>
                        <option value="cancelled">Geannuleerd</option>
                        <option value="refunded">Terugbetaald</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==================== SETTINGS ====================
const AdminSettings = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Instellingen</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-gray-500">
          Hier komen de instellingen voor de webshop (verzendkosten, etc.)
        </p>
      </div>
    </div>
  );
};

// ==================== MAIN ADMIN COMPONENT ====================
const ShopAdmin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<ProductsList />} />
        <Route path="product/nieuw" element={<ProductForm />} />
        <Route path="product/:id" element={<ProductForm />} />
        <Route path="bestellingen" element={<OrdersManagementTable />} />
        <Route path="instellingen" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  );
};

export default ShopAdmin;

