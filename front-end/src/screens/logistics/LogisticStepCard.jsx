import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/logistics/LogisticDetailScreen';
import { getStepStatusDetails, getVehicleBadgeDetails, filterVisibleItems, cleanId, getItemStatusDetails } from './LogisticHelpers';

const LogisticStepCard = ({ 
  step, 
  index, 
  isAdmin, 
  itemsDetailsMap, 
  stepAnomalies, 
  onShowItemDetail, 
  onShowHistory, 
  onOpenAnomaly, 
  onEditStep, 
  onPromptDelay, 
  onPromptConfirmation,
  onScanTab
}) => {
  const badge = getStepStatusDetails(step.status);
  const vehicleInfo = getVehicleBadgeDetails(step.vehicle);
  const visibleItems = filterVisibleItems(step.items, itemsDetailsMap);
  const stepId = cleanId(step._id);
  
  const isCompleted = step.status === 'completed';
  const isArchived = step.status === 'archived';
  const isCancelled = step.status === 'cancelled';
  const isToDo = step.status === 'to_do';
  const isDelayed = step.status === 'delayed';
  const isInProgress = step.status === 'in_progress';
  const isBlocked = step.status === 'blocked';
  
  const isFinalOrArchived = isArchived || isCancelled || isCompleted;
  const showArchiveButton = isCompleted && !isArchived;
  const showCancelButton = isToDo || isInProgress || isBlocked || isDelayed;
  const showDelayButton = !isFinalOrArchived && !isDelayed;

  return (
    <View style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumberBadge}>
          <Text style={styles.stepNumberText}>Étape {index + 1}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <Ionicons name={badge.icon} size={14} color={badge.color} style={styles.iconRightMargin} />
          <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
        </View>
      </View>

      <View style={styles.stepBody}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#3b82f6" style={styles.iconStyle} />
          <View style={styles.flexOne}>
            <Text style={styles.label}>Lieu de passage</Text>
            <Text style={styles.value} numberOfLines={1}>{step.location || 'Lieu non renseigné'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name={vehicleInfo.icon} size={20} color={vehicleInfo.color} style={styles.iconStyle} />
          <View style={styles.infoRowSplit}>
            <View>
              <Text style={styles.label}>Véhicule</Text>
              <View style={[styles.vehicleBadgeInline, { backgroundColor: vehicleInfo.bg }]}>
                <Text style={[styles.vehicleBadgeText, { color: vehicleInfo.color }]}>{vehicleInfo.label}</Text>
              </View>
            </View>
            <View style={styles.alignEnd}>
              <Text style={styles.label}>Distance</Text>
              <Text style={styles.value}>{step.distance || '--'} km</Text>
            </View>
          </View>
        </View>
      </View>

      {stepAnomalies.length > 0 && (
        <View style={styles.localAlertBox}>
          <Text style={styles.localAlertTitle}>
            <Ionicons name="warning" size={14} /> Anomalies
          </Text>
          {stepAnomalies.map((ev, evIdx) => (
            <Text key={evIdx} style={styles.localAlertItem}>
              • {ev.reason} {ev.description ? `- ${ev.description}` : ''}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.equipmentSection}>
        <View style={styles.equipmentHeader}>
          <Text style={styles.equipmentLabel}>
            <Ionicons name="cube-outline" size={14} /> Équipements transportés ({visibleItems.length})
          </Text>
          <TouchableOpacity onPress={onScanTab}>
            <Ionicons name="barcode-outline" size={20} color="#0056b3" />
          </TouchableOpacity>
        </View>
        {visibleItems.length > 0 ? (
          <View style={styles.equipmentList}>
            {visibleItems.map((item, itemIdx) => {
              const isObject = typeof item === 'object' && item !== null;
              const itemId = cleanId(isObject ? (item._id || item.id) : item);
              const fetchedItem = itemsDetailsMap[itemId];
              const itemStatus = isObject ? (item.status || 'available') : (fetchedItem?.status || 'available');
              const statusInfo = getItemStatusDetails(itemStatus);

              return (
                <TouchableOpacity 
                  key={itemId || itemIdx} 
                  style={[
                    styles.equipmentBadge, 
                    { backgroundColor: statusInfo.bg, borderColor: statusInfo.border, borderWidth: 1 }
                  ]}
                  onPress={() => onShowItemDetail(itemId)}
                >
                  <Text style={[styles.equipmentBadgeText, { color: statusInfo.color, fontWeight: 'bold' }]}>
                    📦 {itemId ? itemId.slice(-6).toUpperCase() : 'Item'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyEquipmentText}>Aucun équipement lié.</Text>
        )}
      </View>

      <View style={styles.stepFooterActionsExtended}>
        <TouchableOpacity style={styles.historyButton} onPress={() => onShowHistory(step)}>
          <Ionicons name="time-outline" size={16} color="#475569" style={styles.iconRightMargin} />
          <Text style={styles.historyButtonText}>Activité</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionIconButton} 
          onPress={() => onOpenAnomaly(stepId, step.location)}
        >
          <Ionicons name="warning-outline" size={16} color="#ef4444" />
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity 
            style={styles.actionIconButton} 
            onPress={() => onEditStep(step, index)}
          >
            <Ionicons name="create-outline" size={16} color="#0056b3" />
          </TouchableOpacity>
        )}

        <View style={styles.iconButtonGroup}>
          {showDelayButton && (
            <TouchableOpacity 
              style={[styles.actionIconButton, { paddingHorizontal: 8, backgroundColor: '#ffedd5', flexDirection: 'row', alignItems: 'center', gap: 4 }]} 
              onPress={() => onPromptDelay(index)}
            >
              <Ionicons name="time-outline" size={14} color="#c2410c" />
            </TouchableOpacity>
          )}

          {showArchiveButton && (
            <TouchableOpacity style={[styles.actionIconButton, styles.actionBorderGray]} onPress={() => onPromptConfirmation(index, 'archived')}>
              <Ionicons name="archive-outline" size={16} color="#4b5563" />
            </TouchableOpacity>
          )}

          {showCancelButton && (
            <TouchableOpacity style={[styles.actionIconButton, styles.actionBorderRed]} onPress={() => onPromptConfirmation(index, 'cancelled')}>
              <Ionicons name="close" size={16} color="#dc2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default LogisticStepCard;