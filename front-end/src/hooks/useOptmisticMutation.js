import { useState } from 'react';

export const useOptimisticMutation = (mutationFn, rollbackFn) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (optimisticData, realPayload) => {
    setIsLoading(true);
    setError(null);

    // 1. Mise à jour immédiate de l'UI
    if (optimisticData && optimisticData.onOptimisticUpdate) {
      optimisticData.onOptimisticUpdate();
    }

    try {
      // 2. Appel API ou stockage local
      const result = await mutationFn(realPayload);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      // 3. Rollback visuel en cas d'échec
      if (rollbackFn) {
        rollbackFn();
      }
      setIsLoading(false);
      throw err;
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
};