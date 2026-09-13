import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ItemScreen';
import ModalAlert from '../components/ModalAlert';
import ModalConfirm from '../components/ModalConfirm';
import TopBannerNotification from '../components/TopBannerNotification';
import { useOfflineStore } from '../store/offlineStore';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api/clientApi';
import { requestDatabase } from '../services/database/requestDatabase';
import { getDatabaseInstance } from '../services/database/localStorageDatabase';
import { item_status } from '../schemas/constants/constants';

const ItemScreen = ({ navigation }) => {
  const { isOnline } = useOfflineStore();
  const [networkMessage, setNetworkMessage] = useState(null);
  const prevIsOnline = useRef(isOnline);

  const { user, role } = useAuthStore();
  const currentRole = role || user?.role;
  const isAdmin = currentRole === 'admin';

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [refreshing, setRefreshing] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'success' });

  // Modale d'édition (Statut et Quantité)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('available');
  const [updatedQuantity, setUpdatedQuantity] = useState('1');
  const [isSaving, setIsSaving] = useState(false);

  // Modale de suppression
  const [deleteModal, setDeleteModal] = useState({ visible: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!prevIsOnline.current && isOnline) {
      setNetworkMessage('Réseau rétablit - Synchronisation en cours');
      const timer = setTimeout(() => setNetworkMessage(null), 4000);
      return () => clearTimeout(timer);
    }
    prevIsOnline.current = isOnline;
  }, [isOnline]);

  const cleanId = (id) => {
    if (!id) return '';
    if (typeof id === 'object') {
      return id.$oid || (typeof id.toString === 'function' ? id.toString() : String(id));
    }
    return String(id);
  };

  const fetchItems = async () => {
    try {
      let dataList = [];

      if (isOnline) {
        try {
          const response = await apiClient.get('/items');
          if (response.data) {
            dataList = response.data;
            
            // 🟢 Mise en cache locale automatique dans SQLite
            dataList.forEach(async (item) => {
              try {
                const db = await getDatabaseInstance();
                await db.runAsync(
                  `INSERT OR REPLACE INTO items (id, userId, name, status, isDeleted, _syncStatus) VALUES (?, ?, ?, ?, ?, ?)`,
                  [cleanId(item._id || item.id), item.userId || null, item.name, item.status || 'available', item.isDeleted ? 1 : 0, 'synced']
                );
              } catch (cacheErr) {
                console.warn("⚠️ Erreur mise en cache item :", cacheErr);
              }
            });
          }
        } catch (apiError) {
          console.warn("⚠️ Erreur API items, bascule locale :", apiError.message);
        }
      }

      // 🟢 CORRECTION : Fallback local SQLite sécurisé si hors-ligne ou si l'API échoue
      if (!isOnline || dataList.length === 0) {
        const db = await getDatabaseInstance();
        const localRows = await db.getAllAsync(`SELECT * FROM items WHERE isDeleted = 0;`);
        
        dataList = localRows.map(row => ({
          ...row,
          details: row.details ? JSON.parse(row.details) : {}
        }));
      }

      setItems(dataList);
      applyFilters(dataList, searchQuery, statusFilter);
    } catch (error) {
      console.warn("⚠️ Erreur chargement équipements :", error.message);
      setAlert({ visible: true, title: 'Erreur', message: "Impossible de récupérer les équipements.", type: 'error' });
    }
  };

  useEffect(() => {
    fetchItems();
  }, [isOnline]);

  // Rafraîchir automatiquement la liste au retour du formulaire d'ajout
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchItems();
    });
    return unsubscribe;
  }, [navigation]);

  const onPullToRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const applyFilters = (dataList, query, status) => {
    // Exclure d'office les éléments marqués comme supprimés
    let result = dataList.filter(item => !item.isDeleted);

    // Filtre par recherche (nom ou ID)
    if (query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      result = result.filter(item => 
        item.name?.toLowerCase().includes(lowerQuery) || 
        cleanId(item._id || item.id).toLowerCase().includes(lowerQuery)
      );
    }

    // Filtre par statut (si un statut spécifique est sélectionné et qu'il correspond aux résultats)
    if (status !== 'all') {
      result = result.filter(item => item.status === status);
    }

    setFilteredItems(result);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    applyFilters(items, text, statusFilter);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    applyFilters(items, searchQuery, status);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setUpdatedStatus(item.status || 'available');
    setUpdatedQuantity(String(item.quantity || 1));
    setEditModalVisible(true);
  };

  const handleSaveItemChanges = async () => {
    if (!selectedItem) return;
    const itemId = cleanId(selectedItem._id || selectedItem.id);

    if (!isOnline) {
      setAlert({ visible: true, title: 'Hors-ligne', message: "Impossible de modifier les données sans connexion.", type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      if (updatedStatus !== selectedItem.status) {
        await apiClient.patch(`/items/${itemId}/status`, { status: updatedStatus });
      }

      if (parseInt(updatedQuantity, 10) !== selectedItem.quantity) {
        await apiClient.patch(`/items/${itemId}`, { quantity: parseInt(updatedQuantity, 10) });
      }

      setEditModalVisible(false);
      setAlert({ visible: true, title: 'Succès', message: "Équipement mis à jour avec succès.", type: 'success' });
      fetchItems();
    } catch (error) {
      console.error("❌ Erreur mise à jour équipement :", error.response?.data || error.message);
      setAlert({ visible: true, title: 'Erreur', message: error.response?.data?.message || "Échec de la mise à jour.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;
    const itemId = cleanId(deleteModal.item._id || deleteModal.item.id);

    if (!isOnline) {
      setAlert({ visible: true, title: 'Hors-ligne', message: "Impossible de supprimer un équipement sans connexion.", type: 'error' });
      setDeleteModal({ visible: false, item: null });
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.delete(`/items/${itemId}`);
      setDeleteModal({ visible: false, item: null });
      setAlert({ visible: true, title: 'Supprimé', message: "L'équipement a été supprimé avec succès.", type: 'success' });
      fetchItems();
    } catch (error) {
      console.error("❌ Erreur suppression équipement :", error.response?.data || error.message);
      setAlert({ visible: true, title: 'Erreur', message: error.response?.data?.message || "Échec de la suppression.", type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const getItemStatusDetails = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'available': return { bg: '#dcfce7', color: '#16a34a', label: 'Disponible' };
      case 'in_use': return { bg: '#fef3c7', color: '#d97706', label: 'En service' };
      case 'maintenance': return { bg: '#fee2e2', color: '#dc2626', label: 'En maintenance' };
      case 'reserved': return { bg: '#e0e7ff', color: '#3730a3', label: 'Réservé' };
      case 'archived': return { bg: '#f1f5f9', color: '#475569', label: 'Archivé' };
      default: return { bg: '#f1f5f9', color: '#475569', label: status || 'Inconnu' };
    }
  };

  // Récupération dynamique des statuts présents dans les éléments filtrés par la recherche
  const baseListForStatuses = searchQuery.trim() !== '' 
    ? items.filter(item => !item.isDeleted && (
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cleanId(item._id || item.id).toLowerCase().includes(searchQuery.toLowerCase())
      ))
    : items.filter(item => !item.isDeleted);

  const availableStatusesInSearch = ['all', ...item_status.filter(st => 
    baseListForStatuses.some(item => item.status === st)
  )];

  return (
    <View style={styles.container}>
      <TopBannerNotification isOnline={isOnline} message={networkMessage} />
      
      {/* BARRE DE RECHERCHE */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom ou référence..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearchChange('')}>
            <Ionicons name="close-circle" size={18} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* FILTRES PAR ÉTAT DYNAMIQUES */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={availableStatusesInSearch}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterListContent}
          renderItem={({ item }) => {
            const isSelected = statusFilter === item;
            const label = item === 'all' ? 'Tous' : getItemStatusDetails(item).label;
            return (
              <TouchableOpacity
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => handleStatusFilterChange(item)}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* 🟢 COMPTEUR D'ÉLÉMENTS */}
      <View style={{ marginBottom: 10, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '500' }}>
          {filteredItems.length} équipement{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* LISTE DES ÉQUIPEMENTS */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => cleanId(item._id || item.id)}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onPullToRefresh} colors={['#0056b3']} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun équipement trouvé.</Text>
        }
        renderItem={({ item }) => {
          const statusInfo = getItemStatusDetails(item.status);
          return (
            <View style={styles.itemCard}>
              <View style={styles.itemHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemRef}>Réf : {cleanId(item._id || item.id).slice(-8).toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                </View>
              </View>

              <View style={styles.itemFooterRow}>
                <Text style={styles.itemQuantity}>Quantité : <Text style={{ fontWeight: 'bold' }}>{item.quantity || 1}</Text></Text>
                
                {isAdmin && (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity 
                      style={styles.editButton} 
                      onPress={() => handleOpenEditModal(item)}
                    >
                      <Ionicons name="create-outline" size={16} color="#0056b3" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.editButton, { backgroundColor: '#fee2e2' }]} 
                      onPress={() => setDeleteModal({ visible: true, item })}
                    >
                      <Ionicons name="trash-outline" size={16} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* BOUTON FLOTTANT (FAB) POUR AJOUTER UN ÉQUIPEMENT */}
      {isAdmin && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('ItemForm')}
        >
          <Ionicons name="add" size={28} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* MODALE DE MODIFICATION */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Modifier l'équipement</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Nom : <Text style={{ fontWeight: 'bold' }}>{selectedItem.name}</Text></Text>

                <Text style={styles.modalLabel}>Quantité</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={updatedQuantity}
                  onChangeText={setUpdatedQuantity}
                />

                <Text style={styles.modalLabel}>Statut</Text>
                <View style={styles.statusOptionsContainer}>
                  {item_status.map((st) => {
                    const info = getItemStatusDetails(st);
                    const isSelected = updatedStatus === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        style={[
                          styles.statusOptionButton,
                          { backgroundColor: isSelected ? info.bg : '#f1f5f9', borderColor: isSelected ? info.color : '#cbd5e1' }
                        ]}
                        onPress={() => setUpdatedStatus(st)}
                      >
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: isSelected ? info.color : '#475569' }}>
                          {info.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.modalActionsRow}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalSubmitButton} 
                onPress={handleSaveItemChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSubmitButtonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
      <ModalConfirm 
        visible={deleteModal.visible}
        title="Supprimer l'équipement ?"
        message={`Voulez-vous vraiment supprimer l'équipement "${deleteModal.item?.name}" ?`}
        type="warning"
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ visible: false, item: null })}
      />

      <ModalAlert 
        visible={alert.visible} 
        title={alert.title} 
        message={alert.message} 
        type={alert.type} 
        onClose={() => setAlert({ ...alert, visible: false })} 
      />
    </View>
  );
};

ItemScreen.displayName = 'ItemScreen';

export default ItemScreen;