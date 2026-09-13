// src/services/sync/queueWorker.js
import { requestDatabase } from '../database/requestDatabase';
import apiClient from '../api/clientApi';
import { conflictResolver } from './conflictResolver';

class QueueWorker {
  
  constructor() {
  
    this.isSyncing = false;
  }

  // Méthode pour lancer la synchronisation de la file d'attente sortante
  async processQueue() {
    
    if (this.isSyncing) return;
    
    this.isSyncing = true;

    try {
      const queue = await requestDatabase.getQueue();
      if (queue.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`Début de la synchronisation : ${queue.length} action(s) en attente.`);

      for (const item of queue) {
        try {
          const payload = JSON.parse(item.payload);
          
          // Exécution de la requête HTTP vers l'API REST
          await apiClient({
            method: item.method,
            url: item.endpoint,
            data: payload,
          });

          // Si l'appel réussit, on retire l'élément de la file d'attente locale[cite: 12]
          await requestDatabase.removeFromQueue(item.id);
          console.log(`Action ${item.id} (${item.endpoint}) synchronisée avec succès.`);
          
        } catch (error) {
          console.error(`Échec de la synchronisation pour l'action ${item.id}:`, error.message);
          
          // Gestion spécifique du conflit (ex: 409 - verrouillage optimiste)
          if (error.response && error.response.status === 409) {
            console.warn("Conflit 409 détecté par le serveur.");
            const serverData = error.response.data;
            const localData = JSON.parse(item.payload);
            
            // Résolution via le resolver
            const resolution = conflictResolver.resolveConflict(localData, serverData);
            
            if (resolution.strategy === 'KEEP_SERVER') {
              // Si la version serveur l'emporte, vous pouvez mettre à jour le cache SQLite local ici
        
              console.log("Mise à jour de la base locale avec les données du serveur.");
              // Exemple selon l'endpoint (à adapter ou généraliser selon vos tables)
            }          
        
            // On retire l'élément en échec de la file pour éviter de bloquer la queue en boucle infinie
            await requestDatabase.removeFromQueue(item.id);
        
            break; 
          }

          // Pour les autres erreurs réseau bloquantes, on stoppe la tentative en cours
          if (!error.response) {
            console.warn("Erreur réseau persistante, interruption de la synchronisation.");
            break;
          }
        }
      }
    } catch (error) {
      console.error('Erreur globale du QueueWorker :', error);
    } finally {
      this.isSyncing = false;
    }
  }
}

export default new QueueWorker();