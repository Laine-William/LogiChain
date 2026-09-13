import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/logistics/StepFormScreen';
import apiClient from '../../services/api/clientApi';
import ModalAlert from '../../components/ModalAlert';
import { logistic_step_status, logistic_vehicle_types } from '../../schemas/constants/constants';
import { useAuthStore } from '../../store/authStore';

export default function StepFormScreen({ route, navigation }) {
  const { logisticId, stepData, stepIndex } = route.params || {};
  const isEditing = stepData !== undefined;

  const { user, role } = useAuthStore();
  const currentRole = role || user?.role;
  const isAdmin = currentRole === 'admin';

  const [location, setLocation] = useState(stepData?.location || '');
  const [distance, setDistance] = useState(stepData?.distance ? String(stepData.distance) : '');
  const [fuelConsumption, setFuelConsumption] = useState(stepData?.fuelConsumption ? String(stepData.fuelConsumption) : '');
  const [vehicle, setVehicle] = useState(stepData?.vehicle || 'truck');
  const [status, setStatus] = useState(stepData?.status || 'to_do');
  
  const [availableItems, setAvailableItems] = useState([]);
  
  // Utilitaire robuste pour transformer les IDs MongoDB/objets en chaînes uniques propres
  const cleanId = (id) => {
    if (!id) return '';
    if (typeof id === 'object') {
      return id.$oid || (typeof id.toString === 'function' ? id.toString() : String(id));
    }
    return String(id);
  };

  const [selectedItems, setSelectedItems] = useState(
    (stepData?.items || []).map(id => cleanId(id))
  );

  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiClient.get('/items');
        if (response.data) {
          setAvailableItems(response.data);
        }
      } catch (error) {
        console.warn("⚠️ Impossible de récupérer les équipements :", error.message);
      }
    };
    fetchItems();
  }, []);

  const vehicleDetails = {
    truck: { label: 'Camion', icon: 'bus-outline' },
    ship: { label: 'Navire', icon: 'boat-outline' },
    plane: { label: 'Avion', icon: 'airplane-outline' },
    train: { label: 'Train', icon: 'train-outline' },
  };

  const statusLabels = {
    to_do: { label: 'À faire', color: '#94a3b8', bg: '#f8fafc' },
    in_progress: { label: 'En cours', color: '#d97706', bg: '#fef3c7' },
    completed: { label: 'Terminé', color: '#16a34a', bg: '#dcfce7' },
    blocked: { label: 'Bloqué', color: '#dc2626', bg: '#fee2e2' },
    delayed: { label: 'Retardé', color: '#c2410c', bg: '#ffedd5' },
    cancelled: { label: 'Annulé', color: '#dc2626', bg: '#f1f5f9' },
    archived: { label: 'Archivé', color: '#4b5563', bg: '#f3f4f6' },
  };

  const toggleItemSelection = (rawId) => {
    const itemId = cleanId(rawId);
    if (!itemId) return;

    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSave = async () => {
    if (!location || !distance) {
      setAlert({
        visible: true,
        title: 'Champs requis',
        message: 'Veuillez remplir le lieu de passage et la distance.',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        location,
        distance: parseFloat(distance),
        fuelConsumption: fuelConsumption ? parseFloat(fuelConsumption) : 0,
        vehicle,
        status: isAdmin ? status : (stepData?.status || 'to_do'),
        items: selectedItems, // Sont désormais garantis d'être un tableau de strings pures
      };

      if (isEditing) {
        const stepId = cleanId(stepData._id || stepData.id);
        await apiClient.put(`/logistics/${logisticId}/steps/${stepId}`, payload);
      } else {
        await apiClient.post(`/logistics/${logisticId}/steps`, payload);
      }

      setAlert({
        visible: true,
        title: 'Succès',
        message: isEditing ? 'Étape modifiée avec succès.' : 'Étape ajoutée avec succès.',
        type: 'success',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1200);

    } catch (error) {
      console.error('❌ Erreur sauvegarde étape :', error);
      setAlert({
        visible: true,
        title: 'Erreur',
        message: error.response?.data?.message || "Impossible d'enregistrer l'étape.",
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{isEditing ? `Modifier l'étape ${stepIndex + 1}` : 'Ajouter une étape'}</Text>
        <Text style={styles.subtitle}>Paramétrez les détails du jalon logistique</Text>
      </View>

      <View style={styles.formContainer}>
        
        <Text style={styles.label}>Lieu de passage</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Hub Le Havre"
          placeholderTextColor="#94a3b8"
          value={location}
          onChangeText={setLocation}
        />

        <View style={styles.row}>
          <View style={styles.flexOne}>
            <Text style={styles.label}>Distance (km)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 250"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={distance}
              onChangeText={setDistance}
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={styles.flexOne}>
            <Text style={styles.label}>Carburant (L / kg CO₂)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 45.5"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={fuelConsumption}
              onChangeText={setFuelConsumption}
            />
          </View>
        </View>

        <Text style={styles.label}>Mode de transport (Véhicule)</Text>
        <View style={styles.vehicleGrid}>
          {logistic_vehicle_types.map((vKey) => {
            const v = vehicleDetails[vKey] || { label: vKey, icon: 'car-outline' };
            const isSelected = vehicle === vKey;
            return (
              <TouchableOpacity
                key={vKey}
                style={[styles.vehicleOption, isSelected && styles.vehicleOptionSelected]}
                onPress={() => setVehicle(vKey)}
              >
                <Ionicons name={v.icon} size={20} color={isSelected ? '#ffffff' : '#475569'} />
                <Text style={[styles.vehicleText, isSelected && styles.vehicleTextSelected]}>{v.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Équipements transportés</Text>
        {availableItems.length === 0 ? (
          <Text style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginBottom: 10 }}>Aucun équipement disponible.</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {availableItems.map((item, index) => {
              const itemId = cleanId(item._id || item.id) || `fallback-${index}`;
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
                    📦 {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {isAdmin && (
          <>
            <Text style={styles.label}>Statut de l'étape (Admin)</Text>
            <View style={styles.statusGrid}>
              {logistic_step_status.map((stKey) => {
                const st = statusLabels[stKey] || { label: stKey, color: '#333', bg: '#eee' };
                const isSelected = status === stKey;
                return (
                  <TouchableOpacity
                    key={stKey}
                    style={[
                      styles.statusOption, 
                      isSelected ? { backgroundColor: st.bg, borderColor: st.color, borderWidth: 2 } : { backgroundColor: '#f8fafc' }
                    ]}
                    onPress={() => setStatus(stKey)}
                  >
                    <Text style={[styles.statusText, isSelected ? { color: st.color, fontWeight: 'bold' } : { color: '#64748b' }]}>
                      {st.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Enregistrement...' : 'Enregistrer l\'étape'}</Text>
        </TouchableOpacity>
      </View>

      <ModalAlert 
        visible={alert.visible} 
        title={alert.title} 
        message={alert.message} 
        type={alert.type} 
        onClose={() => setAlert({ ...alert, visible: false })} 
      />
    </ScrollView>
  );
}