import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { styles } from '../../styles/anomalies/AnomalyFormScreen';
import InputField from '../../components/InputField';
import ModalAlert from '../../components/ModalAlert';
import { requestDatabase } from '../../services/database/requestDatabase';
import { anomalyValidationSchema } from '../../schemas/anomalySchema';
import { anomaly_reasons, anomaly_severities } from '../../schemas/constants/constants';
import apiClient from '../../services/api/clientApi';
import { useOfflineStore } from '../../store/offlineStore';

const AnomalyFormScreen = ({ route, navigation }) => {
  const { logisticId, eventId } = route.params || {};
  const { isOnline } = useOfflineStore();

  const [reason, setReason] = useState('Breakdown');
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [locationCoords, setLocationCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'info' });

  const reasonLabels = {
    'Breakdown': 'Panne mécanique',
    'Material damage': 'Dommage matériel / Casse',
    'Scanner problem': 'Problème de scanner',
    'Problem quantity': 'Problème de quantité',
    'Other': 'Autre'
  };

  const severityLabels = {
    'low': { label: 'Faible', color: '#0369a1', bg: '#e0f2fe' },
    'medium': { label: 'Moyenne', color: '#d97706', bg: '#fef3c7' },
    'high': { label: 'Élevée', color: '#c2410c', bg: '#ffedd5' },
    'critical': { label: 'Critique', color: '#dc2626', bg: '#fee2e2' }
  };

  const fetchCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAlert({
          visible: true,
          title: 'Permission refusée',
          message: 'L\'accès à la géolocalisation est nécessaire pour positionner l\'anomalie.',
          type: 'warning',
        });
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocationCoords([location.coords.longitude, location.coords.latitude]);
    } catch (error) {
      console.warn('⚠️ Erreur géolocalisation :', error.message);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleReport = async () => {
    const coords = locationCoords || [-0.8255, 45.9531];

    const rawData = {
      eventId: eventId || '6a929525b5e0a30c6e2f502f',
      logisticId: logisticId || undefined,
      reason,
      severity,
      description,
      status: 'open',
      location: {
        type: 'Point',
        coordinates: coords
      }
    };

    const validation = anomalyValidationSchema.safeParse(rawData);

    if (!validation.success) {
      setAlert({
        visible: true,
        title: 'Formulaire invalide',
        message: validation.error.errors[0]?.message || 'Veuillez vérifier les informations saisies.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isOnline) {
        await apiClient.post('/anomalies', validation.data);
      } else {
        await requestDatabase.saveAnomalyLocal(validation.data, 'pending');
      }

      setIsLoading(false);
      setAlert({
        visible: true,
        title: 'Succès',
        message: isOnline ? 'Anomalie déclarée avec succès.' : 'Anomalie enregistrée localement (mode hors-ligne).',
        type: 'success',
      });
    } catch (error) {
      setIsLoading(false);
      setAlert({
        visible: true,
        title: 'Erreur',
        message: error.response?.data?.message || "Impossible d'enregistrer l'anomalie.",
        type: 'error',
      });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        
        {/* Sélection de la position GPS */}
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 8 }}>Position géographique</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location" size={20} color={locationCoords ? '#0284c7' : '#94a3b8'} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 13, color: '#334155', fontWeight: '500' }}>
              {isLocating 
                ? 'Recherche GPS en cours...' 
                : locationCoords 
                  ? `[${locationCoords[1].toFixed(4)}, ${locationCoords[0].toFixed(4)}]` 
                  : 'Position non capturée'}
            </Text>
          </View>
          <TouchableOpacity onPress={fetchCurrentLocation} disabled={isLocating} style={{ padding: 4 }}>
            {isLocating ? (
              <ActivityIndicator size="small" color="#0284c7" />
            ) : (
              <Ionicons name="refresh-circle" size={26} color="#0284c7" />
            )}
          </TouchableOpacity>
        </View>

        {/* Sélection du motif */}
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 8 }}>Motif de l'anomalie</Text>
        <View style={{ marginBottom: 16 }}>
          {anomaly_reasons.map((item) => (
            <TouchableOpacity
              key={item}
              style={{
                backgroundColor: reason === item ? '#0284c7' : '#f1f5f9',
                padding: 12,
                borderRadius: 8,
                marginBottom: 6,
              }}
              onPress={() => setReason(item)}
            >
              <Text style={{ color: reason === item ? '#ffffff' : '#334155', fontWeight: '600', fontSize: 13 }}>
                {reasonLabels[item] || item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sélection de la sévérité */}
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 8 }}>Niveau de sévérité</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          {anomaly_severities.map((sev) => {
            const isSelected = severity === sev;
            const cfg = severityLabels[sev];
            return (
              <TouchableOpacity
                key={sev}
                style={{
                  flex: 1,
                  backgroundColor: isSelected ? cfg.bg : '#f1f5f9',
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: cfg.color,
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderRadius: 8,
                  marginHorizontal: 3,
                }}
                onPress={() => setSeverity(sev)}
              >
                <Text style={{ color: isSelected ? cfg.color : '#64748b', fontWeight: 'bold', fontSize: 12 }}>
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Champ Description */}
        <InputField 
          label="Description détaillée (10 car. min)" 
          value={description} 
          onChangeText={setDescription} 
          placeholder="Décrivez précisément l'incident..." 
          multiline
        />

        {/* 🟢 SECTION DES BOUTONS ANNULER ET ENVOYER (Design harmonisé) */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
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
            onPress={handleReport} 
            disabled={isLoading}
          >
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </Text>
          </TouchableOpacity>
        </View>

        <ModalAlert 
          visible={alert.visible} 
          title={alert.title} 
          message={alert.message} 
          type={alert.type} 
          onClose={() => {
            setAlert({ ...alert, visible: false });
            if (alert.type === 'success') navigation.goBack();
          }} 
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AnomalyFormScreen;