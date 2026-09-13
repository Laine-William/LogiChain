import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/components/SyncStatusBadge';

/**
 * Indicateur visuel de l'état du réseau
 * @param {{ status: 'connected' | 'offline' | 'syncing' }} props
 */
const SyncStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected': return { label: 'En ligne', color: '#28a745' }; // Vert
      case 'offline': return { label: 'Hors-ligne', color: '#dc3545' }; // Rouge
      case 'syncing': return { label: 'Synchronisation...', color: '#ffc107' }; // Jaune
      default: return { label: 'Inconnu', color: '#6c757d' }; // Gris
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <Text style={styles.text}>{config.label}</Text>
    </View>
  );
};

export default SyncStatusBadge;