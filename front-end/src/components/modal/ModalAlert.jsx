import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/components/ModalAlert';

/**
 * Composant de modale pour les alertes bloquantes ou informatives.
 * @param {{ visible: boolean, title: string, message: string, onClose: function, type?: 'error' | 'success' | 'warning' | 'info', duration?: number }} props
 */
const ModalAlert = ({ visible, title, message, onClose, type = 'info', duration }) => {
  
  // 🟢 Gestion de la fermeture automatique si une durée (en ms) est fournie
  useEffect(() => {
    if (visible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer); // Nettoyage du timer si la modale se ferme avant
    }
  }, [visible, duration, onClose]);

  const getAlertColor = () => {
    switch (type) {
      case 'error': return '#dc3545';   // Rouge
      case 'success': return '#28a745'; // Vert
      case 'warning': return '#ffc107'; // Jaune
      default: return '#0056b3';        // Bleu (Info)
    }
  };

  const alertColor = getAlertColor();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={
          [
            styles.modalContainer,
            { borderColor: alertColor, borderWidth: 2 }
          ]
        }>
          
          {/* Petite croix ronde de fermeture en haut à droite */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={16} color={alertColor} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: alertColor }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
        </View>
      </View>
    </Modal>
  );
};

export default ModalAlert;