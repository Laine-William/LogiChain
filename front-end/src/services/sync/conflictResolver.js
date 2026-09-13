/**
 * Résout les conflits de synchronisation (Stratégie de résolution par verrouillage optimiste)
 */
export const conflictResolver = {
  resolveConflict: (localData, serverData) => {
    console.warn("Conflit de données détecté entre le client et le serveur.");
    
    // Exemple de stratégie de résolution : 
    // On compare les dates de mise à jour (Last-Write-Wins) ou on force la version serveur
    const localUpdatedAt = new Date(localData.updatedAt || 0);
    const serverUpdatedAt = new Date(serverData.updatedAt || 0);

    if (localUpdatedAt > serverUpdatedAt) {
      console.log("La version locale est plus récente. Application de la modification locale.");
      return { strategy: 'KEEP_LOCAL', data: localData };
    } else {
      console.log("La version du serveur est plus récente. Écrasement par la version distante.");
      return { strategy: 'KEEP_SERVER', data: serverData };
    }
  }
};