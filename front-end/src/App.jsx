import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

// Stores
import { useAuthStore } from './store/authStore';
import { useOfflineStore } from './store/offlineStore';
import { useUiStore } from './store/uiStore';

// Le routeur principal que vous aviez créé mais pas branché !
import AppNavigator from './components/navigation/AppNavigator';

// Composant global d'alerte
import ModalAlert from './components/ModalAlert';

const App = () => {
  const { initializeAuth } = useAuthStore();
  const { setIsOnline } = useOfflineStore();
  const { globalModal, hideModal } = useUiStore();

  useEffect(() => {
    initializeAuth();

    // Écoute de l'état du réseau pour basculer en mode Offline-First
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, [initializeAuth, setIsOnline]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>

      <ModalAlert
        visible={globalModal.visible}
        title={globalModal.title}
        message={globalModal.message}
        type={globalModal.type}
        onClose={hideModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;