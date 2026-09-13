// --- Gestion des IDs ---
export const cleanId = (id) => {
  if (!id) return '';
  if (typeof id === 'object') {
    return id.$oid || (typeof id.toString === 'function' ? id.toString() : String(id));
  }
  return String(id);
};

// --- Gestion des Dates ---
export const parseDate = (changedAt) => {
  if (!changedAt) return null;
  if (typeof changedAt === 'object' && changedAt.$date) {
      const d = new Date(changedAt.$date);
      return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(changedAt);
  return isNaN(d.getTime()) ? null : d;
};

export const formatDate = (changedAt, fallback = 'Date récente') => {
  const parsed = parseDate(changedAt);
  if (!parsed) return fallback;
  return parsed.toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
  });
};

// --- Calculs logistiques (CO2, Véhicules) ---
export const calculateCO2 = (step) => {
  if (step.fuelConsumption !== undefined && step.fuelConsumption !== null) {
      return parseFloat(step.fuelConsumption).toFixed(1);
  }
  const distance = step.distance || 0;
  const v = (step.vehicle || 'train').toLowerCase();
  const factors = { truck: 0.8, ship: 0.1, plane: 2.5, train: 0.5 };
  const factor = factors[v] || 0.5;
  return parseFloat((distance * factor).toFixed(1));
};

export const getVehicleIcon = (vehicle) => {
  const v = (vehicle || '').toLowerCase();
  switch (v) {
      case 'truck': return 'bus-outline';
      case 'ship': return 'boat-outline';
      case 'plane': return 'airplane-outline';
      case 'train': return 'train-outline';
      default: return 'car-outline';
  }
};

export const getVehicleBadgeDetails = (vehicle) => {
  const v = (vehicle || 'default').toLowerCase();
  switch (v) {
    case 'truck': return { bg: '#e0f2fe', color: '#0369a1', label: 'Camion', icon: 'bus-outline' };
    case 'ship': return { bg: '#e0e7ff', color: '#3730a3', label: 'Navire', icon: 'boat-outline' };
    case 'plane': return { bg: '#fae8ff', color: '#86198f', label: 'Avion', icon: 'airplane-outline' };
    case 'train': return { bg: '#f3e8ff', color: '#6b21a8', label: 'Train', icon: 'train-outline' };
    default: return { bg: '#f1f5f9', color: '#475569', label: vehicle || 'Standard', icon: 'car-outline' };
  }
};

// --- Statuts globaux et de l'historique ---
export const getDerivedGlobalStatus = (currentSteps = [], logisticData = {}) => {
  if (!currentSteps || currentSteps.length === 0) return logisticData?.status || 'starting';
  
  const allCompleted = currentSteps.every(s => s.status === 'completed' || s.status === 'archived');
  const anyInProgress = currentSteps.some(s => s.status === 'in_progress');
  const anyCancelled = currentSteps.some(s => s.status === 'cancelled');
  const anyBlocked = currentSteps.some(s => s.status === 'blocked');

  if (anyCancelled) return 'cancelled';
  if (anyBlocked) return 'on_hold';
  if (allCompleted) return 'delivered';
  if (anyInProgress) return 'in_transit';
  
  return logisticData?.status && logisticData.status !== 'starting' ? logisticData.status : 'in_preparation';
};

export const getGlobalStatusLabel = (status) => {
  const labels = { 
    'starting': 'Démarrage', 
    'in_preparation': 'En préparation', 
    'in_transit': 'En transit', 
    'delivered': 'Livré', 
    'on_hold': 'En pause', 
    'cancelled': 'Annulé', 
    'archived': 'Archivé' 
  };
  return labels[status] || 'Inconnu';
};

export const getDerivedGlobalHistory = (logisticData = {}, steps = []) => {
  const rawHistory = logisticData?.statusHistory || [];
  const currentDerivedStatus = getDerivedGlobalStatus(steps, logisticData);

  if (rawHistory.length > 1) {
      const lastStatus = rawHistory[rawHistory.length - 1].status;
      if (lastStatus !== currentDerivedStatus && currentDerivedStatus === 'delivered') {
          rawHistory.push({
              status: 'delivered',
              changedAt: new Date().toISOString()
          });
      }
      return rawHistory;
  }

  const history = [{ status: 'starting', changedAt: logisticData?.createdAt || new Date().toISOString() }];
  
  if (currentDerivedStatus === 'in_transit' || currentDerivedStatus === 'delivered') {
      history.push({ status: 'in_transit', changedAt: new Date().toISOString() });
  }
  if (currentDerivedStatus === 'delivered') {
      history.push({ status: 'delivered', changedAt: new Date().toISOString() });
  }
  if (currentDerivedStatus === 'cancelled') {
      history.push({ status: 'cancelled', changedAt: new Date().toISOString() });
  }
  if (currentDerivedStatus === 'on_hold') {
      history.push({ status: 'on_hold', changedAt: new Date().toISOString() });
  }

  return history;
};

// --- Détails des statuts (UI / Icônes / Couleurs) ---
export const getStatusDetails = (status) => {
  switch (status) {
      case 'starting': return { color: '#0284c7', label: 'Démarrage', icon: 'play-circle-outline' };
      case 'in_preparation': return { color: '#d97706', label: 'En préparation', icon: 'construct-outline' };
      case 'in_transit': return { color: '#2563eb', label: 'En transit', icon: 'car-outline' };
      case 'delivered': return { color: '#16a34a', label: 'Livré', icon: 'checkmark-circle-outline' };
      case 'on_hold': return { color: '#64748b', label: 'En pause', icon: 'pause-circle-outline' };
      
      case 'to_do': return { color: '#94a3b8', label: 'A faire', icon: 'ellipse-outline' };
      case 'in_progress': return { color: '#d97706', label: 'En cours', icon: 'sync-circle-outline' };
      case 'completed': return { color: '#16a34a', label: 'Terminé', icon: 'checkmark-circle-outline' };
      case 'blocked': return { color: '#dc2626', label: 'Bloqué', icon: 'alert-circle-outline' };
      case 'delayed': return { color: '#c2410c', label: 'Retardé', icon: 'time-outline' };
      case 'cancelled': return { color: '#dc2626', label: 'Annulé', icon: 'close-circle-outline' };
      case 'archived': return { color: '#4b5563', label: 'Archivé', icon: 'archive-outline' };
      
      case 'open': return { color: '#dc2626', label: 'Ouvert', icon: 'alert-circle-outline' };
      case 'resolved': return { color: '#16a34a', label: 'Résolu', icon: 'checkmark-done-circle-outline' };
      case 'closed': return { color: '#4b5563', label: 'Fermé', icon: 'lock-closed-outline' };
      
      default: return { color: '#64748b', label: status || 'Inconnu', icon: 'help-circle-outline' };
  }
};

export const getStepStatusDetails = (status) => {
  switch (status) {
    case 'in_progress': return { bg: '#fef3c7', color: '#d97706', label: 'En cours', icon: 'sync-circle-outline' };
    case 'completed': return { bg: '#dcfce7', color: '#16a34a', label: 'Terminé', icon: 'checkmark-circle-outline' };
    case 'blocked': return { bg: '#fee2e2', color: '#dc2626', label: 'Bloqué', icon: 'alert-circle-outline' };
    case 'delayed': return { bg: '#ffedd5', color: '#c2410c', label: 'Retardé', icon: 'time-outline' };
    case 'cancelled': return { bg: '#f1f5f9', color: '#dc2626', label: 'Annulé', icon: 'close-circle-outline' };
    case 'archived': return { bg: '#f3f4f6', color: '#4b5563', label: 'Archivé', icon: 'archive-outline' };
    default: return { bg: '#f8fafc', color: '#94a3b8', label: 'À faire', icon: 'ellipse-outline' };
  }
};

// --- Fusion timeline (Historique + Anomalies) ---
export const getMixedTimeline = (step, anomaliesMap = {}) => {
  const stepId = cleanId(step._id);
  
  const historyItems = (step.statusHistory || []).map(sh => ({
      type: 'status',
      status: sh.status,
      date: parseDate(sh.changedAt),
      raw: sh
  }));

  const stepAnomalies = anomaliesMap[stepId] || [];
  const anomalyItems = stepAnomalies.map(anomaly => ({
      type: 'anomalie',
      title: anomaly.reason ? `Anomalie : ${anomaly.reason}` : 'Anomalie signalée',
      description: anomaly.description || '',
      status: anomaly.status,
      coordinates: anomaly.location?.coordinates,
      date: parseDate(anomaly.createdAt),
      severity: anomaly.severity,
      raw: anomaly
  }));

  return [...historyItems, ...anomalyItems].sort((a, b) => {
      const timeA = a.date ? a.date.getTime() : 0;
      const timeB = b.date ? b.date.getTime() : 0;
      return timeA - timeB;
  });
};

// --- Autres fonctions utiles (Items / Matériel) ---
export const getItemStatusDetails = (status) => {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'available': return { bg: '#dcfce7', border: '#16a34a', color: '#15803d', label: 'Disponible' };
    case 'in_use': return { bg: '#fee2e2', border: '#dc2626', color: '#b91c1c', label: 'En service' };
    case 'reserved': return { bg: '#ffedd5', border: '#f97316', color: '#c2410c', label: 'Réservé' };
    case 'maintenance': return { bg: '#fef3c7', border: '#d97706', color: '#b45309', label: 'En maintenance' };
    case 'archived': return { bg: '#f3f4f6', border: '#9ca3af', color: '#4b5563', label: 'Archivé' };
    default: return { bg: '#f1f5f9', border: '#cbd5e1', color: '#475569', label: status || 'Inconnu' };
  }
};

export const filterVisibleItems = (items, itemsDetailsMap) => {
  if (!items) return [];
  return items.filter((item) => {
    const isObject = typeof item === 'object' && item !== null;
    const itemId = isObject ? (item._id || item.id) : item;
    const cleanedId = cleanId(itemId);
    
    const fetchedItem = itemsDetailsMap[cleanedId];
    const itemStatus = (isObject ? (item.status || 'available') : (fetchedItem?.status || 'available')).toLowerCase();
    return itemStatus !== 'archived' && itemStatus !== 'maintenance';
  });
};

export const getItemTypeLabel = (type) => {
  const t = (type || '').toLowerCase();
  const types = {
    'metal structure': 'Structure métallique',
    'sound system': 'Sonorisation',
    'lighting': 'Éclairage',
    'video': 'Vidéo',
    'genrator': 'Groupe électrogène',
    'barrier': 'Barrière',
    'cables / accessories': 'Câbles et accessoires',
    'structure métallique': 'Structure métallique',
    'sonorisation': 'Sonorisation',
    'eclairage': 'Éclairage',
    'groupe electrogene': 'Groupe électrogène',
    'cables et accessoires': 'Câbles et accessoires',
    'autre': 'Autre'
  };
  return types[t] || type || 'Autre';
};