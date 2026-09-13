import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/anomalies/AnomalyScreen';
import ModalAlert from '../components/ModalAlert';
import TopBannerNotification from '../components/TopBannerNotification';
import { useOfflineStore } from '../store/offlineStore';
import apiClient from '../services/api/clientApi';
import { requestDatabase } from '../services/database/requestDatabase';
import { getDatabaseInstance } from '../services/database/localStorageDatabase';

const AnomalyScreen = () => {
  const navigation = useNavigation();
  const { isOnline } = useOfflineStore();
  const [networkMessage, setNetworkMessage] = useState(null);
  const prevIsOnline = useRef(isOnline);

  const [anomalies, setAnomalies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success' });

  useEffect(() => {
    if (!prevIsOnline.current && isOnline) {
      setNetworkMessage('Réseau récupéré - Synchronisation en cours');
      const timer = setTimeout(() => setNetworkMessage(null), 4000);
      return () => clearTimeout(timer);
    }
    prevIsOnline.current = isOnline;
  }, [isOnline]);

  const loadAnomalies = async () => {
    try {
      setRefreshing(true);
      let dataList = [];

      if (isOnline) {
        try {
          const response = await apiClient.get('/anomalies');
          if (response.data) {
            dataList = response.data;
            dataList.forEach(anomaly => {
              if (requestDatabase.saveAnomalyLocal) {
                requestDatabase.saveAnomalyLocal(anomaly, 'synced');
              }
            });
          }
        } catch (apiError) {
          console.warn("⚠️ Erreur API anomalies, bascule locale :", apiError.message);
        }
      }

      // 🟢 CORRECTION : Lecture propre et directe de la base SQLite locale sans code polluant
      if (!isOnline || dataList.length === 0) {
        const db = await getDatabaseInstance();
        const localRows = await db.getAllAsync(`SELECT * FROM anomalies WHERE isDeleted = 0;`);

        dataList = localRows.map(row => ({
          ...row,
          location: row.location ? (typeof row.location === 'string' ? JSON.parse(row.location) : row.location) : null
        }));
      }

      setAnomalies(dataList);
    } catch (error) {
      console.warn("⚠️ Erreur lors du chargement des anomalies :", error.message);
      setAlert({
        visible: true,
        title: 'Erreur',
        message: "Impossible de récupérer la liste des anomalies.",
        type: 'error',
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnomalies();
  }, [isOnline]);

  const getSeverityDetails = (severity) => {
    const s = (severity || 'low').toLowerCase();
    switch (s) {
      case 'critical':
      case 'high':
        return { bg: '#fee2e2', color: '#dc2626', label: 'Critique', icon: 'alert-circle' };
      case 'medium':
        return { bg: '#fef3c7', color: '#d97706', label: 'Moyenne', icon: 'warning-outline' };
      default:
        return { bg: '#e0f2fe', color: '#0369a1', label: 'Faible', icon: 'information-circle-outline' };
    }
  };

  const getStatusDetails = (status) => {
    const st = (status || 'open').toLowerCase();
    switch (st) {
      case 'active':
      case 'open':
        return { bg: '#fee2e2', color: '#dc2626', label: 'Ouvert' };
      case 'in_progress':
        return { bg: '#fef3c7', color: '#d97706', label: 'En cours' };
      case 'resolved':
      case 'completed':
        return { bg: '#dcfce7', color: '#16a34a', label: 'Résolu' };
      case 'closed':
      case 'archived':
        return { bg: '#f1f5f9', color: '#4b5563', label: 'Fermé' };
      default:
        return { bg: '#f8fafc', color: '#94a3b8', label: status };
    }
  };

  const handleOpenOnMap = (anomaly) => {
    const coords = anomaly.location?.coordinates;
    if (!coords || coords.length < 2) {
      setAlert({
        visible: true,
        title: 'Coordonnées indisponibles',
        message: "Cette anomalie ne possède pas de géolocalisation valide.",
        type: 'warning'
      });
      return;
    }

    navigation.navigate('MapTab', {
      selectedAnomalyId: anomaly._id?.$oid || anomaly.id || anomaly._id,
      lat: coords[1],
      lng: coords[0]
    });
  };

  return (
    <View style={styles.container}>
      <TopBannerNotification isOnline={isOnline} message={networkMessage} />
      
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.subtitle}>{anomalies.length} signalement(s)</Text>
        </View>
        <TouchableOpacity onPress={loadAnomalies} style={styles.refreshButton}>
          <Ionicons name="refresh" size={14} color="#0284c7" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadAnomalies} colors={['#0284c7']} />}
      >
        {anomalies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={56} color="#cbd5e1" />
            <Text style={styles.emptyText}>Aucune anomalie signalée.</Text>
          </View>
        ) : (
          anomalies.map((anomaly, index) => {
            const severityInfo = getSeverityDetails(anomaly.severity);
            const statusInfo = getStatusDetails(anomaly.status);
            const coords = anomaly.location?.coordinates;
            const hasGps = coords && coords.length >= 2;

            return (
              <View key={anomaly._id?.$oid || anomaly.id || index} style={styles.card}>
                
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.badge, { backgroundColor: severityInfo.bg }]}>
                    <Ionicons name={severityInfo.icon} size={14} color={severityInfo.color} style={{ marginRight: 4 }} />
                    <Text style={[styles.badgeText, { color: severityInfo.color }]}>{severityInfo.label}</Text>
                  </View>

                  <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.badgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>
                  {anomaly.reason || 'Incident terrain'}
                </Text>

                <Text style={styles.cardDescription} numberOfLines={2}>
                  {anomaly.description || 'Aucune description fournie.'}
                </Text>

                <View style={styles.cardFooterRow}>
                  <Text style={styles.dateText}>
                    {anomaly.createdAt ? new Date(anomaly.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--/--/----'}
                  </Text>

                  {hasGps && (
                    <TouchableOpacity 
                      style={styles.mapIconButton}
                      onPress={() => handleOpenOnMap(anomaly)}
                    >
                      <Ionicons name="map" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                      <Text style={styles.mapButtonText}>Voir sur la carte</Text>
                    </TouchableOpacity>
                  )}
                </View>

              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AnomalyFormScreen')}
      >
        <Ionicons name="warning" size={26} color="#ffffff" />
      </TouchableOpacity>

      <ModalAlert 
        visible={alert.visible} 
        title={alert.title} 
        message={alert.message} 
        type={alert.type} 
        onClose={() => setAlert({ ...alert, visible: false })} 
      />
    </View>
  );
};

export default AnomalyScreen;