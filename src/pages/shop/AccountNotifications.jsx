import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, Loader2, ChevronRight, Check, Package, Truck, 
  CheckCircle, XCircle, Clock, ExternalLink, Trash2
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const notificationIcons = {
  order_created: Clock,
  order_paid: CheckCircle,
  order_shipped: Truck,
  order_delivered: CheckCircle,
  order_cancelled: XCircle,
  tracking_updated: Package,
  general: Bell
};

const notificationColors = {
  order_created: 'text-blue-500 bg-blue-50',
  order_paid: 'text-green-500 bg-green-50',
  order_shipped: 'text-purple-500 bg-purple-50',
  order_delivered: 'text-green-600 bg-green-50',
  order_cancelled: 'text-red-500 bg-red-50',
  tracking_updated: 'text-orange-500 bg-orange-50',
  general: 'text-gray-500 bg-gray-50'
};

const AccountNotifications = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/winkel/account');
    }
  }, [user, authLoading, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Zojuist';
    if (diffMins < 60) return `${diffMins} minuten geleden`;
    if (diffHours < 24) return `${diffHours} uur geleden`;
    if (diffDays < 7) return `${diffDays} dagen geleden`;
    
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead([notification.id]);
    }
    
    // Navigate to order if there's an order_id
    if (notification.order_id) {
      navigate(`/winkel/account/bestellingen?order=${notification.order_id}`);
    }
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
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Meldingen</h1>
                {unreadCount > 0 && (
                  <p className="text-gray-500 mt-1">
                    {unreadCount} ongelezen melding{unreadCount !== 1 ? 'en' : ''}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                >
                  <Check className="w-4 h-4" />
                  Alles gelezen markeren
                </button>
              )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 shadow-sm text-center"
              >
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Geen meldingen</h2>
                <p className="text-gray-500 mb-6">
                  Je hebt nog geen meldingen ontvangen. We sturen je een melding bij updates over je bestellingen.
                </p>
                <Link
                  to="/winkel"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Naar de shop
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type] || Bell;
                  const colorClass = notificationColors[notification.type] || notificationColors.general;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                        !notification.read ? 'ring-2 ring-primary/20' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={`font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              {notification.metadata?.order_number && (
                                <p className="text-xs text-gray-500 font-mono mt-0.5">
                                  {notification.metadata.order_number}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary rounded-full" />
                              )}
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatDate(notification.created_at)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2">
                            {notification.message}
                          </p>
                          
                          {/* Action buttons */}
                          <div className="flex items-center gap-4 mt-3">
                            {notification.order_id && (
                              <span
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium cursor-pointer"
                              >
                                <Package className="w-4 h-4" />
                                Bekijk bestelling
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Back link */}
            <div className="mt-8">
              <Link
                to="/winkel/account"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                ← Terug naar account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AccountNotifications;

