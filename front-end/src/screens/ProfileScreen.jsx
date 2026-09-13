import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useOfflineStore } from '../store/offlineStore';
import { styles } from '../styles/ProfileScreen';
import ModalConfirm from '../components/ModalConfirm';
import TopBannerNotification from '../components/TopBannerNotification';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateAccountStatus } = useAuthStore();
  const { isOnline, pendingQueueCount } = useOfflineStore();
  const [networkMessage, setNetworkMessage] = useState(null);
  const prevIsOnline = useRef(isOnline);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!prevIsOnline.current && isOnline) {
      setNetworkMessage('Réseau rétablit - Synchronisation en cours');
      const timer = setTimeout(() => setNetworkMessage(null), 4000);
      return () => clearTimeout(timer);
    }
    prevIsOnline.current = isOnline;
  }, [isOnline]);

  const handleLogoutConfirm = async () => {
    try {
      setIsModalVisible(false);
      await updateAccountStatus('pending');
      await logout();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut ou de la déconnexion', error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'busy': return 'Occupée';
      case 'out of office': return 'En déplacement';
      case 'absent': return 'Absent(e)';
      case 'pending': return 'En attente';
      default: return 'Hors-ligne';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4ade80';
      case 'busy': return '#facc15';
      case 'out of office': return '#38bdf8';
      case 'absent': return '#94a3b8';
      case 'pending': return '#fb923c';
      default: return '#f87171';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBannerNotification isOnline={isOnline} message={networkMessage} />
      <ScrollView style={styles.container}>
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#0056b3" />
          </View>
          <Text style={styles.fullName}>{user?.fullName || 'Utilisateur'}</Text>
          <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
          
          <View style={styles.badgeContainer}>
            <View style={[styles.dot, { backgroundColor: getStatusColor(user?.availabilityStatus) }]} />
            <Text style={styles.badgeText}>{getStatusLabel(user?.availabilityStatus)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>État de la connexion</Text>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name={isOnline ? "wifi-outline" : "cloud-offline-outline"} 
              size={20} 
              color={isOnline ? "#16a34a" : "#dc2626"} 
            />
            <Text style={styles.infoLabel}>Réseau :</Text>
            <Text style={[styles.infoValue, { color: isOnline ? "#16a34a" : "#dc2626", fontWeight: 'bold' }]}>
              {isOnline ? 'Connecté' : 'Hors-ligne'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="sync-circle-outline" size={20} color="#64748b" />
            <Text style={styles.infoLabel}>Actions en attente :</Text>
            <Text style={styles.infoValue}>
              {pendingQueueCount > 0 ? `${pendingQueueCount} synchro(s) en attente` : 'Synchronisé'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations du compte</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="shield-outline" size={20} color="#64748b" />
            <Text style={styles.infoLabel}>Rôle :</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{user?.role || 'Utilisateur'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#64748b" />
            <Text style={styles.infoLabel}>Statut du compte :</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{user?.accountStatus || 'Actif'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Supprimer le compte</Text>
        </TouchableOpacity>

        <ModalConfirm
          visible={isModalVisible}
          title="Suppression du compte"
          message="Êtes-vous sûr de vouloir supprimer votre compte ?"
          type="error"
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleLogoutConfirm}
          onCancel={() => setIsModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
}