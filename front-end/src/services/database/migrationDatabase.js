import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'logichain_offline.db';

export const getDBConnection = async () => {
  
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};

export const createTables = async (db) => {
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    -- Table des Événements
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT,
      name TEXT NOT NULL,
      description TEXT,
      startDate TEXT,
      endDate TEXT,
      zones TEXT,
      status TEXT,
      isDeleted INTEGER DEFAULT 0,
      _syncStatus TEXT DEFAULT 'synced'
    );

    -- Table des Items & Scans
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      isDeleted INTEGER DEFAULT 0,
      _syncStatus TEXT DEFAULT 'synced'
    );

    -- Table des Anomalies géolocalisées
    CREATE TABLE IF NOT EXISTS anomalies (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT,
      eventId TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT,
      severity TEXT,
      status TEXT,
      isDeleted INTEGER DEFAULT 0,
      _syncStatus TEXT DEFAULT 'synced'
    );

    -- Table des Routes Logistiques et de leurs étapes (en JSON)
    CREATE TABLE IF NOT EXISTS logistics (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT,
      eventId TEXT,
      departureDestination TEXT NOT NULL,
      departurePosition TEXT NOT NULL,
      arrivalDestination TEXT NOT NULL,
      arrivalPosition TEXT NOT NULL,
      totalDistance REAL,
      totalFuelConsumption REAL,
      status TEXT,
      steps TEXT,
      isDeleted INTEGER DEFAULT 0,
      _syncStatus TEXT DEFAULT 'synced'
    );

    -- =========================================================================
    -- NOUVELLE TABLE CENTRALE DE LISTE D'ATTENTE (Anomalies, Événements, Flux, Étapes, Scans)
    -- =========================================================================
    CREATE TABLE IF NOT EXISTS central_waiting_list (
      id TEXT PRIMARY KEY NOT NULL,
      entity_type TEXT NOT NULL,     -- 'event', 'anomaly', 'flow', 'step', 'scan'
      action_type TEXT NOT NULL,     -- 'CREATE', 'UPDATE', 'DELETE'
      payload TEXT NOT NULL,         -- Données sérialisées en JSON
      status TEXT DEFAULT 'pending', -- 'pending', 'syncing', 'synced', 'failed'
      retry_count INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );
  `);
};

export const initDatabase = async () => {
  
  try {
  
    const db = await getDBConnection();
    
    await createTables(db);
    
    console.log('Base de données SQLite initialisée avec succès.');
    
    return db;
  } catch (error) {
    
    console.error("Erreur lors de l'initialisation de la base SQLite", error);
    
    throw error;
  }
};