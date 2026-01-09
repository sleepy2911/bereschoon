import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';

const ProductCard = ({ product, index = 0 }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const discountPercentage = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/winkel/product/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingBag className="w-16 h-16" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                Nieuw
              </span>
            )}
            {discountPercentage && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white text-gray-900 p-3 rounded-full shadow-lg"
            >
              <Eye className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
              {product.short_description}
            </p>
          )}

          {/* Price */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              €{product.price.toFixed(2)}
            </span>
            {product.compare_price && (
              <span className="text-gray-400 line-through text-sm">
                €{product.compare_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <p className="text-orange-500 text-xs mt-2">
              Nog maar {product.stock} op voorraad
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-red-500 text-xs mt-2">Uitverkocht</p>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-primary transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          {product.stock === 0 ? 'Uitverkocht' : 'In winkelmandje'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;

