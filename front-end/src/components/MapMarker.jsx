import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/components/MapMarker';

/**
 * Composant custom pour l'affichage cartographique (intégrable dans react-native-maps)
 * @param {{ type: 'event' | 'item' | 'anomaly' }} props
 */
const MapMarker = ({ type }) => {
  const getMarkerColor = () => {
    switch (type) {
      case 'anomaly': return '#dc3545'; // Rouge
      case 'event': return '#0056b3'; // Bleu
      case 'item': return '#28a745'; // Vert
      default: return '#6c757d';
    }
  };

  const pinColor = getMarkerColor();

  return (
    <View style={styles.markerContainer}>
      <View style={[styles.pin, { backgroundColor: pinColor }]} />
      <View style={[styles.triangle, { borderBottomColor: pinColor }]} />
    </View>
  );
};

export default MapMarker;