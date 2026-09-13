import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/components/ModalHistory';

const ModalHistory = ({ visible, step, onClose, getStatusDetails }) => {
  if (!step) return null;

  const history = step.statusHistory || [];
  const locationName = step.location || 'Étape';

  // 🟢 Fonction universelle pour parser la date peu importe son format
  const parseDate = (changedAt) => {
    if (!changedAt) return null;
    
    // Format MongoDB EJSON ({ $date: "..." } ou { $date: timestamp })
    if (typeof changedAt === 'object' && changedAt.$date) {
      const d = new Date(changedAt.$date);
      return isNaN(d.getTime()) ? null : d;
    }
    
    // Format chaîne de caractères, timestamp ou objet Date direct
    const d = new Date(changedAt);
    return isNaN(d.getTime()) ? null : d;
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Header du Modal */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Historique des statuts</Text>
              <Text style={styles.subtitle}>{locationName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Corps de l'historique (Timeline) */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {history.length === 0 ? (
              <Text style={styles.emptyText}>Aucun historique enregistré pour cette étape.</Text>
            ) : (
              <View style={styles.timelineContainer}>
                {history.map((h, index) => {
                  const badge = getStatusDetails(h.status);
                  const isLast = index === history.length - 1;
                  
                  const parsedDate = parseDate(h.changedAt);
                  const dateStr = parsedDate 
                    ? parsedDate.toLocaleString('fr-FR', { 
                        day: '2-digit', month: '2-digit', year: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      }) 
                    : 'Date inconnue';

                  return (
                    <View key={index} style={styles.timelineItem}>
                      
                      {/* Indicateur visuel (Icône + Ligne) */}
                      <View style={styles.timelineIndicator}>
                        <View style={[styles.iconContainer, { backgroundColor: badge.bg }]}>
                          <Ionicons name={badge.icon} size={16} color={badge.color} />
                        </View>
                        {!isLast && <View style={styles.timelineLine} />}
                      </View>
                      
                      {/* Contenu textuel */}
                      <View style={styles.timelineContent}>
                        <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                        <Text style={styles.dateText}>{dateStr}</Text>
                      </View>
                      
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalHistory;