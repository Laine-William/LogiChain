import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/logistics/LogisticHistoryScreen';
import { useOfflineStore } from '../../store/offlineStore';
import apiClient from '../../services/api/clientApi';

// Import de vos fonctions utilitaires
import { 
    cleanId, 
    formatDate, 
    calculateCO2, 
    getVehicleIcon, 
    getDerivedGlobalHistory, 
    getStatusDetails, 
    getMixedTimeline 
} from './LogisticHelpers';

const LogisticHistoryScreen = ({ route }) => {
    const { logisticData: initialLogistic, anomalyData: initialAnomaly, eventData: initialEvent, logisticId: paramLogisticId } = route.params || {};
    const { isOnline } = useOfflineStore();

    const initialData = initialLogistic || initialAnomaly || initialEvent || {};
    const [logisticData, setLogisticData] = useState(initialData);
    const [anomaliesMap, setAnomaliesMap] = useState({});
    const [refreshing, setRefreshing] = useState(false);

    const rawLogisticId = logisticData?.id || logisticData?._id || paramLogisticId;
    const logisticId = cleanId(rawLogisticId) || cleanId(initialAnomaly?._id) || 'Inconnu';

    const loadHistoryDetails = async () => {
        if (!isOnline || logisticId === 'Inconnu') return;

        try {
            setRefreshing(true);
            const response = await apiClient.get(`/logistics/${logisticId}`);
            if (response.data) {
                setLogisticData(response.data);
            }

            try {
                const anomaliesResponse = await apiClient.get(`/anomalies?logisticId=${logisticId}`);
                if (anomaliesResponse.data) {
                    const map = {};
                    anomaliesResponse.data.forEach(anomaly => {
                        const sId = cleanId(anomaly.stepId);
                        if (sId) {
                            if (!map[sId]) map[sId] = [];
                            map[sId].push(anomaly);
                        }
                    });
                    setAnomaliesMap(map);
                }
            } catch (err) {
                console.warn("⚠️ Impossible de charger les anomalies :", err.message);
            }
        } catch (error) {
            console.warn("⚠️ Erreur lors du rafraîchissement de l'historique :", error.message);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadHistoryDetails();
    }, [logisticId]);
    
    const steps = logisticData?.steps || [];
    const globalHistory = getDerivedGlobalHistory(logisticData, steps);

    return (
        <View style={[styles.container, { flex: 1 }]}>
            
            {/* EN-TÊTE FIXE (Hors Scroll) */}
            <View style={styles.headerRow}>
                <Text style={styles.subtitle}>Route #{String(logisticId).slice(-8).toUpperCase()}</Text>
                <TouchableOpacity onPress={loadHistoryDetails} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={18} color="#0284c7" />
                </TouchableOpacity>
            </View>

            {/* SECTION GLOBALE (Fixe) */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                    <Ionicons name="git-commit-outline" size={18} color="#3b82f6" /> Évolution du Flux Global
                </Text>

                {globalHistory.length === 0 ? (
                    <Text style={styles.emptyText}>Aucun historique global enregistré.</Text>
                ) : (
                    <View style={styles.timelineContainer}>
                        {globalHistory.map((h, index) => {
                            const details = getStatusDetails(h.status);
                            const dateStr = formatDate(h.changedAt, 'Date récente');
                            const isLast = index === globalHistory.length - 1;

                            return (
                                <View key={index} style={styles.timelineItem}>
                                    <View style={styles.timelineIndicator}>
                                        <Ionicons name={details.icon} size={20} color={details.color} />
                                        {!isLast && <View style={styles.timelineLine} />}
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={[styles.statusBadgeText, { color: details.color }]}>{details.label}</Text>
                                        <Text style={styles.dateText}>{dateStr}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>

            {/* ZONE UNIQUE DE SCROLL UNIQUEMENT AUTOUR DES ÉTAPES */}
            <View style={[styles.sectionCard, { flex: 1 }]}>
                <Text style={styles.sectionTitle}>
                    <Ionicons name="layers-outline" size={18} color="#22c55e" /> Étapes & Traçabilité
                </Text>
                
                <ScrollView 
                    style={{ flex: 1 }} 
                    showsVerticalScrollIndicator={true}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={loadHistoryDetails} colors={['#0056b3']} />
                    }
                >
                    {steps.length === 0 ? (
                        <Text style={styles.emptyText}>Aucune étape trouvée.</Text>
                    ) : (
                        steps.map((step, stepIndex) => {
                            const mixedTimeline = getMixedTimeline(step);
                            const co2 = calculateCO2(step);

                            return (
                                <View key={cleanId(step._id) || stepIndex} style={styles.stepBlock}>
                                    <View style={styles.stepBlockHeader}>
                                        <View style={styles.rowAlignCenter}>
                                            <Ionicons name={getVehicleIcon(step.vehicle)} size={18} color="#0284c7" style={styles.iconRightMargin} />
                                            <Text style={styles.stepBlockTitle}>Étape {stepIndex + 1} : {step.location}</Text>
                                        </View>
                                        <View style={styles.alignEnd}>
                                            <Text style={styles.stepDistance}>{step.distance} km</Text>
                                            <Text style={styles.stepCo2}>{co2} kg CO₂</Text>
                                        </View>
                                    </View>

                                    {mixedTimeline.length === 0 ? (
                                        <Text style={styles.emptySubText}>Aucun historique ni anomalie enregistrée.</Text>
                                    ) : (
                                        <View style={styles.timelineContainer}>
                                            {mixedTimeline.map((item, hIndex) => {
                                                const isLast = hIndex === mixedTimeline.length - 1;
                                                const dateStr = formatDate(item.date, 'Date inconnue');

                                                if (item.type === 'status') {
                                                    const details = getStatusDetails(item.status);
                                                    return (
                                                        <View key={`status-${hIndex}`} style={styles.timelineItem}>
                                                            <View style={styles.timelineIndicator}>
                                                                <Ionicons name={details.icon} size={16} color={details.color} />
                                                                {!isLast && <View style={styles.timelineLine} />}
                                                            </View>
                                                            <View style={styles.timelineContent}>
                                                                <Text style={[styles.statusBadgeText, { color: details.color, fontSize: 13 }]}>{details.label}</Text>
                                                                <Text style={styles.dateText}>{dateStr}</Text>
                                                            </View>
                                                        </View>
                                                    );
                                                }

                                                const anomalyDetails = getStatusDetails(item.status);
                                                const lng = item.coordinates?.[0];
                                                const lat = item.coordinates?.[1];
                                                const coordsText = (typeof lat === 'number' && typeof lng === 'number') 
                                                    ? `GPS: [${lat.toFixed(4)}, ${lng.toFixed(4)}]` 
                                                    : null;
                                                
                                                const warningColor = item.severity === 'critical' || item.severity === 'high' ? '#dc2626' : '#d97706';

                                                return (
                                                    <View key={`anomaly-${hIndex}`} style={[styles.timelineItem, styles.anomalieTimelineCard]}>
                                                        <View style={styles.timelineIndicator}>
                                                            <Ionicons name="warning" size={16} color={warningColor} />
                                                            {!isLast && <View style={styles.timelineLine} />}
                                                        </View>
                                                        <View style={styles.timelineContent}>
                                                            <View style={styles.anomalieCardHeaderRow}>
                                                                <Text style={styles.anomalieTitleText}>{item.title}</Text>
                                                                <Text style={[styles.anomalieStatusText, { color: anomalyDetails.color }]}>
                                                                    {anomalyDetails.label}
                                                                </Text>
                                                            </View>

                                                            {item.description ? (
                                                                <Text style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                                                                    {item.description}
                                                                </Text>
                                                            ) : null}

                                                            {coordsText && (
                                                                <Text style={styles.anomalieCoordsText}>
                                                                    <Ionicons name="location-outline" size={12} /> {coordsText}
                                                                </Text>
                                                            )}
                                                            <Text style={styles.dateText}>{dateStr}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            </View>

        </View>
    );
};

export default LogisticHistoryScreen;