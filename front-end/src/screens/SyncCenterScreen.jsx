import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/SyncCenterScreen';
import PrimaryButton from '../components/Button';
import TopBannerNotification from '../components/TopBannerNotification';
import { useSyncQueue } from '../hooks/useSyncQueue';
import { useOfflineStore } from '../store/offlineStore';

const SyncCenterScreen = () => {
  const { pendingQueueCount, isSyncing, triggerSync } = useSyncQueue();
  const { isOnline } = useOfflineStore();
  const [networkMessage, setNetworkMessage] = useState(null);
  const prevIsOnline = useRef(isOnline);

  useEffect(() => {
    if (!prevIsOnline.current && isOnline) {
      setNetworkMessage('Réseau rétablit - Synchronisation en cours');
      const timer = setTimeout(() => setNetworkMessage(null), 4000);
      return () => clearTimeout(timer);
    }
    prevIsOnline.current = isOnline;
  }, [isOnline]);

  return (
    <View style={styles.container}>
      <TopBannerNotification isOnline={isOnline} message={networkMessage} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={styles.title}>Centre de Synchronisation</Text>
        <Text style={styles.status}>Actions en attente : {pendingQueueCount}</Text>
        <PrimaryButton 
          title={isSyncing ? "Synchronisation en cours..." : "Lancer la synchro"} 
          onPress={triggerSync} 
          isLoading={isSyncing} 
        />
      </View>
    </View>
  );
};

export default SyncCenterScreen;