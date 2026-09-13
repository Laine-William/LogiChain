import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/MapScreen';
import TopBannerNotification from '../components/TopBannerNotification';
import { useOfflineStore } from '../store/offlineStore';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api/clientApi';
import { requestDatabase } from '../services/database/requestDatabase';
import { anomaly_severities, anomaly_status } from '../schemas/constants/constants';

const MapScreen = ({ route }) => {
    const { isOnline } = useOfflineStore();
    const [networkMessage, setNetworkMessage] = useState(null);
    const prevIsOnline = useRef(isOnline);

    const { user, role } = useAuthStore();
    const currentRole = role || user?.role;
    const isAdmin = currentRole === 'admin';

    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [usersList, setUsersList] = useState([]);

    const [selectedUserId, setSelectedUserId] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showZones, setShowZones] = useState(true);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    const [targetLocation, setTargetLocation] = useState({
        anomalyId: route?.params?.selectedAnomalyId,
        lat: route?.params?.lat,
        lng: route?.params?.lng
    });

    useEffect(() => {
        if (!prevIsOnline.current && isOnline) {
            setNetworkMessage('Réseau récupéré - Synchronisation possible');
            const timer = setTimeout(() => setNetworkMessage(null), 4000);
            return () => clearTimeout(timer);
        }
        prevIsOnline.current = isOnline;
    }, [isOnline]);

    useEffect(() => {
        if (route?.params?.lat && route?.params?.lng) {
            setTargetLocation({
                anomalyId: route?.params?.selectedAnomalyId,
                lat: route?.params?.lat,
                lng: route?.params?.lng
            });
        }
    }, [route?.params]);

    const cleanId = (id) => {
        if (!id) return null;
        if (typeof id === 'object') {
            return id.$oid || (typeof id.toString === 'function' ? id.toString() : String(id));
        }
        return String(id);
    };

    const loadMapData = async () => {
        try {
            setLoading(true);
            let activeEvents = [];
            let activeAnomalies = [];
            let activeUsers = [];

            if (isOnline) {
                try {
                    const [zonesRes, anomaliesRes, usersRes] = await Promise.all([
                        apiClient.get('/events').catch(() => ({ data: [] })),
                        apiClient.get('/anomalies').catch(() => ({ data: [] })),
                        apiClient.get('/users').catch(() => ({ data: [] }))
                    ]);

                    activeEvents = zonesRes.data || [];
                    activeAnomalies = anomaliesRes.data || [];
                    activeUsers = usersRes.data || [];

                    activeEvents.forEach(ev => requestDatabase.saveEventLocal(ev));
                    
                    setUsersList(activeUsers);
                    setAnomalies(activeAnomalies);
                } catch (apiError) {
                    console.warn("⚠️ Erreur API Map, bascule locale :", apiError.message);
                }
            }

            if (!isOnline || activeEvents.length === 0) {
                activeEvents = await requestDatabase.getEventsLocal();
            }

            setEvents(activeEvents);
        } catch (error) {
            console.warn("⚠️ Erreur lors du chargement des données de la carte :", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMapData();
    }, [isOnline, route?.params]);

    const handleResetFilters = () => {
        setSelectedUserId('all');
        setSelectedSeverity('all');
        setSelectedStatus('all');
        setUserSearchQuery('');
        setTargetLocation({ anomalyId: null, lat: null, lng: null });
    };

    const hasActiveFilters = selectedUserId !== 'all' || selectedSeverity !== 'all' || selectedStatus !== 'all' || userSearchQuery !== '' || targetLocation.lat !== null;

    // Filtrage dynamique : ne garde que les utilisateurs ayant des anomalies correspondant aux autres filtres[cite: 3]
    const activeUserIds = new Set(
        anomalies
            .filter(a => {
                const matchesSev = selectedSeverity !== 'all' ? a.severity === selectedSeverity : true;
                const matchesStat = selectedStatus !== 'all' ? a.status === selectedStatus : true;
                return matchesSev && matchesStat;
            })
            .map(a => cleanId(a.userId))
            .filter(Boolean)
    );

    const availableUsers = usersList.filter(u => activeUserIds.has(cleanId(u._id || u.id)));

    // Filtrage par texte de recherche
// Filtrage par texte de recherche (avec gestion robuste des noms de propriétés)
    const searchedUsers = availableUsers.filter(u => {
        const name = (u.fullName).toLowerCase();
        return name.includes(userSearchQuery.toLowerCase());
    });

    const filteredZones = showZones ? events : [];

    const filteredAnomalies = anomalies.filter(a => {
        const matchesUser = (isAdmin && selectedUserId !== 'all') ? cleanId(a.userId) === selectedUserId : true;
        const matchesSeverity = selectedSeverity !== 'all' ? a.severity === selectedSeverity : true;
        const matchesStatus = selectedStatus !== 'all' ? a.status === selectedStatus : true;
        return matchesUser && matchesSeverity && matchesStatus;
    });

    const generateLeafletHtml = () => {
      let centerLat = targetLocation.lat || 46.6033;
      let centerLng = targetLocation.lng || 1.8883;
      let defaultZoom = targetLocation.lat ? 16 : 6;

      const zonesScript = filteredZones.map(zoneItem => {
        const eventZones = zoneItem.zones || [];
          return eventZones.map(zItem => {
            const coords = zItem.zone?.coordinates;
            if (!coords || !coords[0]) return '';
            const latLngs = coords[0].map(pt => `[${pt[1]}, ${pt[0]}]`).join(',');
              return `
                L.polygon([${latLngs}], {color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.25, weight: 2}).addTo(map)
                .bindPopup("<div class='custom-popup'><div class='popup-title' style='color:#2563eb;'>📍 Périmètre</div><div class='popup-desc'>Zone Géographique</div></div>");
              `;
            }).join('\n');
        }).join('\n');

        let targetMarkerVarName = null;

        const anomaliesScript = filteredAnomalies.map((anomaly, idx) => {
          const coords = anomaly.location?.coordinates;
          if (!coords || coords.length < 2) return '';
          const lng = coords[0];
          const lat = coords[1];
          const anomalyId = anomaly._id?.$oid || anomaly._id;
          const isTarget = targetLocation.anomalyId && String(targetLocation.anomalyId) === String(anomalyId);

          const severity = anomaly.severity;
          const severityColors = {
              critical: '#7e22ce',
              high: '#dc2626',
              medium: '#eab308',
              low: '#16a34a'
          };
          
          const color = severityColors[severity] || '#16a34a';
          const isLargeRadius = (severity === 'critical' || severity === 'high');
          
          const title = (anomaly.reason || 'Anomalie').replace(/['"]/g, '');
          const desc = (anomaly.description || 'Aucune description disponible.').replace(/['"]/g, '');
          
          const scriptCode = `
            var marker_${idx} = L.circleMarker([${lat}, ${lng}], {
              radius: ${isTarget ? 16 : (isLargeRadius ? 12 : 9)},
              fillColor: '${color}',
              color: '${isTarget ? '#000000' : '#fff'}',
              weight: ${isTarget ? 3 : 2},
              opacity: 1,
              fillOpacity: 0.9
            }).bindPopup(
              "<div class='custom-popup'>" +
              "<div class='popup-title' style='color:${color}'>⚠️ ${title}</div>" +
              "<div class='popup-desc'>${desc}</div>" +
              "</div>"
            );
            markers.addLayer(marker_${idx});
          `;

          if (isTarget) {
            targetMarkerVarName = `marker_${idx}`;
          }

          return scriptCode;
        }).join('\n');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
                <style>
                    body, html { margin: 0; padding: 0; height: 100%; width: 100%; background-color: #f8f9fa; }
                    #map { height: 100%; width: 100%; }
                    .leaflet-control-zoom {
                        margin-right: 15px !important;
                        margin-bottom: 25px !important;
                        border: none !important;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                        border-radius: 8px !important;
                        overflow: hidden;
                    }
                    .leaflet-control-zoom a {
                        background-color: #ffffff !important;
                        color: #0f172a !important;
                        width: 36px !important;
                        height: 36px !important;
                        line-height: 36px !important;
                        font-size: 16px !important;
                        font-weight: bold !important;
                    }
                    .leaflet-control-zoom a:hover {
                        background-color: #f1f5f9 !important;
                    }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    var map = L.map('map', { zoomControl: true }).setView([${centerLat}, ${centerLng}], ${defaultZoom});
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                    
                    map.zoomControl.setPosition('bottomright');

                    var markers = L.markerClusterGroup();
                    ${zonesScript}
                    ${anomaliesScript}
                    map.addLayer(markers);
                </script>
            </body>
            </html>
        `;
    };

    return (
      <View style={styles.container}>
          <TopBannerNotification isOnline={isOnline} message={networkMessage} />

          <View style={styles.headerRow}>
              <View>
                  <Text style={styles.subtitle}>{filteredAnomalies.length} signalement(s) affiché(s)</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {isAdmin && hasActiveFilters && (
                      <TouchableOpacity onPress={handleResetFilters} style={{ backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                          <Ionicons name="close-circle" size={14} color="#dc2626" style={{ marginRight: 4 }} />
                          <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#dc2626' }}>Réinitialiser</Text>
                      </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={loadMapData} style={styles.refreshButton}>
                      <Ionicons name="refresh" size={14} color="#0284c7" />
                  </TouchableOpacity>
              </View>
          </View>

          {/* LIGNE 1 : Filtre Statuts */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
              <TouchableOpacity
                  style={[styles.filterChip, selectedStatus === 'all' && styles.filterChipActive]}
                  onPress={() => setSelectedStatus('all')}
              >
                  <Text style={[styles.filterText, selectedStatus === 'all' && styles.filterTextActive]}>Tous</Text>
              </TouchableOpacity>
              {anomaly_status.map(st => {
                  const isSelected = selectedStatus === st;
                  const labels = { open: 'A lancer', pending: 'En attente', in_progress: 'En cours', resolved: 'Résolu', closed: 'Fermé', archived: 'Archivé' };
                  return (
                      <TouchableOpacity
                          key={st}
                          style={[styles.filterChip, isSelected && styles.filterChipActive]}
                          onPress={() => setSelectedStatus(st)}
                      >
                          <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>{labels[st] || st}</Text>
                      </TouchableOpacity>
                  );
              })}
          </ScrollView>

          {/* LIGNE 2 : Filtre Sévérités */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
              <TouchableOpacity
                  style={[styles.filterChip, selectedSeverity === 'all' && styles.filterChipActive]}
                  onPress={() => setSelectedSeverity('all')}
              >
                  <Text style={[styles.filterText, selectedSeverity === 'all' && styles.filterTextActive]}>Toutes</Text>
              </TouchableOpacity>
              {anomaly_severities.map(sev => {
                  const isSelected = selectedSeverity === sev;
                  const labels = { critical: 'Critique', high: 'Haute', medium: 'Moyenne', low: 'Faible' };
                  return (
                      <TouchableOpacity
                          key={sev}
                          style={[styles.filterChip, isSelected && styles.filterChipActive]}
                          onPress={() => setSelectedSeverity(sev)}
                      >
                          <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>{labels[sev] || sev}</Text>
                      </TouchableOpacity>
                  );
              })}
          </ScrollView>

          {/* SECTION UTILISATEURS : Liste verticale avec barre de recherche (Admin uniquement) */}
          {isAdmin && (
              <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0', maxHeight: 150 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 8, marginBottom: 6, height: 34 }}>
                      <Ionicons name="search" size={14} color="#64748b" style={{ marginRight: 6 }} />
                      <TextInput
                          style={{ flex: 1, fontSize: 12, color: '#0f172a', padding: 0 }}
                          placeholder="Rechercher un utilisateur..."
                          placeholderTextColor="#94a3b8"
                          value={userSearchQuery}
                          onChangeText={setUserSearchQuery}
                      />
                      {userSearchQuery !== '' && (
                          <TouchableOpacity onPress={() => setUserSearchQuery('')}>
                              <Ionicons name="close-circle" size={14} color="#64748b" />
                          </TouchableOpacity>
                      )}
                  </View>

                  <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 90 }}>
                      <TouchableOpacity
                          style={{ paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, backgroundColor: selectedUserId === 'all' ? '#0284c7' : 'transparent' }}
                          onPress={() => setSelectedUserId('all')}
                      >
                          <Text style={{ fontSize: 12, fontWeight: '600', color: selectedUserId === 'all' ? '#fff' : '#475569' }}>
                              Tous les utilisateurs ({availableUsers.length})
                          </Text>
                      </TouchableOpacity>

                      {searchedUsers.map(u => {
                          const uId = cleanId(u._id || u.id);
                          const isSelected = selectedUserId === uId;
                          const userDisplayName = u.fullName;
                          return (
                              <TouchableOpacity
                                  key={uId}
                                  style={{ 
                                      paddingVertical: 8, 
                                      paddingHorizontal: 12, 
                                      borderRadius: 6, 
                                      backgroundColor: isSelected ? '#0284c7' : '#f8fafc', 
                                      marginVertical: 2,
                                      borderWidth: 1,
                                      borderColor: '#e2e8f0'
                                  }}
                                  onPress={() => setSelectedUserId(uId)}
                              >
                                  <Text style={{ fontSize: 13, fontWeight: '600', color: isSelected ? '#ffffff' : '#0f172a' }}>
                                      {userDisplayName}
                                  </Text>
                              </TouchableOpacity>
                          );
                      })}
                  </ScrollView>
              </View>
          )}

          {/* LÉGENDE DES COULEURS & BOUTON ZONES */}
          <View style={[styles.legendContainer, { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#7e22ce' }]} />
                      <Text style={styles.legendText}>Critique</Text>
                  </View>
                  <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
                      <Text style={styles.legendText}>Haute</Text>
                  </View>
                  <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
                      <Text style={styles.legendText}>Moyenne</Text>
                  </View>
                  <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#16a34a' }]} />
                      <Text style={styles.legendText}>Faible</Text>
                  </View>
              </View>

              <TouchableOpacity 
                  style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: showZones ? '#e0f2fe' : '#f1f5f9', borderWidth: 1, borderColor: showZones ? '#0284c7' : '#cbd5e1' }}
                  onPress={() => setShowZones(!showZones)}
              >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: showZones ? '#0369a1' : '#475569' }}>
                      {showZones ? '📍 Zones ON' : '📍 Zones OFF'}
                  </Text>
              </TouchableOpacity>
          </View>

          {/* CONTENEUR CARTE WEBVIEW */}
          <View style={styles.mapCardContainer}>
              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0284c7" />
                  <Text style={styles.loaderText}>Chargement de la carte...</Text>
                </View>
              ) : (
                <WebView
                  key={`${targetLocation.lat}-${targetLocation.lng}-${showZones}-${selectedUserId}-${selectedSeverity}-${selectedStatus}`} 
                  originWhitelist={['*']}
                  source={{ html: generateLeafletHtml() }}
                  style={{ flex: 1, backgroundColor: 'transparent' }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              )}
          </View>
      </View>
    );
};

export default MapScreen;