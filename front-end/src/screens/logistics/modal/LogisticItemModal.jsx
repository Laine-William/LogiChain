import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/logistics/LogisticDetailScreen';
import { cleanId, getItemTypeLabel, getItemStatusDetails } from '../helper/LogisticHelpers';

const LogisticItemModal = ({
  visible,
  itemData,
  isScanningStatusSelection,
  setIsScanningStatusSelection,
  onClose,
  handleOpenScannerForItem,
  handleApplyNewItemStatus
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>📦 Détails de l'équipement</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          {itemData ? (
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Référence : <Text style={styles.bold}>
                  {cleanId(itemData._id || itemData.id) || 'N/A'}
                </Text>
              </Text>
              <Text style={styles.modalText}>Nom : <Text style={styles.bold}>{itemData.name}</Text></Text>
              <Text style={styles.modalText}>
                Type : <Text style={styles.bold}>{getItemTypeLabel(itemData.type)}</Text>
              </Text>
              <Text style={styles.modalText}>Quantité : <Text style={styles.bold}>{itemData.quantity || 1}</Text></Text>
              
              <View style={styles.modalStatusRow}>
                <Text style={styles.modalText}>Statut : </Text>
                {(() => {
                  const statusInfo = getItemStatusDetails(itemData.status);
                  return (
                    <View style={[styles.itemStatusBadge, { backgroundColor: statusInfo.bg, borderColor: statusInfo.border, borderWidth: 1 }]}>
                      <Text style={[styles.itemStatusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                    </View>
                  );
                })()}
              </View>

              {isScanningStatusSelection && (
                <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 12 }}>
                  <Text style={[styles.label, { marginBottom: 8, color: '#0284c7' }]}>Sélectionnez le nouveau statut :</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {['available', 'in_use', 'maintenance', 'reserved', 'archived'].map((st) => {
                      const info = getItemStatusDetails(st);
                      return (
                        <TouchableOpacity
                          key={st}
                          style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: info.bg, borderWidth: 1, borderColor: info.border }}
                          onPress={() => handleApplyNewItemStatus(st)}
                        >
                          <Text style={{ fontSize: 11, fontWeight: 'bold', color: info.color }}>{info.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.modalText}>Chargement...</Text>
          )}

          <View style={styles.modalActionsRow}>
            {!isScanningStatusSelection ? (
              <>
                {itemData?.status === 'available' ? (
                  <View style={{ flexDirection: 'row', gap: 8, width: '100%', justifyContent: 'space-between' }}>
                    <TouchableOpacity 
                      style={[styles.modalCancelButton, { flex: 1, backgroundColor: '#fee2e2', borderColor: '#fca5a5' }]} 
                      onPress={onClose}
                    >
                      <Text style={[styles.modalCancelButtonText, { color: '#dc2626' }]}>Annuler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.modalScanButton, { flex: 1, backgroundColor: '#0284c7', alignItems: 'center', justifyContent: 'center' }]} 
                      onPress={() => handleOpenScannerForItem(itemData)}
                    >
                      <Text style={styles.modalScanButtonText}>Scanner</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={[styles.modalCancelButton, { flex: 1 }]} onPress={onClose}>
                    <Text style={styles.modalCancelButtonText}>Fermer</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity style={[styles.modalCancelButton, { flex: 1 }]} onPress={() => setIsScanningStatusSelection(false)}>
                <Text style={styles.modalCancelButtonText}>Retour</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogisticItemModal;