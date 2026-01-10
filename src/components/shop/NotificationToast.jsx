import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Package, Truck, CheckCircle, XCircle, Clock, X } from 'lucide-react';
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
  order_created: 'border-blue-400 bg-blue-50',
  order_paid: 'border-green-400 bg-green-50',
  order_shipped: 'border-purple-400 bg-purple-50',
  order_delivered: 'border-green-500 bg-green-50',
  order_cancelled: 'border-red-400 bg-red-50',
  tracking_updated: 'border-orange-400 bg-orange-50',
  general: 'border-gray-400 bg-gray-50'
};

const iconColors = {
  order_created: 'text-blue-500',
  order_paid: 'text-green-500',
  order_shipped: 'text-purple-500',
  order_delivered: 'text-green-600',
  order_cancelled: 'text-red-500',
  tracking_updated: 'text-orange-500',
  general: 'text-gray-500'
};

const NotificationToast = () => {
  const { showToast, dismissToast } = useNotifications();

  if (!showToast) return null;

  const Icon = notificationIcons[showToast.type] || Bell;
  const borderColor = notificationColors[showToast.type] || notificationColors.general;
  const iconColor = iconColors[showToast.type] || iconColors.general;

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50, x: 50 }}
          className="fixed top-24 right-6 z-50"
        >
          <div className={`w-80 bg-white rounded-xl shadow-2xl border-l-4 overflow-hidden ${borderColor}`}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${borderColor.replace('border-', 'bg-').replace('-400', '-100').replace('-500', '-100')}`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm text-gray-900">
                      {showToast.title}
                    </p>
                    <button
                      onClick={dismissToast}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {showToast.message}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-1 bg-primary/30"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;

