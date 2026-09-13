import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/components/ModalConfirm'; // Vous pouvez réutiliser les styles de ModalAlert ou en créer un dédié

/**
 * Composant de modale de confirmation avec deux boutons d'action.
 * @param {{ visible: boolean, title: string, message: string, onConfirm: function, onCancel: function, type?: 'error' | 'success' | 'warning' | 'info', confirmText?: string, cancelText?: string }} props
 */
const ModalConfirm = ({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  type = 'warning', 
  confirmText = 'Confirmer', 
  cancelText = 'Annuler' 
}) => {
  
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
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { borderColor: alertColor, borderWidth: 2 }]}>
          
          {/* Croix de fermeture (agit comme un Annuler) */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={16} color={alertColor} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: alertColor }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {/* Conteneur des deux boutons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: alertColor }]} 
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ModalConfirm;