import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/DashboardScreen';
import ModalAlert from '../components/modal/ModalAlert';
import ModalConfirm from '../components/modal/ModalConfirm';
import ModalEventZone from '../components/modal/ModalEventZone';
import TopBannerNotification from '../components/TopBannerNotification';
import { useAuthStore } from '../store/authStore';
import { useOfflineStore } from '../store/offlineStore';
import apiClient from '../services/api/clientApi';
import { requestDatabase } from '../services/database/requestDatabase';

const DashboardScreen = ({ navigation }) => {
  const { user, role } = useAuthStore();
  const currentRole = role || user?.role;
  const isAdmin = currentRole === 'admin';

  const { isOnline } = useOfflineStore();
  const [networkMessage, setNetworkMessage] = useState(null);
  const prevIsOnline = useRef(isOnline);

  const [events, setEvents] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [isZoneModalVisible, setIsZoneModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ visible: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    if (!prevIsOnline.current && isOnline) {
      setNetworkMessage('Réseau rétablit - Synchronisation en cours');
      const timer = setTimeout(() => setNetworkMessage(null), 4000);
      return () => clearTimeout(timer);
    }
    prevIsOnline.current = isOnline;
  }, [isOnline]);

  const loadData = async () => {
    try {
      setRefreshing(true);
      let activeEvents = [];
      let activeLogistics = [];
      let activeUsers = [];

      if (isOnline) {
        try {
          const [eventsRes, logisticsRes, usersRes] = await Promise.all([
            apiClient.get('/events').catch(() => ({ data: [] })),
            apiClient.get('/logistics').catch(() => ({ data: [] })),
            apiClient.get('/users').catch(() => ({ data: [] }))
          ]);

          activeEvents = eventsRes.data || [];
          activeLogistics = logisticsRes.data || [];
          activeUsers = usersRes.data || [];

          activeEvents.forEach(ev => requestDatabase.saveEventLocal(ev));
          activeLogistics.forEach(log => requestDatabase.saveLogisticLocal(log));

          setEvents(activeEvents);
          setUsersList(activeUsers);
        } catch (apiError) {
          console.warn("⚠️ Erreur API, bascule locale :", apiError.message);
        }
      }

      if (!isOnline || activeEvents.length === 0) {
        activeEvents = await requestDatabase.getEventsLocal();
        activeLogistics = await requestDatabase.getLogisticsLocal();
        setEvents(activeEvents);
      }

      const formattedLogistics = activeLogistics.map(logistic => {
        const rawUser = logistic.userId;
        const userArray = Array.isArray(rawUser) ? rawUser : (rawUser ? [rawUser] : []);
        return {
          ...logistic,
          id: typeof logistic._id === 'object' ? logistic._id?.$oid : (logistic._id || logistic.id),
          eventId: typeof logistic.eventId === 'object' ? logistic.eventId?.$oid : (logistic.eventId || logistic.eventIdString),
          userId: userArray,
          departure: logistic.departureDestination || logistic.departure,
          arrival: logistic.arrivalDestination || logistic.arrival,
        };
      });

      const currentUserId = user?.id || user?._id;
      const assignedLogistics = isAdmin 
        ? formattedLogistics 
        : formattedLogistics.filter(logistic => {
            const ids = logistic.userId || [];
            return ids.some(id => String(id).trim() === String(currentUserId).trim());
          });

      setLogistics(assignedLogistics);
    } catch (error) {
      console.error("❌ Erreur de chargement", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isOnline, user]);

  const toggleExpand = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const cleanId = (id) => {
    if (!id) return '';
    if (typeof id === 'object') return id.$oid || String(id);
    return String(id);
  };

  const handleSaveEventFull = async (formData) => {
    if (!formData.name || !formData.name.trim()) {
      setAlertConfig({ visible: true, title: 'Champs requis', message: 'Le nom de l\'événement est obligatoire.', type: 'error' });
      return;
    }

    setIsSavingEvent(true);
    try {
      const zoneObject = {
        status: formData.zone.status || 'active',
        zone: {
          type: 'Polygon',
          coordinates: formData.zone.zone.coordinates
        }
      };

      const eventPayload = { 
        name: formData.name, 
        description: editingEvent?.event?.description || 'Événement global de gestion logistique',
        location: `${formData.departure} vers ${formData.arrival}`,
        zones: [zoneObject],
        status: 'active'
      };

      let eventId = editingEvent?.event ? cleanId(editingEvent.event._id || editingEvent.event.id) : null;

      if (eventId) {
        await apiClient.put(`/events/${eventId}`, eventPayload);
      } else {
        const eventRes = await apiClient.post('/events', eventPayload);
        eventId = eventRes.data?._id || eventRes.data?.id || eventRes.data?._id?.$oid;
      }

      if (eventId) {
        const logisticPayload = {
          eventId: eventId,
          departureDestination: formData.departure,
          departurePosition: formData.departurePosition ? { type: 'Point', coordinates: [formData.departurePosition.longitude, formData.departurePosition.latitude] } : undefined,
          arrivalDestination: formData.arrival,
          arrivalPosition: formData.arrivalPosition ? { type: 'Point', coordinates: [formData.arrivalPosition.longitude, formData.arrivalPosition.latitude] } : undefined,
          userId: formData.users,
          steps: formData.steps,
          status: 'starting'
        };

        if (editingEvent?.logistic) {
          const logisticId = cleanId(editingEvent.logistic._id || editingEvent.logistic.id);
          await apiClient.put(`/logistics/${logisticId}`, logisticPayload);
        } else {
          await apiClient.post('/logistics', logisticPayload);
        }
      }

      setIsZoneModalVisible(false);
      setEditingEvent(null);
      setAlertConfig({ visible: true, title: 'Succès', message: 'Événement et flux enregistrés avec succès !', type: 'success' });
      loadData();
    } catch (error) {
      setAlertConfig({ visible: true, title: 'Erreur', message: error.response?.data?.message || 'Échec de l\'enregistrement global.', type: 'error' });
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleOpenEditEventModal = (event) => {
    const eventId = cleanId(event._id || event.id);
    const associatedLogistic = logistics.find(l => cleanId(l.eventId) === eventId);

    setEditingEvent({
      event: event,
      logistic: associatedLogistic || null
    });

    setIsZoneModalVisible(true);
  };

  const handleDeleteLogistic = (logisticId) => {
    setConfirmModal({
      visible: true,
      title: 'Supprimer le flux ?',
      message: 'Cette action est irréversible.',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, visible: false }));
        try {
          await apiClient.delete(`/logistics/${logisticId}`);
          setAlertConfig({ visible: true, title: 'Supprimé', message: 'Le flux a été supprimé.', type: 'success' });
          loadData();
        } catch (error) {
          setAlertConfig({ visible: true, title: 'Erreur', message: 'Impossible de supprimer le flux.', type: 'error' });
        }
      }
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'starting': return '#17a2b8';
      case 'in_preparation': return '#ffc107';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'in_transit': return '#007bff';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'starting': 'Démarrage',
      'in_preparation': 'En préparation',
      'completed': 'Terminé',
      'cancelled': 'Annulé',
      'in_transit': 'En transit',
      'archived': 'Archivé',
      'closed': 'Fermé'
    };
    return labels[status] || status || 'En cours';
  };

  // Filtrage conditionnel des événements (masque 'closed' et 'archived' uniquement pour les non-admins)
  const filteredEvents = events.filter((event) => {
    if (isAdmin) return true;
    const rawStatus = event.status || event.state || 'active';
    const eventStatus = (typeof rawStatus === 'string' ? rawStatus : rawStatus.$oid || String(rawStatus)).toLowerCase();
    return eventStatus !== 'closed' && eventStatus !== 'archived';
  });

  return (
    <View style={styles.container}>
      <TopBannerNotification isOnline={isOnline} message={networkMessage} />

      {/* Actions Rapides Fixes (Hors ScrollView) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={[styles.actionItem, { width: '22%' }]} onPress={() => navigation.navigate('ScanTab')}>
            <View style={[styles.actionCircle, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="qr-code-outline" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.actionText} numberOfLines={1}>Scanner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, { width: '22%' }]} onPress={() => navigation.navigate('AnomalyTab')}>
            <View style={[styles.actionCircle, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="warning-outline" size={24} color="#ef4444" />
            </View>
            <Text style={styles.actionText} numberOfLines={1}>Anomalie</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, { width: '22%' }]} onPress={() => navigation.navigate('MapTab')}>
            <View style={[styles.actionCircle, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="map-outline" size={24} color="#22c55e" />
            </View>
            <Text style={styles.actionText} numberOfLines={1}>Carte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, { width: '22%' }]} onPress={() => navigation.navigate('SyncTab')}>
            <View style={[styles.actionCircle, { backgroundColor: '#f5f3ff' }]}>
              <Ionicons name="sync-outline" size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.actionText} numberOfLines={1}>Synchro</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section Gestion des Événements avec son propre ScrollView dédié */}
      <View style={[styles.section, { flex: 1 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Gestion des Événements</Text>
          
          {isAdmin && (
            <TouchableOpacity 
              style={{ backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                setEditingEvent(null);
                setIsZoneModalVisible(true);
              }}
            >
              <Ionicons name="add" size={16} color="#fff" style={{ marginRight: 4 }} />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Nouvel Événement</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} colors={['#0056b3']} />}
        >
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Aucun événement disponible.</Text>
            </View>
          ) : (
            filteredEvents.map((event) => {
              const eventId = cleanId(event._id || event.id);
              const isExpanded = expandedEventId === eventId;
              
              // Filtrage conditionnel des flux : masque 'archived' et 'closed' uniquement pour les non-admins
              const eventLogistics = logistics.filter(l => {
                const isCorrectEvent = cleanId(l.eventId) === eventId;
                if (isAdmin) return isCorrectEvent;
                const status = (l.status || '').toLowerCase();
                const isNotArchivedOrClosed = status !== 'archived' && status !== 'closed';
                return isCorrectEvent && isNotArchivedOrClosed;
              });

              return (
                <View key={eventId} style={styles.eventCardContainer}>
                  <TouchableOpacity 
                    style={styles.eventHeaderTouchable}
                    activeOpacity={0.8}
                    onPress={() => toggleExpand(eventId)}
                  >
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Ionicons name="calendar" size={16} color="#0284c7" style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1e293b' }}>{event.name}</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: '#64748b' }} numberOfLines={1}>{event.description || 'Aucune description'}</Text>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <View style={{ backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 8 }}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: '#0369a1' }}>{eventLogistics.length} flux assigné(s)</Text>
                        </View>
                        {event.location ? (
                          <Text style={{ fontSize: 11, color: '#64748b' }}>📍 {event.location}</Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {isAdmin && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <TouchableOpacity 
                            style={styles.actionIconBtn}
                            onPress={(e) => { e.stopPropagation(); handleOpenEditEventModal(event); }}
                          >
                            <Ionicons name="create-outline" size={16} color="#0284c7" />
                          </TouchableOpacity>
                        </View>
                      )}
                      <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#64748b" style={{ marginLeft: 8 }} />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.eventSubContent}>
                      {eventLogistics.length === 0 ? (
                        <View style={{ padding: 16, alignItems: 'center' }}>
                          <Text style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Aucun flux logistique pour cet événement.</Text>
                        </View>
                      ) : (
                        eventLogistics.map((logistic) => {
                          const logisticId = cleanId(logistic.id || logistic._id);
                          const departureText = logistic.departure || 'Départ';
                          const arrivalText = logistic.arrival || 'Arrivée';
                          const distanceValue = logistic.distance || logistic.totalDistance;

                          return (
                            <View key={logisticId} style={styles.logisticCard}>
                              <TouchableOpacity 
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('LogisticDetail', { logisticData: logistic })}
                              >
                                <View style={styles.cardHeader}>
                                  {/* Badge de statut stylisé pour le flux */}
                                  <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(logistic.status), paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }]}>
                                    <Text style={[styles.statusText, { color: '#ffffff', fontWeight: 'bold', fontSize: 11 }]}>
                                      {getStatusLabel(logistic.status)}
                                    </Text>
                                  </View>
                                  
                                  {isAdmin && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                      <TouchableOpacity 
                                        style={styles.actionIconBtnDanger}
                                        onPress={(e) => { e.stopPropagation(); handleDeleteLogistic(logisticId); }}
                                      >
                                        <Ionicons name="trash-outline" size={14} color="#dc2626" />
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </View>

                                <View style={styles.routeContainer}>
                                  <View style={styles.routePoint}>
                                    <Ionicons name="location" size={18} color="#3b82f6" />
                                    <Text style={styles.routeCity} numberOfLines={1}>{departureText}</Text>
                                  </View>
                                  <View style={styles.routeConnector}>
                                    <View style={styles.routeLine} />
                                    <Ionicons name="chevron-forward" size={14} color="#cbd5e1" />
                                  </View>
                                  <View style={styles.routePoint}>
                                    <Ionicons name="flag" size={18} color="#22c55e" />
                                    <Text style={styles.routeCity} numberOfLines={1}>{arrivalText}</Text>
                                  </View>
                                </View>

                                {distanceValue ? (
                                  <View style={styles.cardFooter}>
                                    <Ionicons name="speedometer-outline" size={14} color="#64748b" style={{ marginRight: 6 }} />
                                    <Text style={styles.detailText}>Distance : <Text style={{fontWeight: 'bold', color: '#334155'}}>{distanceValue} km</Text></Text>
                                  </View>
                                ) : null}
                              </TouchableOpacity>
                            </View>
                          );
                        })
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      <ModalEventZone 
          visible={isZoneModalVisible}
          onClose={() => {
            setIsZoneModalVisible(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEventFull}
          initialData={editingEvent ? {
            name: editingEvent.event.name,
            departure: editingEvent.logistic?.departure,
            arrival: editingEvent.logistic?.arrival,
            departurePosition: editingEvent.logistic?.departurePosition,
            arrivalPosition: editingEvent.logistic?.arrivalPosition,
            users: editingEvent.logistic?.userId,
            steps: editingEvent.logistic?.steps,
            zonePosition: editingEvent.event.zones?.[0]?.zone?.coordinates
          } : null}
      />

      <ModalAlert visible={alertConfig.visible} title={alertConfig.title} message={alertConfig.message} type={alertConfig.type} onClose={() => setAlertConfig({ ...alertConfig, visible: false })} />
      <ModalConfirm visible={confirmModal.visible} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))} />
    </View>
  );
};

export default DashboardScreen;