import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/logistics/LogisticDetailScreen';
import { cleanId } from '../helper/LogisticHelpers';
import { logistic_vehicle_types } from '../../../schemas/constants/constants';

const vehicleDetails = {
  truck: { label: 'Camion', icon: 'bus-outline' },
  ship: { label: 'Navire', icon: 'boat-outline' },
  plane: { label: 'Avion', icon: 'airplane-outline' },
  train: { label: 'Train', icon: 'train-outline' },
};

const LogisticStepModal = ({
  visible,
  stepData,
  stepIndex,
  stepLocation,
  setStepLocation,
  stepDistance,
  setStepDistance,
  stepVehicle,
  setStepVehicle,
  availableItems,
  selectedItems,
  toggleItemSelection,
  isSavingStep,
  onClose,
  handleSaveStep
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { maxHeight: '90%', width: '90%' }]}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>
              {stepData ? `Modifier l'étape ${stepIndex + 1}` : "Ajouter une étape"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>Paramétrez les détails du jalon logistique</Text>

          <Text style={[styles.label, { color: '#94a3b8' }]}>Lieu de passage</Text>
          <TextInput
            style={[styles.textInput, { height: 45, backgroundColor: '#f1f5f9', color: '#94a3b8', borderColor: '#e2e8f0' }]}
            placeholder="Ex: Hub Le Havre"
            placeholderTextColor="#94a3b8"
            value={stepLocation}
            onChangeText={setStepLocation}
            editable={false}
          />

          <Text style={[styles.label, { color: '#94a3b8' }]}>Distance (km)</Text>
          <TextInput
            style={[styles.textInput, { height: 45, backgroundColor: '#f1f5f9', color: '#94a3b8', borderColor: '#e2e8f0' }]}
            placeholder="Ex: 250"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={stepDistance}
            onChangeText={setStepDistance}
            editable={false}
          />

          <Text style={styles.label}>Mode de transport (Véhicule)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 }}>
            {logistic_vehicle_types.map((vKey) => {
              const v = vehicleDetails[vKey] || { label: vKey, icon: 'car-outline' };
              const isSelected = stepVehicle === vKey;
              return (
                <TouchableOpacity
                  key={vKey}
                  style={{
                    width: '48%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: isSelected ? '#0056b3' : '#cbd5e1',
                    marginBottom: 8,
                    backgroundColor: isSelected ? '#0056b3' : '#f8fafc'
                  }}
                  onPress={() => setStepVehicle(vKey)}
                >
                  <Ionicons name={v.icon} size={20} color={isSelected ? '#ffffff' : '#475569'} />
                  <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '600', color: isSelected ? '#ffffff' : '#475569' }}>
                    {v.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={styles.label}>
              {stepData ? "Équipements transportés / réservés" : "Équipements disponibles"}
            </Text>
            
            <View style={{ 
              backgroundColor: '#0284c7', 
              width: 24, 
              height: 24, 
              borderRadius: 12, 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: 6
            }}>
              <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: 'bold' }}>
                {selectedItems.length}
              </Text>
            </View>
          </View>

          {availableItems.length === 0 ? (
            <Text style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginBottom: 15 }}>Aucun équipement disponible.</Text>
          ) : (
            <ScrollView 
              style={{ maxHeight: 150, marginBottom: 15 }} 
              contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}
              showsVerticalScrollIndicator={true}
            >
              {availableItems.map((item, idx) => {
                const itemId = cleanId(item._id || item.id) || `item-${idx}`;
                const isSelected = selectedItems.includes(itemId);
                return (
                  <TouchableOpacity
                    key={itemId}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isSelected ? '#0284c7' : '#cbd5e1',
                      backgroundColor: isSelected ? '#e0f2fe' : '#f8fafc',
                      marginBottom: 4
                    }}
                    onPress={() => toggleItemSelection(itemId)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '600', color: isSelected ? '#0369a1' : '#334155' }}>
                      📦 {item.name} {isSelected ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.modalActionsRow}>
            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalScanButton} onPress={handleSaveStep} disabled={isSavingStep}>
              {isSavingStep ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalScanButtonText}>
                  {stepData ? 'Modifier' : 'Enregistrer'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogisticStepModal;