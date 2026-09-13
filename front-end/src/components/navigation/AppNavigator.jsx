import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/navigation/AppNavigator';

import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useAuthStore } from '../../store/authStore';

const AppNavigator = () => {
  // On récupère l'état d'authentification et de chargement directement depuis le store Zustand
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
    </View>
  );
};

export default AppNavigator;