import React, { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Loader2, Eye, ExternalLink, X, Truck, MessageSquare, Save
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const OrdersManagementTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModal, setTrackingModal] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    carrierName: '',
    carrierTrackingUrl: '',
    description: ''
  });
  const [updatingTracking, setUpdatingTracking] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

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
      // Get user session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Je moet ingelogd zijn om dit te doen');
        return;
      }

      // Call update-order-tracking edge function
      const { data, error } = await supabase.functions.invoke('update-order-tracking', {
        body: {
          orderId: orderId,
          status: newStatus,
          sendEmail: false
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (data && !data.success) {
        throw new Error(data.error || 'Update mislukt');
      }

      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      alert(err.message || 'Kon order niet updaten');
    }
  };

  const openTrackingModal = (order) => {
    setTrackingModal(order);
    setTrackingForm({
      carrierName: order.carrier_name || '',
      carrierTrackingUrl: order.carrier_tracking_url || '',
      description: ''
    });
  };

  const closeTrackingModal = () => {
    setTrackingModal(null);
    setTrackingForm({
      carrierName: '',
      carrierTrackingUrl: '',
      description: ''
    });
  };

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    setUpdatingTracking(true);

    try {
      // Get user session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Je moet ingelogd zijn om dit te doen');
        return;
      }

      // Call update-order-tracking edge function
      const { data, error } = await supabase.functions.invoke('update-order-tracking', {
        body: {
          orderId: trackingModal.id,
          status: 'shipped',
          carrierName: trackingForm.carrierName || null,
          carrierTrackingUrl: trackingForm.carrierTrackingUrl || null,
          description: trackingForm.description || null,
          sendEmail: false
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (data && !data.success) {
        throw new Error(data.error || 'Update mislukt');
      }

      alert('Tracking informatie succesvol bijgewerkt!');
      closeTrackingModal();
      fetchOrders();
    } catch (err) {
      console.error('Error updating tracking:', err);
      alert(err.message || 'Kon tracking niet updaten');
    } finally {
      setUpdatingTracking(false);
    }
  };

  const startEditingNote = (order) => {
    setEditingNote(order.id);
    setNoteText(order.external_notes || '');
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setNoteText('');
  };

  const saveExternalNote = async (orderId) => {
    setSavingNote(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ external_notes: noteText.trim() || null })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, external_notes: noteText.trim() || null }
            : order
        )
      );

      setEditingNote(null);
      setNoteText('');
    } catch (err) {
      console.error('Error saving external note:', err);
      alert('Kon notitie niet opslaan: ' + err.message);
    } finally {
      setSavingNote(false);
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
                <th className="text-left px-6 py-4 font-medium text-gray-500">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nog geen bestellingen
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-mono font-medium">{order.order_number}</p>
                        <p className="text-xs text-gray-500 font-mono">{order.tracking_code}</p>
                        <p className="text-sm text-gray-500 mt-1">
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
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                            className="p-2 text-gray-500 hover:text-primary transition-colors"
                            title="Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openTrackingModal(order)}
                            className="p-2 text-gray-500 hover:text-primary transition-colors"
                            title="Tracking Info"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedOrder === order.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-bold mb-2">Producten</h4>
                              <div className="space-y-2">
                                {order.order_items?.map(item => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.product_name} × {item.quantity}</span>
                                    <span>€{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* External Notes - Visible to customer */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-primary">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold flex items-center gap-2">
                                  <MessageSquare className="w-5 h-5 text-primary" />
                                  Notitie voor klant
                                </h4>
                                {editingNote !== order.id && (
                                  <button
                                    onClick={() => startEditingNote(order)}
                                    className="text-sm text-primary hover:underline"
                                  >
                                    {order.external_notes ? 'Bewerken' : '+ Notitie toevoegen'}
                                  </button>
                                )}
                              </div>
                              
                              {editingNote === order.id ? (
                                <div className="space-y-3">
                                  <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none text-sm"
                                    placeholder="Voeg een notitie toe die zichtbaar is voor de klant (als ze een account hebben)..."
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => saveExternalNote(order.id)}
                                      disabled={savingNote}
                                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 text-sm"
                                    >
                                      {savingNote ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Opslaan...
                                        </>
                                      ) : (
                                        <>
                                          <Save className="w-4 h-4" />
                                          Opslaan
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={cancelEditingNote}
                                      disabled={savingNote}
                                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-70 text-sm"
                                    >
                                      Annuleren
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    💡 De klant krijgt een melding wanneer je een notitie toevoegt of wijzigt.
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  {order.external_notes ? (
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.external_notes}</p>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic">Nog geen notitie toegevoegd</p>
                                  )}
                                  {order.user_id ? (
                                    <p className="text-xs text-green-600 mt-2">✓ Klant heeft een account en zal notificaties ontvangen</p>
                                  ) : (
                                    <p className="text-xs text-orange-600 mt-2">⚠ Klant heeft geen account, notificaties worden niet verzonden</p>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Tracking Info */}
                            {order.carrier_name && (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-bold mb-2">Verzending</h4>
                                <p className="text-sm">Vervoerder: <strong>{order.carrier_name}</strong></p>
                                {order.carrier_tracking_url && (
                                  <a
                                    href={order.carrier_tracking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                                  >
                                    Volg bij vervoerder
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Tracking Info - {trackingModal.order_number}</h3>
              <button
                onClick={closeTrackingModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Tracking Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Huidige Tracking Code</p>
              <p className="font-mono font-bold text-lg">{trackingModal.tracking_code}</p>
              <p className="text-sm text-gray-500 mt-2">{trackingModal.tracking_link}</p>
            </div>

            <form onSubmit={handleTrackingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vervoerder (bijv. PostNL, DHL, DPD)
                </label>
                <input
                  type="text"
                  value={trackingForm.carrierName}
                  onChange={(e) => setTrackingForm({ ...trackingForm, carrierName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="PostNL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Track & Trace URL van vervoerder
                </label>
                <input
                  type="url"
                  value={trackingForm.carrierTrackingUrl}
                  onChange={(e) => setTrackingForm({ ...trackingForm, carrierTrackingUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="https://jouw.postnl.nl/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optioneel: Link naar de tracking pagina van de vervoerder
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extra notitie (optioneel)
                </label>
                <textarea
                  value={trackingForm.description}
                  onChange={(e) => setTrackingForm({ ...trackingForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  placeholder="Extra informatie voor de klant..."
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Let op:</strong> Door op "Opslaan" te klikken wordt:
                </p>
                <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                  <li>De order status ingesteld op "Verzonden"</li>
                  <li>De tracking informatie opgeslagen</li>
                  <li>De klant kan nu de order volgen via de tracking pagina</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeTrackingModal}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={updatingTracking}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {updatingTracking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Bezig...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      Opslaan
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagementTable;

