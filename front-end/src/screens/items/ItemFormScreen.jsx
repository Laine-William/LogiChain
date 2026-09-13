import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/logistics/StepFormScreen';
import apiClient from '../../services/api/clientApi';
import ModalAlert from '../../components/ModalAlert';
import { useOfflineStore } from '../../store/offlineStore';
import { item_status, item_types } from '../../schemas/constants/constants';

export default function ItemFormScreen({ navigation }) {
  const { isOnline } = useOfflineStore();

  const [name, setName] = useState('');
  const [type, setType] = useState(item_types[0] || 'metal structure');
  const [quantity, setQuantity] = useState('1');
  const [status, setStatus] = useState(item_status[0] || 'available');
  
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const typeLabels = {
    'metal structure': 'Structure métallique',
    'sound system': 'Sonorisation',
    'lighting': 'Éclairage',
    'video': 'Vidéo',
    'genrator': 'Groupe électrogène',
    'barrier': 'Barrière',
    'cables / accessories': 'Câbles / accessoires',
  };

  const statusLabels = {
    available: { label: 'Disponible', color: '#16a34a', bg: '#dcfce7' },
    in_use: { label: 'En service', color: '#d97706', bg: '#fef3c7' },
    maintenance: { label: 'En maintenance', color: '#dc2626', bg: '#fee2e2' },
    reserved: { label: 'Réservé', color: '#3730a3', bg: '#e0e7ff' },
    archived: { label: 'Archivé', color: '#475569', bg: '#f1f5f9' },
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setAlert({
        visible: true,
        title: 'Champ requis',
        message: 'Veuillez saisir le nom de l\'équipement.',
        type: 'error',
      });
      return;
    }

    if (!isOnline) {
      setAlert({
        visible: true,
        title: 'Hors-ligne',
        message: "Impossible d'ajouter un équipement sans connexion.",
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        type,
        quantity: parseInt(quantity, 10) || 1,
        status,
      };

      await apiClient.post('/items', payload);

      setAlert({
        visible: true,
        title: 'Succès',
        message: 'Équipement ajouté avec succès.',
        type: 'success',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1200);

    } catch (error) {
      console.error('❌ Erreur création équipement :', error);
      setAlert({
        visible: true,
        title: 'Erreur',
        message: error.response?.data?.message || "Impossible d'enregistrer l'équipement.",
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Enregistrez un nouveau matériel dans le parc</Text>
      </View>

      <View style={styles.formContainer}>
        
        <Text style={styles.label}>Nom de l'équipement</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Groupe électrogène 50kW"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Type d'équipement</Text>
        <View style={styles.vehicleGrid}>
          {item_types.map((tKey) => {
            const isSelected = type === tKey;
            return (
              <TouchableOpacity
                key={tKey}
                style={[
                  styles.vehicleOption,
                  isSelected && styles.vehicleOptionSelected
                ]}
                onPress={() => setType(tKey)}
              >
                <Text style={[styles.vehicleText, isSelected && styles.vehicleTextSelected]}>
                  {typeLabels[tKey] || tKey}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Quantité</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 1"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={styles.label}>Statut initial</Text>
        <View style={styles.statusGrid}>
          {item_status.map((stKey) => {
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

        {/* SECTION DES BOUTONS ANNULER ET ENREGISTRER (Plus compacts) */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              backgroundColor: '#f1f5f9', 
              borderWidth: 1, 
              borderColor: '#cbd5e1', 
              borderRadius: 10, 
              paddingVertical: 12, 
              alignItems: 'center' 
            }} 
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#475569', fontSize: 14, fontWeight: '600' }}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              flex: 1, 
              backgroundColor: '#0056b3', 
              borderRadius: 10, 
              paddingVertical: 12, 
              alignItems: 'center' 
            }} 
            onPress={handleSave} 
            disabled={loading}
          >
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>

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