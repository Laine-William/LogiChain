import { initDatabase } from './migrationDatabase';

let dbPromise = null;

export const getDatabaseInstance = async () => {
  
  if (!dbPromise) {
  
    dbPromise = initDatabase().catch(error => {
  
      dbPromise = null; 
  
      console.error("❌ Échec de l'initialisation de la base SQLite :", error);
  
      throw error;
    });
  }
  
  return await dbPromise;
};

export const clearLocalStorage = async () => {
  
  try {
  
    const db = await getDatabaseInstance();

    await db.execAsync(`
      DELETE FROM events;
      DELETE FROM items;
      DELETE FROM anomalies;
      DELETE FROM logistics;
      DELETE FROM sync_queue;
      DELETE FROM central_waiting_list;
    `);

    console.log('Stockage local SQLite vidé avec succès.');
  
  } catch (error) {
  
    console.warn("⚠️ Erreur lors du nettoyage du stockage local :", error.message);
  }
};