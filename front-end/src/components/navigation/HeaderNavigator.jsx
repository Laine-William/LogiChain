import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Modal, Pressable } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useOfflineStore } from '../../store/offlineStore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/navigation/HeaderNavigator';
import ModalConfirm from '../../components/ModalConfirm';

const NetworkIndicator = () => {
    const { isOnline } = useOfflineStore();

    return (
        <View style={styles.networkIndicatorContainer}>
            <Ionicons 
                name={isOnline ? "wifi" : "cloud-offline"} 
                size={16} 
                color={isOnline ? "#4ade80" : "#f87171"} 
            />
        </View>
    );
};

export const UserStatusBadge = () => {
    const { user, setStatus } = useAuthStore();
    const [modalVisible, setModalVisible] = useState(false);

    const currentStatus = user?.availabilityStatus || 'offline';

    const status = [
        { key: 'online', label: 'En ligne', color: '#4ade80' },
        { key: 'busy', label: 'Occupée', color: '#facc15' },
        { key: 'move', label: 'En déplacement', color: '#38bdf8' },
        { key: 'absent', label: 'Absent(e)', color: '#94a3b8' },
        { key: 'offline', label: 'Hors-ligne', color: '#f87171' },
    ];

    const currentConfig = status.find(s => s.key === currentStatus) || status[status.length - 1];

    const handleSelectStatus = (statusKey) => {
        setStatus(statusKey);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity 
                onPress={() => setModalVisible(true)} 
                style={styles.statusBadgeContainer}
            >
                <View style={[styles.statusBadgeDot, { backgroundColor: currentConfig.color }]} />
                <Text style={styles.statusBadgeText}>{currentConfig.label}</Text>
                <Ionicons name="chevron-down" size={12} color="#ffffff" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable 
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeaderTitle}>
                            Mon statut
                        </Text>

                        {status.map((item) => {
                            const isActive = currentStatus === item.key;
                            return (
                                <TouchableOpacity
                                    key={item.key}
                                    onPress={() => handleSelectStatus(item.key)}
                                    style={[
                                        styles.dropdownItem,
                                        { backgroundColor: isActive ? '#f8fafc' : 'transparent' }
                                    ]}
                                >
                                    <View style={[styles.dropdownDot, { backgroundColor: item.color }]} />
                                    <Text style={isActive ? styles.dropdownTextActive : styles.dropdownText}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export const LogoutButton = () => {
    const { logout } = useAuthStore();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleLogoutConfirm = async () => {
        try {
            setIsModalVisible(false);
            await logout();
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    };

    return (
        <>
            <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={20} color="#000000" /> 
            </TouchableOpacity>

            <ModalConfirm
                visible={isModalVisible}
                title="Déconnexion"
                message="Êtes-vous sûr de vouloir vous déconnecter de LogiChain ?"
                type="warning"
                confirmText="Se déconnecter"
                cancelText="Annuler"
                onConfirm={handleLogoutConfirm}
                onCancel={() => setIsModalVisible(false)}
            />
        </>
    );
};

export const DashboardHeaderTitle = ({ title, showIcon = false }) => {
    const route = useRoute();
    const navigation = useNavigation();

    const isDashboard = route.name === 'DashboardMain';

    // Définit le titre dynamiquement : prop personnalisée
    const displayTitle = title;

    return (
        <TouchableOpacity 
            onPress={() => {
                if (isDashboard) {
                    navigation.getParent()?.navigate('ProfileTab');
                }
            }}
            style={styles.headerTitleContainer}
            activeOpacity={isDashboard ? 0.7 : 1}
            disabled={!isDashboard}
        >
            {/* L'affichage de l'icône dépend maintenant uniquement de la prop showIcon */}
            {showIcon && (
                <View style={styles.headerIconContainer}>
                    <Ionicons name="person" size={16} color="#ffffff" />
                </View>
            )}
            <View>
                <Text style={styles.headerSubtitle}>{displayTitle}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const headerScreenOptions = {
    headerStyle: styles.header,
    headerTintColor: '#ffffff',
    headerTitleStyle: styles.headerTitle,
    headerRight: () => (
        <View style={styles.headerRightContainer}>
            <NetworkIndicator />
            <UserStatusBadge />
            <LogoutButton />
        </View>
    ),
};