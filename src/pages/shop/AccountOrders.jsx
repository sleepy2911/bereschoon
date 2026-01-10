import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Loader2, Clock, CheckCircle, ChevronRight,
  Truck, XCircle, Eye, ExternalLink, RefreshCw, Bell
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const statusConfig = {
  pending: { label: 'In afwachting', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  paid: { label: 'Betaald', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  processing: { label: 'In behandeling', color: 'text-purple-600 bg-purple-50', icon: Package },
  shipped: { label: 'Verzonden', color: 'text-green-600 bg-green-50', icon: Truck },
  delivered: { label: 'Bezorgd', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  cancelled: { label: 'Geannuleerd', color: 'text-red-600 bg-red-50', icon: XCircle },
  refunded: { label: 'Terugbetaald', color: 'text-gray-600 bg-gray-50', icon: XCircle }
};

const AccountOrders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [recentUpdate, setRecentUpdate] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_slug,
            quantity,
            price_at_purchase
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Kon bestellingen niet laden');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/winkel/account');
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate, fetchOrders]);

  // Realtime subscription voor order updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('order-updates-page')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedOrder = payload.new;
          
          // Update de order in de lijst
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === updatedOrder.id 
                ? { ...order, ...updatedOrder }
                : order
            )
          );
          
          // Toon update indicator
          setRecentUpdate(updatedOrder.id);
          setTimeout(() => setRecentUpdate(null), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || loading) {
    return (
      <PageTransition className="pt-24">
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="pt-24">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Mijn Bestellingen</h1>
            </div>

            {/* Orders */}
            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 shadow-sm text-center"
              >
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Nog geen bestellingen</h2>
                <p className="text-gray-500 mb-6">Je hebt nog geen bestellingen geplaatst.</p>
                <Link
                  to="/winkel"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Naar de shop
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  const isRecentlyUpdated = recentUpdate === order.id;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-2xl shadow-sm overflow-hidden relative ${
                        isRecentlyUpdated ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    >
                      {/* Recent update indicator */}
                      <AnimatePresence>
                        {isRecentlyUpdated && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute top-4 right-4 flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-medium"
                          >
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Zojuist bijgewerkt
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Order Header */}
                      <div className="p-6 border-b">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Bestelnummer</p>
                            <p className="font-mono font-bold">{order.order_number}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Datum</p>
                            <p className="font-medium">{formatDate(order.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Totaal</p>
                            <p className="font-bold text-primary">€{order.total.toFixed(2)}</p>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium text-sm">{status.label}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items (collapsed by default) */}
                      <div className="p-6">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          {selectedOrder === order.id ? 'Verberg details' : 'Bekijk details'}
                        </button>

                        {selectedOrder === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 space-y-4"
                          >
                            {/* Items */}
                            <div className="space-y-3">
                              {order.order_items?.map(item => (
                                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                  <div>
                                    <p className="font-medium">{item.product_name}</p>
                                    <p className="text-sm text-gray-500">Aantal: {item.quantity}</p>
                                  </div>
                                  <p className="font-medium">€{(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                                </div>
                              ))}
                            </div>

                            {/* Shipping Address */}
                            {order.shipping_address && (
                              <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm font-medium text-gray-500 mb-2">Verzendadres</p>
                                <p>{order.shipping_address.street} {order.shipping_address.houseNumber}</p>
                                <p>{order.shipping_address.postalCode} {order.shipping_address.city}</p>
                                <p>{order.shipping_address.country}</p>
                              </div>
                            )}

                            {/* Tracking */}
                            {order.tracking_code && (
                              <div className="bg-green-50 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-green-700 mb-1">Track & Trace</p>
                                  <p className="font-mono">{order.tracking_code}</p>
                                </div>
                                {order.tracking_url && (
                                  <a
                                    href={order.tracking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-green-700 hover:underline"
                                  >
                                    Volg pakket
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Summary */}
                            <div className="border-t pt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotaal</span>
                                <span>€{order.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Verzending</span>
                                <span>{order.shipping_cost === 0 ? 'Gratis' : `€${order.shipping_cost.toFixed(2)}`}</span>
                              </div>
                              <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Totaal</span>
                                <span className="text-primary">€{order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AccountOrders;

