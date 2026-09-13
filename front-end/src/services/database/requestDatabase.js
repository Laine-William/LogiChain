import { getDatabaseInstance } from './localStorageDatabase';

export const requestDatabase = {
  
  // --- GESTION DE LA TABLE CENTRALE (LISTE D'ATTENTE UNIFIÉE) ---
  addToCentralQueue: async (entityType, actionType, payload) => {

    const db = await getDatabaseInstance();

    const id = 'central_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    
    const query = `
      INSERT OR REPLACE INTO central_waiting_list (id, entity_type, action_type, payload, status, retry_count, createdAt) 
      VALUES (?, ?, ?, ?, 'pending', 0, ?);
    `;
    
    await db.runAsync(query, [
      id,
      entityType,
      actionType,
      JSON.stringify(payload),
      new Date().toISOString()
    ]);

    return id;
  },

  getCentralQueue: async () => {

    const db = await getDatabaseInstance();

    const rows = await db.getAllAsync(`SELECT * FROM central_waiting_list WHERE status = 'pending' ORDER BY createdAt ASC;`);

    return rows.map(row => ({
      ...row,
      payload: JSON.parse(row.payload)
    }));
  },

  updateCentralQueueStatus: async (id, status, retryCount = 0) => {

    const db = await getDatabaseInstance();

    await db.runAsync(
      `UPDATE central_waiting_list SET status = ?, retry_count = ? WHERE id = ?;`,
      [status, retryCount, id]
    );
  },

  removeFromCentralQueue: async (id) => {

    const db = await getDatabaseInstance();

    await db.runAsync(`DELETE FROM central_waiting_list WHERE id = ?;`, [id]);
  },

  // --- GESTION DES EVENTS EN LOCAL ---
  saveEventLocal: async (event, syncStatus = 'synced') => {

    const db = await getDatabaseInstance();

    const query = `
      INSERT OR REPLACE INTO events (id, userId, name, description, startDate, endDate, zones, status, isDeleted, _syncStatus) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    await db.runAsync(query, [
      event.id || Math.random().toString(),
      event.userId,
      event.name,
      event.description,
      event.startDate,
      event.endDate,
      JSON.stringify(event.zones || []),
      event.status,
      event.isDeleted ? 1 : 0,
      syncStatus
    ]);
  },

  getEventsLocal: async () => {

    const db = await getDatabaseInstance();

    const rows = await db.getAllAsync(`SELECT * FROM events WHERE isDeleted = 0;`);

    return rows.map(item => ({ ...item, zones: JSON.parse(item.zones || '[]') }));
  },

  // --- GESTION DES ANOMALIES EN LOCAL (Mode dégradé) ---
  saveAnomalyLocal: async (anomaly, syncStatus = 'pending') => {

    const db = await getDatabaseInstance();

    const query = `
      INSERT OR REPLACE INTO anomalies (id, userId, eventId, description, location, severity, status, isDeleted, _syncStatus) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    await db.runAsync(query, [
      anomaly.id || 'local_' + Date.now(),
      anomaly.userId,
      anomaly.eventId,
      anomaly.description,
      JSON.stringify(anomaly.location),
      anomaly.severity,
      anomaly.status,
      0,
      syncStatus
    ]);
  },

  // --- GESTION DE LA LOGISTIQUE ET DES ÉTAPES EN LOCAL ---
  saveLogisticLocal: async (logistic, syncStatus = 'synced') => {

    const db = await getDatabaseInstance();

    const query = `
      INSERT OR REPLACE INTO logistics (id, userId, eventId, departureDestination, departurePosition, arrivalDestination, arrivalPosition, totalDistance, totalFuelConsumption, status, steps, isDeleted, _syncStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const userIdArray = Array.isArray(logistic.userId) ? logistic.userId : [];

    await db.runAsync(query, [
      logistic.id || Math.random().toString(),
      JSON.stringify(userIdArray),
      logistic.eventId || null,
      logistic.departureDestination,
      JSON.stringify(logistic.departurePosition || null),
      logistic.arrivalDestination,
      JSON.stringify(logistic.arrivalPosition || null),
      logistic.totalDistance,
      logistic.totalFuelConsumption || 0,
      logistic.status,
      JSON.stringify(logistic.steps || []),
      logistic.isDeleted ? 1 : 0,
      syncStatus
    ]);
  },

  getLogisticsLocal: async () => {

    const db = await getDatabaseInstance();

    const rows = await db.getAllAsync(`SELECT * FROM logistics WHERE isDeleted = 0;`);

    return rows.map(item => ({
      ...item,
      userId: JSON.parse(item.userId || '[]'),
      departurePosition: item.departurePosition ? JSON.parse(item.departurePosition) : null,
      arrivalPosition: item.arrivalPosition ? JSON.parse(item.arrivalPosition) : null,
      steps: JSON.parse(item.steps || '[]')
    }));
  }
};