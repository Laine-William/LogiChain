import { useEffect, useState, useCallback } from 'react';
import queueWorker from '../services/sync/queueWorker';
import { useOfflineStore } from '../store/offlineStore';
import { requestDatabase } from '../services/database/requestDatabase';

export const useSyncQueue = () => {
  const { isOnline, pendingQueueCount, setPendingQueueCount } = useOfflineStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshQueueCount = useCallback(async () => {
    try {
      const queue = await requestDatabase.getQueue();
      setPendingQueueCount(queue.length);
    } catch (error) {
      console.error("Erreur lors de la récupération de la file d'attente", error);
    }
  }, [setPendingQueueCount]);

  useEffect(() => {
    refreshQueueCount();
  }, [refreshQueueCount]);

  useEffect(() => {
    if (isOnline) {
      handleSync();
    }
  }, [isOnline]);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await queueWorker.processQueue();
      await refreshQueueCount();
    } catch (error) {
      console.error("Échec de la synchronisation", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    pendingQueueCount,
    triggerSync: handleSync,
    refreshQueueCount,
  };
};