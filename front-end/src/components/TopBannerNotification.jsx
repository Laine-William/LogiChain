import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TopBannerNotification({ isOnline, message }) {
  // S'il y a un message explicite (ex: "Réseau récupéré"), on l'affiche en vert.
  // Sinon, si on est hors-ligne, on affiche le bandeau d'alerte rouge.
  if (isOnline && !message) return null;

  const backgroundColor = isOnline ? '#dcfce7' : '#fee2e2';
  const borderColor = isOnline ? '#22c55e' : '#ef4444';
  const textColor = isOnline ? '#16a34a' : '#dc2626';
  const iconName = isOnline ? 'wifi' : 'cloud-offline-outline';
  const displayText = message || 'Mode Hors-ligne Actif (Affichage des données locales)';

  return (
    <View style={[styles.banner, { backgroundColor, borderColor }]}>
      <Ionicons name={iconName} size={16} color={textColor} style={{ marginRight: 6 }} />
      <Text style={[styles.text, { color: textColor }]}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    zIndex: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});