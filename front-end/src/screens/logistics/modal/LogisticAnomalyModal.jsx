import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { styles } from '../../../styles/logistics/LogisticDetailScreen';
import { anomaly_reasons, anomaly_severities } from '../../../schemas/constants/constants';

const LogisticAnomalyModal = ({ visible, stepId, stepLocation, onClose, onSubmitAnomaly }) => {
  const [reason, setReason] = useState('Breakdown');
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [locationCoords, setLocationCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (visible) {
      setReason('Breakdown');
      setSeverity('medium');
      setDescription('');
      fetchCurrentLocation();
    }
  }, [visible]);

  const fetchCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocationCoords([loc.coords.longitude, loc.coords.latitude]);
    } catch (error) {
      setLocationCoords([-0.8255, 45.9531]);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = () => {
    onSubmitAnomaly({ stepId, reason, severity, description, coords: locationCoords || [-0.8255, 45.9531] });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { maxHeight: '90%', width: '90%' }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={styles.modalTitle}>⚠️ Déclarer une anomalie</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
              Étape : <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{stepLocation || 'Générale'}</Text>
            </Text>

            <Text style={styles.label}>Position géographique</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f1f5f9', padding: 10, borderRadius: 8, marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" size={18} color={locationCoords ? '#0284c7' : '#94a3b8'} style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 12, color: '#334155', fontWeight: '500' }}>
                  {isLocating 
                    ? 'Recherche GPS...' 
                    : locationCoords 
                      ? `[${locationCoords[1].toFixed(4)}, ${locationCoords[0].toFixed(4)}]` 
                      : 'Position par défaut'}
                </Text>
              </View>
              <TouchableOpacity onPress={fetchCurrentLocation} disabled={isLocating}>
                {isLocating ? <ActivityIndicator size="small" color="#0284c7" /> : <Ionicons name="refresh-circle" size={24} color="#0284c7" />}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Motif de l'anomalie</Text>
            <View style={{ marginBottom: 14 }}>
              {anomaly_reasons.map((item) => {
                const motifLabels = { 'Breakdown': 'Panne mécanique', 'Material damage': 'Dommage matériel / Casse', 'Scanner problem': 'Problème de scanner', 'Problem quantity': 'Problème de quantité', 'Other': 'Autre' };
                const isSelected = reason === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={{ backgroundColor: isSelected ? '#0284c7' : '#f1f5f9', padding: 10, borderRadius: 8, marginBottom: 6 }}
                    onPress={() => setReason(item)}
                  >
                    <Text style={{ color: isSelected ? '#ffffff' : '#334155', fontWeight: '600', fontSize: 12 }}>
                      {motifLabels[item] || item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Niveau de sévérité</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
              {anomaly_severities.map((sev) => {
                const isSelected = severity === sev;
                const cfg = {
                  'low': { label: 'Faible', color: '#0369a1', bg: '#e0f2fe' },
                  'medium': { label: 'Moyenne', color: '#d97706', bg: '#fef3c7' },
                  'high': { label: 'Élevée', color: '#c2410c', bg: '#ffedd5' },
                  'critical': { label: 'Critique', color: '#dc2626', bg: '#fee2e2' }
                }[sev];
                return (
                  <TouchableOpacity
                    key={sev}
                    style={{ flex: 1, backgroundColor: isSelected ? cfg.bg : '#f1f5f9', borderWidth: isSelected ? 2 : 0, borderColor: cfg.color, paddingVertical: 8, alignItems: 'center', borderRadius: 8, marginHorizontal: 2 }}
                    onPress={() => setSeverity(sev)}
                  >
                    <Text style={{ color: isSelected ? cfg.color : '#64748b', fontWeight: 'bold', fontSize: 11 }}>
                      {cfg.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Description détaillée</Text>
            <TextInput
              style={[styles.textInput, { minHeight: 70, textAlignVertical: 'top' }]}
              placeholder="Décrivez précisément l'incident (10 car. min)..."
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={[styles.modalActions, { marginTop: 16 }]}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default LogisticAnomalyModal;