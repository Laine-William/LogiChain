import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/logistics/StepValidationScreen';
import ModalAlert from '../../components/ModalAlert';
import ModalConfirm from '../../components/ModalConfirm'; 
import ModalHistory from '../../components/ModalHistory'; 
import { useOfflineStore } from '../../store/offlineStore';
import apiClient from '../../services/api/clientApi';

const StepValidationScreen = ({ route }) => {
  const navigation = useNavigation();

  const { logisticId, eventData: initialEventData } = route.params || {};
  const { isOnline } = useOfflineStore();
  
  const [steps, setSteps] = useState(initialEventData?.steps || []);
  
  // 🟢 Nouvel état pour conserver et suivre le statut global de la logistique
  const [globalStatus, setGlobalStatus] = useState(initialEventData?.status || 'starting');
  
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success' });

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const [historyModal, setHistoryModal] = useState({
    visible: false,
    step: null,
  });

  const loadStepsDetails = async () => {
    if (!isOnline || !logisticId) return;

    try {
      const response = await apiClient.get(`/logistics/${logisticId}`);
      if (response.data) {
        if (response.data.steps) setSteps(response.data.steps);
        if (response.data.status) setGlobalStatus(response.data.status); // 🟢 Synchronisation locale
      }
    } catch (error) {
      console.warn("⚠️ Erreur lors du rafraîchissement des étapes :", error.message);
    }
  };

  const onPullToRefresh = async () => {
    setRefreshing(true);
    await loadStepsDetails();
    setRefreshing(false);
  };

  // 🟢 Évaluation automatique du statut global selon les statuts des étapes
  const getDerivedGlobalStatus = (currentSteps) => {
    if (!currentSteps || currentSteps.length === 0) return 'starting';
    
    const allCompleted = currentSteps.every(s => s.status === 'completed' || s.status === 'archived');
    const anyInProgress = currentSteps.some(s => s.status === 'in_progress');
    const anyCancelled = currentSteps.some(s => s.status === 'cancelled');
    const anyBlocked = currentSteps.some(s => s.status === 'blocked');

    if (anyCancelled) return 'cancelled';
    if (anyBlocked) return 'on_hold';
    if (allCompleted) return 'delivered';
    if (anyInProgress) return 'in_transit';
    
    return 'in_preparation';
  };

  const getGlobalStatusLabel = (status) => {
    const labels = {
      'starting': 'Démarrage',
      'in_preparation': 'En préparation',
      'in_transit': 'En transit',
      'delivered': 'Livré',
      'on_hold': 'En pause',
      'cancelled': 'Annulé',
      'archived': 'Archivé'
    };
    return labels[status] || 'Inconnu';
  };

  const getStepStatusDetails = (status) => {
    switch (status) {
      case 'in_progress': return { bg: '#fef3c7', color: '#d97706', label: 'En cours', icon: 'sync-circle-outline' };
      case 'completed': return { bg: '#dcfce7', color: '#16a34a', label: 'Terminé', icon: 'checkmark-circle-outline' };
      case 'blocked': return { bg: '#fee2e2', color: '#dc2626', label: 'Bloqué', icon: 'alert-circle-outline' };
      case 'delayed': return { bg: '#ffedd5', color: '#c2410c', label: 'Retardé', icon: 'time-outline' };
      case 'cancelled': return { bg: '#f1f5f9', color: '#dc2626', label: 'Annulé', icon: 'close-circle-outline' };
      case 'archived': return { bg: '#f3f4f6', color: '#4b5563', label: 'Archivé', icon: 'archive-outline' };
      default: return { bg: '#f8fafc', color: '#94a3b8', label: 'À faire', icon: 'ellipse-outline' };
    }
  };

  const getVehicleBadgeDetails = (vehicle) => {
    const v = (vehicle || 'default').toLowerCase();
    switch (v) {
      case 'truck': return { bg: '#e0f2fe', color: '#0369a1', label: 'Camion', icon: 'bus-outline' };
      case 'ship': return { bg: '#e0e7ff', color: '#3730a3', label: 'Navire', icon: 'boat-outline' };
      case 'plane': return { bg: '#fae8ff', color: '#86198f', label: 'Avion', icon: 'airplane-outline' };
      case 'train': return { bg: '#f3e8ff', color: '#6b21a8', label: 'Train', icon: 'train-outline' };
      default: return { bg: '#f1f5f9', color: '#475569', label: vehicle || 'Standard', icon: 'car-outline' };
    }
  };

  const calculateCO2 = (step) => {
    if (step.fuelConsumption !== undefined && step.fuelConsumption !== null) {
      return parseFloat(step.fuelConsumption).toFixed(1);
    }
    const distance = step.distance || 0;
    const v = (step.vehicle || 'train').toLowerCase();
    const factors = { truck: 0.8, ship: 0.1, plane: 2.5, train: 0.5 };
    const factor = factors[v] || 0.5;
    return parseFloat((distance * factor).toFixed(1));
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'to_do': return 'in_progress';
      case 'in_progress': return 'completed';
      case 'completed': return 'archived';
      case 'blocked': return 'in_progress';
      case 'delayed': return 'in_progress';
      default: return 'in_progress';
    }
  };

  const getPreviousStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'archived': return 'completed';
      case 'completed': return 'in_progress';
      case 'in_progress': return 'to_do';
      case 'blocked': return 'to_do';
      case 'delayed': return 'to_do';
      default: return 'to_do';
    }
  };

  const handleUpdateStepStatus = async (index, newStatus) => {
    const targetStep = steps[index];
    const stepId = targetStep._id?.$oid || targetStep._id;

    if (!isOnline) {
      setAlert({
        visible: true,
        title: 'Mode hors-ligne',
        message: "Impossible de modifier le statut sans connexion.",
        type: 'error',
      });
      return;
    }

    try {
      // 1. Mise à jour du statut de l'étape en base de données
      await apiClient.patch(`/logistics/${logisticId}/steps/${stepId}/status`, {
        status: newStatus
      });

      const updatedSteps = [...steps];
      updatedSteps[index].status = newStatus;
      
      if (!updatedSteps[index].statusHistory) {
        updatedSteps[index].statusHistory = [];
      }
      updatedSteps[index].statusHistory.push({
        status: newStatus,
        changedAt: { $date: new Date().toISOString() }
      });

      setSteps(updatedSteps);

      // 2. 🟢 Évaluation et mise à jour du statut global en base de données
      const newGlobalStatus = getDerivedGlobalStatus(updatedSteps);
      let globalStatusMessage = "";

      if (newGlobalStatus !== globalStatus) {
        try {
          await apiClient.patch(`/logistics/${logisticId}/status`, {
            status: newGlobalStatus
          });
          setGlobalStatus(newGlobalStatus);
          globalStatusMessage = `\n\n🌍 Le flux global passe en statut : ${getGlobalStatusLabel(newGlobalStatus)}.`;
        } catch (globalErr) {
          console.error("❌ Erreur MAJ statut global :", globalErr);
        }
      }

      setAlert({
        visible: true,
        title: 'Statut mis à jour',
        message: `L'étape est passée à l'état : ${getStepStatusDetails(newStatus).label}.${globalStatusMessage}`,
        type: 'success',
      });
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de l'étape :", error);
      setAlert({
        visible: true,
        title: 'Erreur',
        message: error.response?.data?.message || "Impossible d'enregistrer la modification.",
        type: 'error',
      });
    }
  };

  const promptConfirmation = (index, actionType) => {
    const isCancel = actionType === 'cancelled';
    setConfirmModal({
      visible: true,
      title: isCancel ? "Annuler l'étape ?" : "Archiver l'étape ?",
      message: isCancel 
        ? "Êtes-vous sûr de vouloir annuler cette étape ? Cette action peut bloquer la suite." 
        : "Voulez-vous vraiment archiver cette étape ?",
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, visible: false }));
        handleUpdateStepStatus(index, actionType);
      }
    });
  };

  const handleShowHistory = (step) => {
    setHistoryModal({
      visible: true,
      step: step,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={true} // 🟢 Active la scrollbar visible
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onPullToRefresh} colors={['#0056b3']} tintColor="#0056b3" />
        }
      >
      
      <View style={styles.header}>
        <Text style={styles.subtitle}>Route #{String(logisticId).slice(-8).toUpperCase()}</Text>
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const badge = getStepStatusDetails(step.status);
          const vehicleInfo = getVehicleBadgeDetails(step.vehicle);
          const co2Emission = calculateCO2(step);

          const isCompleted = step.status === 'completed';
          const isArchived = step.status === 'archived';
          const isCancelled = step.status === 'cancelled';
          const isToDo = step.status === 'to_do';

          const showCancelButton = !isCompleted && !isArchived && !isCancelled;

          return (
            <View key={step._id?.$oid || index} style={styles.stepCard}>
              
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>Étape {index + 1}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Ionicons name={badge.icon} size={14} color={badge.color} style={{ marginRight: 4 }} />
                  <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                </View>
              </View>

              <View style={styles.stepBody}>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={20} color="#3b82f6" style={styles.iconStyle} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Lieu de passage</Text>
                    <Text style={styles.value} numberOfLines={1}>{step.location || 'Lieu non renseigné'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="resize-outline" size={20} color="#64748b" style={styles.iconStyle} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Distance</Text>
                    <Text style={styles.value}>{step.distance || '--'} km</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name={vehicleInfo.icon} size={20} color={vehicleInfo.color} style={styles.iconStyle} />
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={styles.label}>Véhicule</Text>
                      <View style={[styles.vehicleBadgeInline, { backgroundColor: vehicleInfo.bg }]}>
                        <Text style={[styles.vehicleBadgeText, { color: vehicleInfo.color }]}>{vehicleInfo.label}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.label}>Impact CO2</Text>
                      <Text style={styles.co2Text}>{co2Emission} kg CO₂</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.stepFooterActions}>
                
                <TouchableOpacity 
                  style={styles.historyButton} 
                  onPress={() => handleShowHistory(step)}
                >
                  <Ionicons name="time-outline" size={16} color="#475569" style={{ marginRight: 4 }} />
                  <Text style={styles.historyButtonText}>Historique</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => navigation.navigate('StepForm', { logisticId, stepData: step, stepIndex: index })}
                >
                  <Ionicons name="create-outline" size={16} color="#0056b3" style={{ marginRight: 4 }} />
                  <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>

                <View style={styles.iconButtonGroup}>
                  
                  <TouchableOpacity 
                    style={[styles.actionIconButton, (isToDo || isArchived) && { opacity: 0.3 }]}
                    disabled={isToDo || isArchived}
                    onPress={() => handleUpdateStepStatus(index, getPreviousStatus(step.status))}
                  >
                    <Ionicons name="arrow-back" size={16} color="#475569" />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionIconButton, (isArchived || isCancelled) && { opacity: 0.3 }]}
                    disabled={isArchived || isCancelled}
                    onPress={() => handleUpdateStepStatus(index, getNextStatus(step.status))}
                  >
                    <Ionicons name="arrow-forward" size={16} color="#2563eb" />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionIconButton, isArchived && { opacity: 0.3 }, { borderColor: '#cbd5e1' }]}
                    disabled={isArchived}
                    onPress={() => promptConfirmation(index, 'archived')}
                  >
                    <Ionicons name="archive-outline" size={16} color="#4b5563" />
                  </TouchableOpacity>

                  {showCancelButton && (
                    <TouchableOpacity 
                      style={[styles.actionIconButton, { borderColor: '#fca5a5' }]}
                      onPress={() => promptConfirmation(index, 'cancelled')}
                    >
                      <Ionicons name="close" size={16} color="#dc2626" />
                    </TouchableOpacity>
                  )}

                </View>

              </View>

            </View>
          );
        })}
      </View>

      <ModalAlert 
        visible={alert.visible} 
        title={alert.title} 
        message={alert.message} 
        type={alert.type} 
        onClose={() => setAlert({ ...alert, visible: false })} 
      />

      <ModalConfirm
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
      />

      <ModalHistory 
        visible={historyModal.visible}
        step={historyModal.step}
        getStatusDetails={getStepStatusDetails}
        onClose={() => setHistoryModal(prev => ({ ...prev, visible: false }))}
      />
    </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('StepForm', { logisticId })}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

    </View>
  );
};

export default StepValidationScreen;