import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/logistics/LogisticDetailScreen';

import ModalAlert from '../../components/modal/ModalAlert';
import ModalConfirm from '../../components/modal/ModalConfirm'; 
import ModalHistory from '../../components/modal/ModalHistory'; 

import LogisticStepCard from './LogisticStepCard';
import LogisticStepModal from './modal/LogisticStepModal';
import LogisticItemModal from './modal/LogisticItemModal';
import LogisticAnomalyModal from './modal/LogisticAnomalyModal';

import { useOfflineStore } from '../../store/offlineStore';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../services/api/clientApi';
import { cleanId, getDerivedGlobalStatus, getGlobalStatusLabel, getStepStatusDetails } from './LogisticHelpers';

const LogisticDetailScreen = ({ route }) => {
  const navigation = useNavigation();

  const { logisticId: routeLogisticId, anomalyData, logisticData } = route.params || {};
  const initialData = logisticData || anomalyData || {};
  const logisticId = initialData?.id || (typeof initialData?._id === 'object' ? initialData?._id?.$oid : initialData?._id) || routeLogisticId;

  const { isOnline } = useOfflineStore();
  const { user, role } = useAuthStore();
  const currentRole = role || user?.role;
  const isAdmin = currentRole === 'admin';

  const [logistic, setLogistic] = useState(initialData);
  const [steps, setSteps] = useState(initialData?.steps || []);
  const [globalStatus, setGlobalStatus] = useState(initialData?.status || 'starting');
  const [anomaliesMap, setAnomaliesMap] = useState({}); 
  const [itemsDetailsMap, setItemsDetailsMap] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ visible: false, title: '', message: '', onConfirm: null });
  const [historyModal, setHistoryModal] = useState({ visible: false, step: null });
  const [delayModal, setDelayModal] = useState({ visible: false, index: null });

  // États pour LogisticItemModal
  const [itemModal, setItemModal] = useState({ visible: false, itemData: null });
  const [isScanningStatusSelection, setIsScanningStatusSelection] = useState(false);

  // États pour LogisticAnomalyModal
  const [anomalyModal, setAnomalyModal] = useState({ visible: false, stepId: null, stepLocation: '' });

  // États pour LogisticStepModal
  const [stepModal, setStepModal] = useState({ visible: false, stepData: null, stepIndex: null });
  const [stepLocation, setStepLocation] = useState('');
  const [stepDistance, setStepDistance] = useState('');
  const [stepVehicle, setStepVehicle] = useState('truck');
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSavingStep, setIsSavingStep] = useState(false);

  const loadStepsDetails = async () => {
    if (!isOnline || !logisticId) return;

    try {
      const response = await apiClient.get(`/logistics/${logisticId}`);
      if (response.data) {
        setLogistic(response.data);
        const currentSteps = response.data.steps || [];
        setSteps(currentSteps);
        if (response.data.status) setGlobalStatus(response.data.status);

        const itemIdsToFetch = new Set();
        currentSteps.forEach(step => {
          if (step.items) {
            step.items.forEach(item => {
              if (typeof item === 'string') itemIdsToFetch.add(item);
              else if (item && (item._id || item.id)) itemIdsToFetch.add(cleanId(item._id || item.id));
            });
          }
        });

        const newItemsMap = { ...itemsDetailsMap };
        await Promise.all(
          Array.from(itemIdsToFetch).map(async (id) => {
            try {
              const itemRes = await apiClient.get(`/items/${id}`);
              if (itemRes.data) newItemsMap[id] = itemRes.data;
            } catch (err) {}
          })
        );
        setItemsDetailsMap(newItemsMap);
      }

      const anomaliesResponse = await apiClient.get(`/anomalies?logisticId=${logisticId}`);
      if (anomaliesResponse.data) {
        const map = {};
        anomaliesResponse.data.forEach(ev => {
          if (ev.status === 'open' || ev.status === 'in_progress') { 
            const sId = cleanId(ev.stepId);
            if (sId) {
              if (!map[sId]) map[sId] = [];
              map[sId].push(ev);
            } else {
              if (!map['global']) map['global'] = [];
              map['global'].push(ev);
            }
          }
        });
        setAnomaliesMap(map);
      }
    } catch (error) {
      console.warn("⚠️ Erreur lors du rafraîchissement :", error.message);
    }
  };

  useEffect(() => { loadStepsDetails(); }, [logisticId]);

  const onPullToRefresh = async () => {
    setRefreshing(true);
    await loadStepsDetails();
    setRefreshing(false);
  };

  const handleShowItemDetail = async (itemId) => {
    const cId = cleanId(itemId);
    if (!cId) return;
    try {
      const response = await apiClient.get(`/items/${cId}`);
      if (response.data) setItemModal({ visible: true, itemData: response.data });
    } catch (error) {
      setAlert({ visible: true, title: 'Erreur', message: "Impossible de récupérer les détails de l'équipement.", type: 'error' });
    }
  };

  const handleOpenStepModal = async (stepData = null, stepIndex = null) => {
    setStepLocation(stepData?.location || '');
    setStepDistance(stepData?.distance ? String(stepData.distance) : '');
    setStepVehicle(stepData?.vehicle || 'truck');
    const currentStepItemIds = (stepData?.items || []).map(id => cleanId(typeof id === 'object' ? (id._id || id.id) : id));
    setSelectedItems(currentStepItemIds);

    try {
      const response = await apiClient.get('/items');
      if (response.data) setAvailableItems(response.data);
    } catch (error) {
      setAvailableItems([]);
    }
    setStepModal({ visible: true, stepData, stepIndex });
  };

  const toggleItemSelection = (rawId) => {
    const itemId = cleanId(rawId);
    if (!itemId) return;
    if (selectedItems.includes(itemId)) setSelectedItems(selectedItems.filter(id => id !== itemId));
    else setSelectedItems([...selectedItems, itemId]);
  };

  const handleOpenScannerForItem = (itemData) => {
    setItemModal({ visible: false, itemData: null });
    setIsScanningStatusSelection(false);
    
    navigation.navigate('ScanTab', {
      screen: 'ScanMain', 
      onScanSuccess: async (scannedId) => {
        const currentItemId = cleanId(itemData._id || itemData.id);
        const cleanedScannedId = cleanId(scannedId);
        if (cleanedScannedId !== currentItemId) {
          setAlert({ visible: true, title: 'Erreur de scan', message: "Le QR code scanné ne correspond pas à cet équipement.", type: 'error' });
          return;
        }
        setItemModal({ visible: true, itemData });
        setIsScanningStatusSelection(true);
      }
    });
  };

  const handleApplyNewItemStatus = async (newStatus) => {
    const itemData = itemModal.itemData;
    if (!itemData) return;
    const itemId = cleanId(itemData._id || itemData.id);
    if (!isOnline) {
      setAlert({ visible: true, title: 'Hors-ligne', message: "Impossible de modifier le statut sans connexion.", type: 'error' });
      return;
    }
    try {
      await apiClient.patch(`/items/${itemId}/status`, { status: newStatus });
      setItemModal({ visible: false, itemData: null });
      setIsScanningStatusSelection(false);
      setAlert({ visible: true, title: 'Succès', message: `Statut de l'équipement mis à jour : ${newStatus}`, type: 'success' });
      loadStepsDetails();
    } catch (error) {
      setAlert({ visible: true, title: 'Erreur', message: error.response?.data?.message || "Échec de la mise à jour du statut.", type: 'error' });
    }
  };

  const handleSaveStep = async () => {
    if (!stepLocation || !stepDistance) {
      setAlert({ visible: true, title: 'Champs requis', message: 'Veuillez remplir le lieu de passage et la distance.', type: 'error' });
      return;
    }
    setIsSavingStep(true);
    try {
      const payload = { location: stepLocation, distance: parseFloat(stepDistance), vehicle: stepVehicle, items: selectedItems };
      const isEditing = stepModal.stepData !== undefined && stepModal.stepData !== null;
      if (isEditing) {
        const stepId = cleanId(stepModal.stepData._id || stepModal.stepData.id);
        await apiClient.put(`/logistics/${logisticId}/steps/${stepId}`, payload);
      } else {
        await apiClient.post(`/logistics/${logisticId}/steps`, payload);
      }
      setStepModal({ visible: false, stepData: null, stepIndex: null });
      setAlert({ visible: true, title: 'Succès', message: isEditing ? 'Étape modifiée avec succès.' : 'Étape ajoutée avec succès.', type: 'success' });
      loadStepsDetails();
    } catch (error) {
      setAlert({ visible: true, title: 'Erreur', message: error.response?.data?.message || "Impossible d'enregistrer l'étape.", type: 'error' });
    } finally {
      setIsSavingStep(false);
    }
  };

  const handleSubmitAnomaly = async (data) => {
    if (!isOnline) {
      setAlert({ visible: true, title: 'Hors-ligne', message: "Impossible de signaler une anomalie sans connexion.", type: 'error' });
      return;
    }
    try {
      await apiClient.post('/anomalies', {
        eventId: logistic?.eventId || '6a929525b5e0a30c6e2f502f',
        logisticId,
        stepId: data.stepId,
        reason: data.reason,
        severity: data.severity,
        description: data.description || "Aucune description",
        status: 'open',
        location: { type: 'Point', coordinates: data.coords }
      });
      setAnomalyModal({ visible: false, stepId: null, stepLocation: '' });
      setAlert({ visible: true, title: 'Signalé', message: "L'anomalie a été enregistrée avec succès.", type: 'success' });
      loadStepsDetails();
    } catch (error) {
      setAlert({ visible: true, title: 'Erreur', message: error.response?.data?.message || "Échec de l'enregistrement de l'anomalie.", type: 'error' });
    }
  };

  const handleUpdateStepStatus = async (index, newStatus) => {
    const targetStep = steps[index];
    const stepId = cleanId(targetStep._id);
    if (!isOnline) {
      setAlert({ visible: true, title: 'Mode hors-ligne', message: "Impossible de modifier le statut sans connexion.", type: 'error' });
      return;
    }
    try {
      await apiClient.patch(`/logistics/${logisticId}/steps/${stepId}/status`, { status: newStatus });
      const updatedSteps = [...steps];
      updatedSteps[index].status = newStatus;
      if (!updatedSteps[index].statusHistory) updatedSteps[index].statusHistory = [];
      updatedSteps[index].statusHistory.push({ status: newStatus, changedAt: { $date: new Date().toISOString() } });
      setSteps(updatedSteps);

      const newGlobalStatus = getDerivedGlobalStatus(updatedSteps);
      let globalStatusMessage = "";
      if (newGlobalStatus !== globalStatus) {
        try {
          await apiClient.patch(`/logistics/${logisticId}/status`, { status: newGlobalStatus });
          setGlobalStatus(newGlobalStatus);
          globalStatusMessage = `\n\n🌍 Le flux passe en statut : ${getGlobalStatusLabel(newGlobalStatus)}.`;
        } catch (globalErr) {
          if (globalErr.response?.status === 409) {
            setGlobalStatus(logistic.status);
            setAlert({ visible: true, title: 'Action impossible', message: "Impossible de modifier le statut d'une route déjà livrée.", type: 'error' });
            return;
          }
        }
      }
      setAlert({ visible: true, title: 'Statut mis à jour', message: `Étape passée à : ${getStepStatusDetails(newStatus).label}.${globalStatusMessage}`, type: 'success' });
    } catch (error) {
      setAlert({ visible: true, title: 'Erreur', message: error.response?.data?.message || "Impossible d'enregistrer la modification.", type: 'error' });
    }
  };

  const promptConfirmation = (index, actionType) => {
    const isCancel = actionType === 'cancelled';
    setConfirmModal({
      visible: true,
      title: isCancel ? "Annuler l'étape ?" : "Archiver l'étape ?",
      message: isCancel ? "Êtes-vous sûr de vouloir annuler cette étape ?" : "Voulez-vous vraiment archiver cette étape ?",
      onConfirm: () => { setConfirmModal(prev => ({ ...prev, visible: false })); handleUpdateStepStatus(index, actionType); }
    });
  };

  const handleConfirmDelay = () => {
    if (delayModal.index !== null) handleUpdateStepStatus(delayModal.index, 'delayed');
    setDelayModal({ visible: false, index: null });
  };

  const departure = logistic?.departureDestination || 'Départ inconnu';
  const arrival = logistic?.arrivalDestination || 'Arrivée inconnue';
  const totalDistance = logistic?.totalDistance || '--';
  const totalCarbonConsumption = steps.reduce((acc, step) => {
    if (step.fuelConsumption !== undefined && step.fuelConsumption !== null) return acc + parseFloat(step.fuelConsumption);
    const dist = step.distance || 0;
    const v = (step.vehicle || 'train').toLowerCase();
    const factors = { truck: 0.8, ship: 0.1, plane: 2.5, train: 0.5 };
    return acc + (dist * (factors[v] || 0.5));
  }, 0).toFixed(1);

  return (
    <View style={styles.mainContainer}>
      
      <View style={styles.globalSummaryCard}>
        <View style={styles.summaryHeaderRow}>
          <View style={styles.summaryTextColumn}>
            <Text style={styles.fluxIdText}>Flux #{String(logisticId).slice(-8).toUpperCase()}</Text>
            <Text style={styles.routeTitleText}>{departure} ➔ {arrival}</Text>
            <View style={styles.metricsRow}>
              <Ionicons name="speedometer-outline" size={14} color="#64748b" />
              <Text style={styles.metricTextDistance}>{totalDistance} km</Text>
              <Ionicons name="leaf-outline" size={14} color="#059669" />
              <Text style={styles.metricTextCo2}>{totalCarbonConsumption} kg CO₂</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.historyTopButton} onPress={() => navigation.navigate('LogisticHistory', { anomalyData: logistic })}>
            <Ionicons name="time-outline" size={20} color="#475569" />
            <Text style={styles.historyTopButtonText}>Historique</Text>
          </TouchableOpacity>
        </View>

        {anomaliesMap['global'] && anomaliesMap['global'].length > 0 && (
          <View style={styles.globalAlertBox}>
            <Text style={styles.globalAlertTitle}>⚠️ Zones événementielles traversées :</Text>
            {anomaliesMap['global'].map((ev, idx) => (
              <Text key={idx} style={styles.globalAlertItem}>• Anomalie : {ev.reason}</Text>
            ))}
          </View>
        )}
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={true}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onPullToRefresh} colors={['#0056b3']} tintColor="#0056b3" />}
      >
        <View style={styles.stepsContainer}>
          {steps
            .filter((step) => isAdmin ? true : step.status !== 'completed' && step.status !== 'archived')
            .map((step, index) => (
              <LogisticStepCard 
                key={cleanId(step._id) || index}
                step={step}
                index={index}
                isAdmin={isAdmin}
                itemsDetailsMap={itemsDetailsMap}
                stepAnomalies={anomaliesMap[cleanId(step._id)] || []}
                onShowItemDetail={handleShowItemDetail}
                onShowHistory={(st) => setHistoryModal({ visible: true, step: st })}
                onOpenAnomaly={(stepId, location) => setAnomalyModal({ visible: true, stepId, stepLocation: location })}
                onEditStep={(st, idx) => handleOpenStepModal(st, idx)}
                onPromptDelay={(idx) => setDelayModal({ visible: true, index: idx })}
                onPromptConfirmation={promptConfirmation}
                onScanTab={() => navigation.navigate('ScanTab')}
              />
            ))}
        </View>
      </ScrollView>

      <ModalAlert visible={alert.visible} title={alert.title} message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, visible: false })} />
      <ModalConfirm visible={confirmModal.visible} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))} />
      <ModalConfirm visible={delayModal.visible} title="Retarder l'étape ?" message="Voulez-vous vraiment marquer cette étape comme retardée ?" confirmText="Retarder" type="warning" onConfirm={handleConfirmDelay} onCancel={() => setDelayModal({ visible: false, index: null })} />
      <ModalHistory visible={historyModal.visible} step={historyModal.step} getStatusDetails={getStepStatusDetails} onClose={() => setHistoryModal(prev => ({ ...prev, visible: false }))} />

      <LogisticStepModal 
        visible={stepModal.visible}
        stepData={stepModal.stepData}
        stepIndex={stepModal.stepIndex}
        stepLocation={stepLocation}
        setStepLocation={setStepLocation}
        stepDistance={stepDistance}
        setStepDistance={setStepDistance}
        stepVehicle={stepVehicle}
        setStepVehicle={setStepVehicle}
        availableItems={availableItems}
        selectedItems={selectedItems}
        toggleItemSelection={toggleItemSelection}
        isSavingStep={isSavingStep}
        onClose={() => setStepModal({ visible: false, stepData: null, stepIndex: null })}
        handleSaveStep={handleSaveStep}
      />

      <LogisticItemModal
        visible={itemModal.visible}
        itemData={itemModal.itemData}
        isScanningStatusSelection={isScanningStatusSelection}
        setIsScanningStatusSelection={setIsScanningStatusSelection}
        onClose={() => { setItemModal({ visible: false, itemData: null }); setIsScanningStatusSelection(false); }}
        handleOpenScannerForItem={handleOpenScannerForItem}
        handleApplyNewItemStatus={handleApplyNewItemStatus}
      />

      <LogisticAnomalyModal
        visible={anomalyModal.visible}
        stepId={anomalyModal.stepId}
        stepLocation={anomalyModal.stepLocation}
        onClose={() => setAnomalyModal({ visible: false, stepId: null, stepLocation: '' })}
        onSubmitAnomaly={handleSubmitAnomaly}
      />
    </View>
  );
};

export default LogisticDetailScreen;