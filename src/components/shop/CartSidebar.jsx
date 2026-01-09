import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';

const CartSidebar = () => {
  const location = useLocation();
  const { items, isOpen, closeCart, updateQuantity, removeItem, getCartSummary } = useCartStore();
  const { itemCount, subtotal, shippingCost, total, amountUntilFreeShipping } = getCartSummary();

  // Don't show cart sidebar on checkout page
  const isCheckoutPage = location.pathname.includes('/checkout');

  if (isCheckoutPage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Winkelmandje</h2>
                {itemCount > 0 && (
                  <span className="bg-primary text-white text-sm px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && amountUntilFreeShipping > 0 && (
              <div className="px-6 py-4 bg-primary/5 border-b">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>
                    Nog <strong className="text-primary">€{amountUntilFreeShipping.toFixed(2)}</strong> tot gratis verzending
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}

            {items.length > 0 && amountUntilFreeShipping <= 0 && (
              <div className="px-6 py-3 bg-green-50 border-b flex items-center gap-2 text-green-700">
                <Truck className="w-4 h-4" />
                <span className="text-sm font-medium">Je hebt gratis verzending! 🎉</span>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">Je winkelmandje is leeg</p>
                  <Link
                    to="/winkel"
                    onClick={closeCart}
                    className="text-primary hover:underline font-medium"
                  >
                    Bekijk onze producten
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/winkel/product/${item.slug}`}
                          onClick={closeCart}
                          className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-primary font-bold mt-1">
                          €{item.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-white rounded-lg border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Summary */}
            {items.length > 0 && (
              <div className="border-t p-6 bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotaal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Verzending</span>
                    <span>{shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Totaal</span>
                    <span className="text-primary">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/winkel/checkout"
                  onClick={closeCart}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  Afrekenen
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/winkel"
                  onClick={closeCart}
                  className="block text-center mt-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Verder winkelen
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

